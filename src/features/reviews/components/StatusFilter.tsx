import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReviewStatus } from "@/types";

const OPTIONS: { label: string; value: ReviewStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đã xử lý", value: "resolved" },
];

interface StatusFilterProps {
  active: ReviewStatus | undefined;
}

export function StatusFilter({ active }: StatusFilterProps) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map(({ label, value }) => {
        const isActive = value === "all" ? !active : active === value;
        return (
          <Link
            key={value}
            href={value === "all" ? "/dashboard" : `/dashboard?status=${value}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
