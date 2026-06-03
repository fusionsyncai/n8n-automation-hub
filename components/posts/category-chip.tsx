import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/content/categories";

export interface CategoryChipProps {
  slug: string;
  featured?: boolean;
  asLink?: boolean;
  size?: "sm" | "md";
  variant?: "light" | "dark";
  className?: string;
}

export function CategoryChip({
  slug,
  featured = false,
  asLink = true,
  size = "sm",
  variant = "light",
  className,
}: CategoryChipProps) {
  const cat = getCategory(slug);
  if (!cat) return null;

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[0.625rem]"
      : "px-2.5 py-1 text-[0.6875rem]";

  const baseClasses = cn(
    "inline-flex items-center font-mono font-semibold uppercase tracking-[0.12em] rounded-md transition-colors",
    sizeClasses,
    featured
      ? "bg-accent text-white"
      : variant === "dark"
        ? "bg-white/10 text-chrome-subtle"
        : "bg-secondary/10 text-secondary hover:bg-accent-soft hover:text-accent",
    className,
  );

  const label = cat.name.replace(/ automation$/i, "");

  if (asLink) {
    return (
      <Link href={`/categories/${cat.slug}`} className={baseClasses}>
        {label}
      </Link>
    );
  }
  return <span className={baseClasses}>{label}</span>;
}
