import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — SubRadar AI' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
    <div className="text-gray-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-all">← Back to SubRadar</Link>
        <h1 className="text-4xl font-extrabold mt-6 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Effective date: March 1, 2026 · <strong className="text-gray-400">Goalin LLP</strong> (BIN 260240021438), Astana, Kazakhstan</p>

        <Section title="1. Who We Are">
          <p>SubRadar AI is operated by <strong className="text-white">Goalin LLP</strong>, BIN 260240021438, registered in Astana, Republic of Kazakhstan. Contact: <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a></p>
        </Section>

        <Section title="2. What Data We Collect">
          <p><strong className="text-white">Account data:</strong> email address, name, Google OAuth identifier (sub).</p>
          <p><strong className="text-white">Subscription data:</strong> subscription names, amounts, billing dates, categories, payment card info (last 4 digits only).</p>
          <p><strong className="text-white">AI input data:</strong> voice recordings and screenshots you upload for AI processing (processed and deleted immediately).</p>
          <p><strong className="text-white">Usage data:</strong> IP address, device type, browser, pages visited, crash logs.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="list-disc pl-5 space-y-1">
            <li>Providing and improving the SubRadar service</li>
            <li>AI-powered subscription recognition (voice/screenshot)</li>
            <li>Sending renewal reminders and notifications</li>
            <li>Generating reports and analytics for you</li>
            <li>Processing payments via Lemon Squeezy</li>
            <li>Security and fraud prevention</li>
          </ul>
        </Section>

        <Section title="4. Third-Party Services">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-white">Google OAuth</strong> — authentication</li>
            <li><strong className="text-white">OpenAI</strong> — AI processing of voice/screenshots (data not retained by OpenAI for training)</li>
            <li><strong className="text-white">Lemon Squeezy</strong> — payment processing (Merchant of Record)</li>
            <li><strong className="text-white">DigitalOcean</strong> — cloud hosting (Frankfurt, EU)</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>Account data is retained until you delete your account. Server logs are retained for 90 days. AI processing inputs (voice/screenshots) are deleted immediately after processing.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to: access your data, correct inaccuracies, request deletion, and export your data. Email <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a> to exercise these rights.</p>
        </Section>

        <Section title="7. Data Storage">
          <p>We use <strong className="text-white">localStorage</strong> (not cookies) to store your authentication tokens and preferences. No tracking or advertising cookies are used.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>This policy is governed by the laws of the Republic of Kazakhstan, including the Law on Personal Data and its Protection.</p>
        </Section>

        <Section title="9. Contact">
          <p>Questions? Email <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a></p>
        </Section>

        <div className="border-t border-white/10 pt-6 mt-8 flex gap-4 flex-wrap text-sm text-gray-500">
          <Link href="/legal/terms" className="hover:text-white transition-all">Terms of Service</Link>
          <Link href="/legal/refund" className="hover:text-white transition-all">Refund Policy</Link>
          <Link href="/legal/cookies" className="hover:text-white transition-all">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
