import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function Loading({ className, ...props }) {
  return (
    <span className={className}>
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn("size-2 animate-spin", className)}
        {...props}
      />
    </span>
  );
}

export { Loading, Spinner };
