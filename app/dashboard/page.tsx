import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-rehobbie-cream text-rehobbie-ink flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center bg-white border-2 border-rehobbie-border rounded-3xl shadow-sm p-10">
        <h1 className="font-sketch text-3xl text-rehobbie-ink mb-4">Dashboard coming soon</h1>
        <p className="font-body text-sm text-rehobbie-subtext mb-8">
          This is a placeholder for the dashboard. Once your resume flow is built, users will land here after confirming they want to continue.
        </p>
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-rehobbie-green text-rehobbie-ink font-semibold hover:bg-rehobbie-green-hover transition-colors">
            Back to home
          </button>
        </Link>
      </div>
    </main>
  );
}
