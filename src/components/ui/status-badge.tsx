import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  success: "bg-success-light text-success border-success/20",
  warning: "bg-warning-light text-warning border-warning/20", 
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  neutral: "bg-muted text-muted-foreground border-border"
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      statusStyles[status],
      className
    )}>
      {children}
    </span>
  );
}