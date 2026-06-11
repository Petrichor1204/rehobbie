"use client";

import { HobbyResources, Resource, ResourceKind } from "@/types";

const KIND_META: Record<ResourceKind, { label: string; icon: string }> = {
  book: { label: "Books", icon: "📚" },
  video: { label: "Watch", icon: "▶️" },
  community: { label: "Community", icon: "💬" },
};

function ResourceColumn({ kind, items }: { kind: ResourceKind; items: Resource[] }) {
  const meta = KIND_META[kind];
  return (
    <div className="flex-1 min-w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true">{meta.icon}</span>
        <h3 className="font-sketch text-xl font-semibold text-rehobbie-ink">{meta.label}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const inner = (
            <div className="rounded-2xl border-2 border-rehobbie-border bg-white p-4 h-full transition-all hover:border-rehobbie-border-light hover:-translate-y-0.5 shadow-sm">
              <p className="font-body font-semibold text-rehobbie-ink leading-tight">
                {item.title}
              </p>
              <p className="font-body text-xs text-rehobbie-muted mt-0.5">{item.by}</p>
              {item.note && (
                <p className="font-body text-sm text-rehobbie-subtext mt-2 leading-snug">
                  {item.note}
                </p>
              )}
            </div>
          );
          return item.url ? (
            <a
              key={`${item.title}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehobbie-green rounded-2xl"
            >
              {inner}
            </a>
          ) : (
            <div key={`${item.title}-${i}`}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

export function ResourceShelf({ resources }: { resources: HobbyResources }) {
  return (
    <section>
      <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink mb-1">
        To get you going
      </h2>
      <p className="font-body text-sm text-rehobbie-muted mb-4">
        hand-picked places to start again
      </p>

      <div className="flex flex-wrap gap-6">
        <ResourceColumn kind="book" items={resources.books} />
        <ResourceColumn kind="video" items={resources.videos} />
        <ResourceColumn kind="community" items={resources.communities} />
      </div>
    </section>
  );
}
