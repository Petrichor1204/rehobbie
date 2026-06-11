"use client";

type Props = {
  hobbyLabel: string;
};

export function OthersLikeYou({ hobbyLabel }: Props) {
  const lower = hobbyLabel.toLowerCase();
  return (
    <section className="rounded-3xl bg-rehobbie-green/15 border-2 border-rehobbie-green/40 p-6">
      <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink mb-3">
        Others like you
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {["🙂", "😊", "🧑‍🎨", "🙋", "😎"].map((face, i) => (
            <span
              key={i}
              className="w-9 h-9 rounded-full bg-white border-2 border-rehobbie-green/40 flex items-center justify-center text-lg"
              aria-hidden="true"
            >
              {face}
            </span>
          ))}
        </div>
        <p className="font-body text-sm text-rehobbie-subtext">
          <span className="font-semibold text-rehobbie-ink">2,400+ people</span> picked{" "}
          {lower} back up this month
        </p>
      </div>

      <blockquote className="font-body text-sm text-rehobbie-subtext italic border-l-2 border-rehobbie-green/50 pl-3">
        “I hadn&apos;t touched {lower} in three years. The 15-minute plan made it
        feel possible again — I&apos;m on a streak now.”
        <span className="block not-italic text-xs text-rehobbie-muted mt-1">
          — a fellow returner
        </span>
      </blockquote>
    </section>
  );
}
