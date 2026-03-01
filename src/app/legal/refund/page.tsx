import Link from 'next/link';
export const metadata = { title: 'Refund Policy — SubRadar AI' };
export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm">← Back</Link>
        <h1 className="text-4xl font-extrabold mt-6 mb-2">Refund Policy</h1>
        <p className="text-gray-500 mb-10">Effective date: March 1, 2026 · Goalin LLP</p>
        <section className="mb-8"><h2 className="text-xl font-bold mb-3">7-Day Money-Back Guarantee</h2><p className="text-gray-400">Full refund within 7 calendar days of purchase, no questions asked. After 7 days, all sales are final.</p></section>
        <section className="mb-8"><h2 className="text-xl font-bold mb-3">How to Request</h2><p className="text-gray-400">Email <a href="mailto:support@subradar.ai" className="text-purple-400">support@subradar.ai</a> with subject "Refund Request". Processing: 5–10 business days via Lemon Squeezy.</p></section>
        <div className="border-t border-white/10 pt-6 mt-8 flex gap-4 text-sm text-gray-500">
          <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
