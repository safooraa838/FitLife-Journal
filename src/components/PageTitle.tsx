
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}

export function PageTitle({ title, icon: Icon, actions, className }: PageTitleProps) {
  return (
    <div className={`mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-7 w-7 text-primary" />}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
