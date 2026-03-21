import { cn } from "@/lib/utils";
import type { HackathonStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  HackathonStatus,
  { label: string; className: string }
> = {
  ongoing: {
    label: "진행중",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  upcoming: {
    label: "예정",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  ended: {
    label: "종료",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

interface StatusBadgeProps {
  status: HackathonStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
