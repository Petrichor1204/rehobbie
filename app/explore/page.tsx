import Link from "next/link";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#2D2D2D] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center bg-white border-2 border-[#E5E1D8] rounded-3xl shadow-sm p-10">
        <h1 className="font-sketch text-3xl text-[#2D2D2D] mb-4">Explore other hobbies</h1>
        <p className="font-body text-sm text-[#666] mb-8">
          This page is a placeholder for the explore experience. Once you add explore content, this route will show hobby recommendations and discovery tools.
        </p>
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-[#A8D8B0] text-[#2D2D2D] font-semibold hover:bg-[#93CFA0] transition-colors">
            Back to home
          </button>
        </Link>
      </div>
    </main>
  );
}
