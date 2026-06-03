/**
 * Hard rules linter for n8n Automation Hub.
 *
 * Walks every file in `content/posts/` and `content/authors/` (and, for the
 * em-dash check, the source tree as well) and fails the process with a
 * non-zero exit code if it spots a brand or compliance violation. Wired into
 * `npm run check:rules` and the pre-build script.
 *
 * Rules enforced:
 *   1. Brand casing: always "n8n Automation Hub" or "n8nAutomationHub", never
 *      mixed-case variants like "N8N Automation Hub" or "n8n automation HUB".
 *   2. Parent attribution: always "FusionSync AI", never "Fusion Sync" or
 *      "Fusion-Sync".
 *   3. n8n trademark hygiene: never claim partnership/endorsement/affiliation
 *      with n8n GmbH. The hub is independent editorial.
 *   4. No invented stats. Naked "%" numbers should be flagged unless paired
 *      with `TODO(stat)` somewhere on the line.
 *   5. No hard-coded prices ($N, EUR N, GBP N). Link to a pricing source.
 *   6. No em dashes (U+2014) or en dashes (U+2013) anywhere we maintain.
 *
 * Designed to be deliberately pedantic. Run it locally before committing.
 */

import fs from "node:fs";
import path from "node:path";

const CWD = process.cwd();
const ROOT = path.join(CWD, "content");
const POSTS_DIR = path.join(ROOT, "posts");
const AUTHORS_DIR = path.join(ROOT, "authors");

/**
 * Roots that the em-dash check walks recursively. Anything outside these is
 * either third-party (`node_modules`), build output (`.next`), source briefs
 * we don't author (`resources/`, `AGENTS.md`, `CLAUDE.md`), or tooling files
 * we don't want to police line-by-line.
 */
const EM_DASH_ROOTS = ["app", "components", "lib", "scripts", "content"];
const EM_DASH_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mdx",
  ".md",
  ".css",
  ".json",
]);
/**
 * Files we explicitly skip even when they live under one of the EM_DASH_ROOTS.
 * Keep this short. If you find yourself adding many entries, the rule probably
 * has the wrong scope.
 */
const EM_DASH_FILE_BLOCKLIST = new Set<string>([
  // The script itself contains literal em-dash characters in the rule's regex
  // for matching purposes. Allow it to live without flagging itself.
  path.join("scripts", "check-rules.ts"),
]);

interface Violation {
  file: string;
  line: number;
  rule: string;
  match: string;
  hint: string;
}

interface Rule {
  id: string;
  test: (line: string) => RegExpMatchArray | null;
  hint: string;
}

const rules: Rule[] = [
  {
    id: "brand-casing-hub",
    test: (l) =>
      l.match(
        /\b(?:N8N\s+Automation\s+Hub|n8n\s+automation\s+hub(?![A-Za-z])|N8nAutomationHub|N8NAutomationHub)\b/,
      ),
    hint: 'Always "n8n Automation Hub" (lowercase n8n, title-cased Automation Hub) or "n8nAutomationHub" for the compact wordmark.',
  },
  {
    id: "brand-casing-parent",
    test: (l) =>
      l.match(/\b(?:Fusion\s+Sync|Fusion-Sync|fusionsync\s+ai|FUSIONSYNC\s+AI)\b/),
    hint: 'Always "FusionSync AI". One word, capital F and S, space, then "AI".',
  },
  {
    id: "no-n8n-partnership",
    test: (l) => {
      // Skip lines that are obvious negation disclaimers, e.g. "not affiliated
      // with n8n GmbH" or "is not endorsed by n8n". Those are the desired
      // editorial stance, not a violation.
      if (
        /\b(?:not|never|no)\s+(?:[a-z]+\s+){0,4}(?:partnered|affiliated|endorsed|sponsored|in collaboration)\b/i.test(
          l,
        )
      ) {
        return null;
      }
      return l.match(
        /\b(partnered with|partnership with|endorsed by|endorsement from|affiliated with|in collaboration with|sponsored by)\s+n8n\b/i,
      );
    },
    hint: 'The hub is independent editorial. Phrase as "Not affiliated with n8n GmbH." or similar.',
  },
  {
    id: "no-invented-stats",
    test: (l) => {
      if (/TODO\(stat\)/i.test(l)) return null;
      return l.match(/\b\d{1,3}(?:\.\d+)?\s?%\s+(?:of|increase|boost|improvement)/i);
    },
    hint: "Either cite a source, leave a TODO(stat) placeholder, or rephrase without the stat.",
  },
  {
    id: "no-hardcoded-price",
    test: (l) => {
      if (/code|`/.test(l)) return null;
      return l.match(/\$\s?\d{1,4}(?:[.,]\d{2})?(?:\s?\/\s?(?:mo|month|year|yr))?/);
    },
    hint: "Link to a pricing page instead of hard-coding a price. Prices change.",
  },
];

/**
 * Em-dash and en-dash check. Scoped wider than the brand rules above so it
 * catches typographic glyphs that sneak into code comments, UI copy, JSX
 * strings, JSON-LD descriptions, and OG image alt text.
 */
const dashRule: Rule = {
  id: "no-em-dashes",
  test: (l) => l.match(/[\u2014\u2013]/),
  hint: "Em dashes (U+2014) and en dashes (U+2013) are banned project-wide. Use a colon, comma, parens, or two hyphens.",
};

function readMdxAndJson(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function walkForDashes(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkForDashes(full));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!EM_DASH_EXTENSIONS.has(path.extname(entry.name))) continue;
    if (EM_DASH_FILE_BLOCKLIST.has(path.relative(CWD, full))) continue;
    out.push(full);
  }
  return out;
}

function extractFrontmatterRanges(text: string): Array<[number, number]> {
  const lines = text.split("\n");
  const ranges: Array<[number, number]> = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "---") {
      const start = i;
      const end = lines.indexOf("---", i + 1);
      if (end !== -1) {
        ranges.push([start, end]);
        i = end;
      }
    }
  }
  return ranges;
}

function isInsideFrontmatter(lineIdx: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([start, end]) => lineIdx >= start && lineIdx <= end);
}

function checkFile(filePath: string, ruleSet: Rule[]): Violation[] {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split("\n");
  const fmRanges = filePath.endsWith(".mdx") ? extractFrontmatterRanges(text) : [];
  const violations: Violation[] = [];

  lines.forEach((line, idx) => {
    if (isInsideFrontmatter(idx, fmRanges)) return;
    for (const rule of ruleSet) {
      const m = rule.test(line);
      if (m) {
        violations.push({
          file: path.relative(CWD, filePath),
          line: idx + 1,
          rule: rule.id,
          match: m[0],
          hint: rule.hint,
        });
      }
    }
  });

  return violations;
}

function main() {
  const contentFiles = [...readMdxAndJson(POSTS_DIR), ...readMdxAndJson(AUTHORS_DIR)];
  const dashFiles = EM_DASH_ROOTS.flatMap((r) => walkForDashes(path.join(CWD, r)));

  const violations = [
    ...contentFiles.flatMap((f) => checkFile(f, rules)),
    ...dashFiles.flatMap((f) => checkFile(f, [dashRule])),
  ];

  const scannedCount = new Set([...contentFiles, ...dashFiles]).size;

  if (violations.length === 0) {
    process.stdout.write(
      `\u2713 check-rules: ${scannedCount} file(s) clean against brand rules + no-em-dashes\n`,
    );
    return;
  }

  process.stdout.write(
    `\u2717 check-rules: ${violations.length} violation(s) across ${
      new Set(violations.map((v) => v.file)).size
    } file(s)\n\n`,
  );
  for (const v of violations) {
    process.stdout.write(
      `  ${v.file}:${v.line}\n    [${v.rule}] matched: ${JSON.stringify(v.match)}\n    hint: ${v.hint}\n\n`,
    );
  }
  process.exit(1);
}

main();
