import { cn } from "@/lib/utils";

/**
 * The one vertical rhythm. Sections never hand-roll their own padding —
 * `py-section md:py-section-md lg:py-section-lg` is the whole scale.
 */
export function Section({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"section"> & {
  tone?: "default" | "paper";
}) {
  return (
    <section
      className={cn(
        "py-section md:py-section-md lg:py-section-lg",
        tone === "paper" && "bg-paper",
        className,
      )}
      {...props}
    />
  );
}
