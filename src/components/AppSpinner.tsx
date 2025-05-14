
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppSpinner({ size = "md", className }: AppSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}
