import { cn } from "@/lib/utils";

/**
 * Single max-width + gutter definition for the whole app.
 * Every page and section uses this so horizontal rhythm can't drift.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-gutter md:px-gutter-md", className)}
      {...props}
    />
  );
}
