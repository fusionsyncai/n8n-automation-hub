import { DownloadIcon } from "lucide-react";
import { assetPath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

export interface WorkflowDownloadProps {
  /** Public path to the workflow JSON, e.g. /workflows/foo.json */
  file: string;
  /** Display name for the workflow. Defaults to the filename. */
  title?: string;
  /** Button label. Defaults to "Download workflow JSON". */
  label?: string;
  /** Short import hint below the button. */
  note?: string;
}

function filenameFromPath(file: string): string {
  const parts = file.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "workflow.json";
}

/**
 * Download card for importable n8n workflow JSON files in public/workflows/.
 */
export function WorkflowDownload({
  file,
  title,
  label = "Download workflow JSON",
  note = "Import into n8n via Workflows, then Import from File.",
}: WorkflowDownloadProps) {
  const displayTitle = title ?? filenameFromPath(file);
  const downloadName = filenameFromPath(file);

  return (
    <aside
      className={cn(
        "not-prose my-7 flex flex-col gap-4 rounded-lg border border-border bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          n8n workflow
        </p>
        <p className="mt-1 font-semibold text-ink">{displayTitle}</p>
        {note ? (
          <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
            {note}
          </p>
        ) : null}
      </div>
      <a
        href={assetPath(file)}
        download={downloadName}
        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-accent/40 hover:text-accent sm:self-center"
      >
        <DownloadIcon className="h-4 w-4" aria-hidden />
        {label}
      </a>
    </aside>
  );
}
