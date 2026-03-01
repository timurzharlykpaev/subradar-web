import { LegalLayout } from './LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-gray-400 text-sm">Effective date: March 1, 2026 · LLP Goalin</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
        <p>
          SubRadar ("we", "us", or "our") is operated by LLP Goalin. We are committed to protecting your
          personal information and your right to privacy. This Privacy Policy explains how we collect, use,
          store, and share your information when you use our service at subradar.ai and app.subradar.ai.
        </p>
        <p>
          By using SubRadar, you agree to the collection and use of information in accordance with this policy.
          If you have questions or concerns, contact us at <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
        <p>We collect the following categories of personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong className="text-white">Account information:</strong> Your email address, display name,
            and profile picture obtained via Google OAuth when you sign in.
          </li>
          <li>
            <strong className="text-white">Subscription data:</strong> Names, prices, billing cycles, renewal
            dates, and category information for the subscriptions you add to SubRadar.
          </li>
          <li>
            <strong className="text-white">Payment card references:</strong> Last 4 digits of payment cards
            you associate with subscriptions. We do not store full card numbers or CVV codes.
          </li>
          <li>
            <strong className="text-white">Usage data:</strong> Information about how you interact with the
            app, including pages visited, features used, and session timestamps.
          </li>
          <li>
            <strong className="text-white">Screenshots (optional):</strong> If you use the Screenshot Scan
            feature, images are temporarily processed by our AI and immediately deleted after extraction.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Service delivery:</strong> To operate SubRadar and provide core features including subscription tracking, reminders, and analytics.</li>
          <li><strong className="text-white">Smart reminders:</strong> To send push notifications and email alerts before upcoming subscription charges based on your preferences.</li>
          <li><strong className="text-white">Analytics:</strong> To generate spending reports, monthly summaries, and category breakdowns within the app.</li>
          <li><strong className="text-white">AI features:</strong> To power AI-based subscription search and screenshot parsing. Your data is sent to OpenAI for processing (see Third Parties section).</li>
          <li><strong className="text-white">Tax reports:</strong> To compile and export PDF reports of your subscription expenses.</li>
          <li><strong className="text-white">Product improvement:</strong> To understand usage patterns and improve SubRadar features.</li>
          <li><strong className="text-white">Communications:</strong> To send transactional emails such as subscription confirmations, receipts, and important service updates.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Data Storage & Security</h2>
        <p>
          Your data is stored on secure servers hosted by <strong className="text-white">DigitalOcean</strong> in
          their <strong className="text-white">Frankfurt, Germany</strong> data center (EU region). This means your
          data is stored within the European Economic Area (EEA) and subject to GDPR protections.
        </p>
        <p>
          We implement industry-standard security measures including encrypted connections (HTTPS/TLS),
          encrypted database storage, and strict access controls. Only authorized personnel can access
          production systems.
        </p>
        <p>
          We retain your data for as long as your account is active. If you delete your account,
          your personal data is permanently deleted within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
        <p>We use the following third-party services that may receive your data:</p>
        <ul className="list-disc pl-6 space-y-3 mt-2">
          <li>
            <strong className="text-white">Google OAuth</strong> — Used for authentication. When you sign in with Google,
            we receive your email, name, and profile picture. Google's privacy policy applies:
            <a href="https://policies.google.com/privacy" className="text-purple-400 hover:underline ml-1" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
          </li>
          <li>
            <strong className="text-white">Lemon Squeezy</strong> — Our payment processor for Pro and Team plan subscriptions.
            They handle payment card data securely. We never see your full card number.
            <a href="https://www.lemonsqueezy.com/privacy" className="text-purple-400 hover:underline ml-1" target="_blank" rel="noopener noreferrer">lemonsqueezy.com/privacy</a>
          </li>
          <li>
            <strong className="text-white">OpenAI</strong> — Used for AI-powered features (subscription search, screenshot parsing).
            Data sent to OpenAI is processed per their API usage policies and is not used to train their models.
            <a href="https://openai.com/privacy" className="text-purple-400 hover:underline ml-1" target="_blank" rel="noopener noreferrer">openai.com/privacy</a>
          </li>
        </ul>
        <p className="mt-3">
          We do not sell your personal data to any third parties. We do not share your data with advertisers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">6. Cookies & Local Storage</h2>
        <p>
          We use cookies and browser local storage for authentication tokens, theme preferences, and language
          settings. These are essential for the service to function. You can clear them via your browser settings,
          but doing so may log you out of the app.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
        <p>You have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong className="text-white">Access:</strong> Request a copy of all personal data we hold about you.</li>
          <li><strong className="text-white">Export:</strong> Download your subscription data in JSON or CSV format from the Settings page.</li>
          <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-white">Deletion:</strong> Request deletion of your account and all associated data. You can do this in Settings → Account → Delete Account, or by emailing us.</li>
          <li><strong className="text-white">Portability:</strong> Receive your data in a machine-readable format.</li>
          <li><strong className="text-white">Objection:</strong> Object to processing of your data for certain purposes.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a>.
          We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
        <p>
          SubRadar is not intended for children under 16 years of age. We do not knowingly collect personal
          information from children under 16. If you believe we have collected data from a child, please
          contact us immediately.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          via email or an in-app notification. Continued use of SubRadar after changes constitutes
          acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or how we handle your data, please contact:
        </p>
        <div className="mt-3 p-4 rounded-xl" style={{background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)'}}>
          <p className="text-white font-semibold">LLP Goalin / SubRadar</p>
          <p>Email: <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a></p>
          <p>Website: <a href="https://subradar.ai" className="text-purple-400 hover:underline">subradar.ai</a></p>
        </div>
      </section>
    </LegalLayout>
  )
}
