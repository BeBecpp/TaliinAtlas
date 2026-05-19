"use client";

interface MatchedSignalsProps {
  signals: string[];
  className?: string;
}

export default function MatchedSignals({ signals, className = "" }: MatchedSignalsProps) {
  if (!signals.length) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      <span className="text-[10px] uppercase tracking-wide text-atlas-muted">Signals:</span>
      {signals.map((s) => (
        <span
          key={s}
          className="rounded-full border border-atlas-cyan/25 bg-atlas-cyan/10 px-2 py-0.5 text-[10px] text-atlas-cyan"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
