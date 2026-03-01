import Link from 'next/link';
export const metadata = { title: 'Cookie Policy — SubRadar AI' };
export default function CookiePage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm">← Back</Link>
        <h1 className="text-4xl font-extrabold mt-6 mb-2">Cookie & Storage Policy</h1>
        <p className="text-gray-500 mb-10">Effective date: March 1, 2026 · Goalin LLP</p>
        <section className="mb-8"><h2 className="text-xl font-bold mb-3">What We Store</h2><p className="text-gray-400">We use <strong className="text-white">localStorage</strong> (not cookies) to store auth tokens, theme, and language preferences. No tracking or advertising cookies.</p></section>
        <section className="mb-8"><h2 className="text-xl font-bold mb-3">Google OAuth</h2><p className="text-gray-400">Google may set its own cookies per <a href="https://policies.google.com/privacy" className="text-purple-400" target="_blank" rel="noreferrer">Google Privacy Policy</a>.</p></section>
        <div className="border-t border-white/10 pt-6 mt-8 flex gap-4 text-sm text-gray-500">
          <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
