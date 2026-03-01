import Link from 'next/link';

export const metadata = { title: 'Terms of Service — SubRadar AI' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-all">← Back to SubRadar</Link>
        <h1 className="text-4xl font-extrabold mt-6 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Effective date: March 1, 2026 · <strong className="text-gray-400">Goalin LLP</strong> (BIN 260240021438), Astana, Kazakhstan</p>

        {[
          { title: '1. Acceptance', body: 'By using SubRadar AI ("Service"), you agree to these Terms. If you do not agree, do not use the Service.' },
          { title: '2. Service Description', body: 'SubRadar AI is a subscription tracking service with AI-powered recognition (voice and screenshot), analytics, renewal reminders, and tax reports.' },
          { title: '3. Account', body: 'You may register via Google OAuth or email OTP. You are responsible for maintaining the security of your account.' },
          { title: '4. Subscription Plans', body: 'Free: up to 5 subscriptions, manual entry only.\nPro ($2.99/month or $24.99/year): unlimited subscriptions, AI features, PDF/CSV reports, tax reports.\nTeam: contact us for pricing.' },
          { title: '5. Payments', body: 'All payments are processed by Lemon Squeezy (Merchant of Record). Lemon Squeezy handles all VAT and sales tax obligations worldwide. See our Refund Policy for refund terms.' },
          { title: '6. AI Disclaimer', body: 'AI features (voice recognition, screenshot parsing) are provided "as is". Results may not be 100% accurate. Always verify extracted data. AI output is not financial or legal advice.' },
          { title: '7. Prohibited Use', body: 'You may not: use the Service for illegal purposes, attempt to reverse engineer the Service, upload malicious content, or share your account credentials.' },
          { title: '8. Intellectual Property', body: 'All content, code, and branding of SubRadar AI is owned by Goalin LLP. You may not reproduce or distribute it without written permission.' },
          { title: '9. Limitation of Liability', body: 'To the maximum extent permitted by law, Goalin LLP is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.' },
          { title: '10. Governing Law', body: 'These Terms are governed by the laws of the Republic of Kazakhstan. Disputes shall be resolved in the courts of Astana, Kazakhstan.' },
        ].map(({ title, body }) => (
          <section key={title} className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">{body}</p>
          </section>
        ))}

        <div className="border-t border-white/10 pt-6 mt-8 flex gap-4 flex-wrap text-sm text-gray-500">
          <Link href="/legal/privacy" className="hover:text-white transition-all">Privacy Policy</Link>
          <Link href="/legal/refund" className="hover:text-white transition-all">Refund Policy</Link>
          <Link href="/legal/cookies" className="hover:text-white transition-all">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
