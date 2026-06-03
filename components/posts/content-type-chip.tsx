import { cn } from "@/lib/utils";
import {
  getContentTypeMeta,
  isContentType,
  type ContentType,
} from "@/lib/content/content-types";

export interface ContentTypeChipProps {
  contentType: string;
  size?: "sm" | "md";
  className?: string;
}

export function ContentTypeChip({
  contentType,
  size = "sm",
  className,
}: ContentTypeChipProps) {
  if (!isContentType(contentType)) return null;
  const meta = getContentTypeMeta(contentType);
  if (!meta) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-mono font-semibold uppercase tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[0.625rem]" : "px-2.5 py-1 text-[0.6875rem]",
        contentType === "implementation"
          ? "bg-secondary/10 text-secondary"
          : "bg-accent-soft text-accent",
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function contentTypeSortPriority(type: ContentType): number {
  return type === "implementation" ? 0 : 1;
}
