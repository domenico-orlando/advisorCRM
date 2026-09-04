import type { ReactNode } from "react";

export function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className ? `panel ${className}` : "panel"}>
      <div className="panel-head">{title}</div>
      {children}
    </section>
  );
}
