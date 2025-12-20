import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'syncing';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active: {
      label: 'Active',
      className: 'bg-muted text-foreground border-border',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-muted text-muted-foreground border-border',
    },
    syncing: {
      label: 'Syncing',
      className: 'bg-muted text-muted-foreground border-border',
    },
  };

  const variant = variants[status];

  return (
    <Badge
      className={cn('border', variant.className, className)}
      variant="outline"
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        {status === 'active' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            status === 'active' && 'bg-primary',
            status === 'inactive' && 'bg-muted-foreground',
            status === 'syncing' && 'bg-muted-foreground'
          )}
        ></span>
      </span>
      {variant.label}
    </Badge>
  );
}
