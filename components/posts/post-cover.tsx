import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/content/categories";

/** Deterministic layout + palette per post slug */
const LAYOUTS = [
  {
    nodes: [
      { x: 28, y: 52, w: 88, h: 36, label: "Trigger", accent: "#ea4b71" },
      { x: 148, y: 38, w: 96, h: 36, label: "Filter", accent: "#5b60e8" },
      { x: 148, y: 88, w: 96, h: 36, label: "Enrich", accent: "#aa7bec" },
      { x: 268, y: 52, w: 88, h: 36, label: "CRM", accent: "#ec7b8e" },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
  {
    nodes: [
      { x: 24, y: 44, w: 92, h: 38, label: "Webhook", accent: "#ea4b71" },
      { x: 140, y: 44, w: 100, h: 38, label: "AI Agent", accent: "#5b60e8" },
      { x: 264, y: 28, w: 88, h: 34, label: "Slack", accent: "#aa7bec" },
      { x: 264, y: 78, w: 88, h: 34, label: "Email", accent: "#ec7b8e" },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
  {
    nodes: [
      { x: 32, y: 58, w: 84, h: 34, label: "Schedule", accent: "#ea4b71" },
      { x: 136, y: 42, w: 104, h: 38, label: "HTTP", accent: "#5b60e8" },
      { x: 136, y: 92, w: 104, h: 34, label: "Code", accent: "#72727c" },
      { x: 260, y: 58, w: 92, h: 36, label: "Notify", accent: "#aa7bec" },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
] as const;

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h + slug.charCodeAt(i) * (i + 1)) % LAYOUTS.length;
  }
  return h;
}

export interface PostCoverProps {
  title: string;
  slug: string;
  categorySlug: string;
  className?: string;
  /** Large preview for featured hero */
  size?: "card" | "hero";
}

/**
 * n8n-style workflow preview: dark dotted canvas with connected nodes,
 * matching n8n.io "Visual building" card aesthetic (light site, dark panel).
 */
export function PostCover({
  title,
  slug,
  categorySlug,
  className,
  size = "card",
}: PostCoverProps) {
  const cat = getCategory(categorySlug);
  const layout = LAYOUTS[hashSlug(slug)];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-panel-dots shadow-panel",
        size === "hero" ? "min-h-[200px]" : "min-h-[168px]",
        className,
      )}
    >
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/25"
      />

      {/* Workflow graph */}
      <svg
        viewBox="0 0 360 140"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Workflow preview for ${title}`}
      >
        <defs>
          <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {layout.edges.map(([from, to], i) => {
          const a = layout.nodes[from];
          const b = layout.nodes[to];
          const x1 = a.x + a.w;
          const y1 = a.y + a.h / 2;
          const x2 = b.x;
          const y2 = b.y + b.h / 2;
          const mid = (x1 + x2) / 2;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke="rgb(255 255 255 / 0.22)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Nodes */}
        {layout.nodes.map((node, i) => (
          <g key={i} filter="url(#node-glow)">
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="6"
              fill="#1e1e28"
              stroke="rgb(255 255 255 / 0.12)"
              strokeWidth="1"
            />
            {/* Accent bar */}
            <rect
              x={node.x}
              y={node.y}
              width={4}
              height={node.h}
              rx="2"
              fill={node.accent}
            />
            {/* Icon dot */}
            <circle
              cx={node.x + 14}
              cy={node.y + node.h / 2}
              r="4"
              fill={node.accent}
              opacity="0.9"
            />
            <text
              x={node.x + 24}
              y={node.y + node.h / 2 + 4}
              fill="rgb(255 255 255 / 0.88)"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Bottom meta strip */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-white/10 bg-chrome/80 px-3 py-2 backdrop-blur-sm">
        <span className="truncate font-mono text-[0.625rem] font-medium uppercase tracking-wider text-chrome-subtle">
          {cat?.name.replace(/ automation$/i, "") ?? "Workflow"}
        </span>
        <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[0.5625rem] font-semibold text-accent">
          n8n
        </span>
      </div>
    </div>
  );
}
