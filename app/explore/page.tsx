import Link from "next/link";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-rehobbie-cream text-rehobbie-ink flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center bg-white border-2 border-rehobbie-border rounded-3xl shadow-sm p-10">
        <h1 className="font-sketch text-3xl text-rehobbie-ink mb-4">Explore other hobbies</h1>
        <p className="font-body text-sm text-rehobbie-subtext mb-8">
          This page is a placeholder for the explore experience. Once you add explore content, this route will show hobby recommendations and discovery tools.
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
