import { cn } from "@/lib/utils";

export default function Text({ children, className, ...props }) {
  return (
    <span className={cn("text-base text-foreground", className)} {...props}>
      {children}
    </span>
  );
}
