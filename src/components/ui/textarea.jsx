import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, label, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {/* Floating Top-Right Label */}
      {label && (
        <span
          className="
              pointer-events-none
              absolute -top-2 left-3
              px-2 py-[2px]
              text-xs font-medium tracking-wide
              bg-background
              text-muted-foreground
            "
        >
          {label}
        </span>
      )}

      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
