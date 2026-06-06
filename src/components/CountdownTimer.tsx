import { useEffect, useState } from "react";

function nextEndOfDay() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function CountdownTimer() {
  const [target] = useState(nextEndOfDay);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const cells: [string, number][] = [["HRS", h], ["MIN", m], ["SEC", s]];
  return (
    <div className="flex items-center gap-2">
      {cells.map(([label, val], i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="grid min-w-14 rounded-xl bg-navy px-3 py-2 text-center font-display text-2xl font-bold tabular-nums text-navy-foreground shadow-glow">
            {String(val).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-medium text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
