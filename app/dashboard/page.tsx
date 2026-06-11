import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#2D2D2D] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center bg-white border-2 border-[#E5E1D8] rounded-3xl shadow-sm p-10">
        <h1 className="font-sketch text-3xl text-[#2D2D2D] mb-4">Dashboard coming soon</h1>
        <p className="font-body text-sm text-[#666] mb-8">
          This is a placeholder for the dashboard. Once your resume flow is built, users will land here after confirming they want to continue.
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
