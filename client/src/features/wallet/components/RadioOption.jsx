import { Receipt } from "lucide-react";

export default function RadioOption({ label, sublabel, selected, onSelect }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex  items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
        selected
          ? "border-pf-teal bg-pf-teal-dim"
          : "border-pf-border hover:bg-pf-surface-alt"
      }`}
    >
      <Receipt
        size={20}
        className={selected ? "text-pf-teal" : "text-pf-ink-dim"}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-pf-ink">{label}</div>
        {sublabel && <div className="text-xs text-pf-ink-dim">{sublabel}</div>}
      </div>
      <div
        aria-hidden="true"
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? "border-pf-teal" : "border-pf-border"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-pf-teal" />}
      </div>
    </div>
  );
}
