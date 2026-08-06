import { cn } from "@/utils/cn";

export function StatusChip({ status, label }) {
  const normalized = status?.toUpperCase();

  const styles = {
    PRESENT:
      "bg-green-100 text-green-700 border-green-200",
    ABSENT:
      "bg-red-100 text-red-700 border-red-200",
    NOT_MARKED:
      "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[normalized] ?? styles.NOT_MARKED
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label === "NOT_MARKED" ? "Not Marked" : label}
    </span>
  );
}