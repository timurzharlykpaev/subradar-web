import { LegalLayout } from './LegalLayout'

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-gray-400 text-sm">Effective date: March 1, 2026 · LLP Goalin</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using SubRadar (operated by LLP Goalin), you agree to be bound by these Terms of Service.
          If you do not agree, please do not use our service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
        <p>
          SubRadar is an AI-powered subscription tracking tool that helps users manage, analyze, and organize
          their recurring subscriptions. Features include AI-powered subscription search, screenshot scanning,
          smart reminders, spending analytics, and tax report export.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
        <p>
          You must register for an account using Google OAuth to use SubRadar. You are responsible for
          maintaining the security of your account. You agree to provide accurate and current information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
        <p>You agree not to use SubRadar to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the service</li>
          <li>Use the service for any fraudulent purpose</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">5. Payments & Subscriptions</h2>
        <p>
          Paid plans are billed through Lemon Squeezy. By subscribing, you authorize recurring charges.
          See our <a href="/legal/refund" className="text-purple-400 hover:underline">Refund Policy</a> for
          information about cancellations and refunds.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
        <p>
          All content, features, and functionality of SubRadar are the exclusive property of LLP Goalin.
          You may not reproduce, distribute, or create derivative works without our written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">7. Disclaimer of Warranties</h2>
        <p>
          SubRadar is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
          service or error-free operation. Financial data shown is for informational purposes only and
          should not be considered financial advice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, LLP Goalin shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of SubRadar.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify you of significant changes
          via email. Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
        <p>
          For questions about these Terms, contact us at{' '}
          <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a>.
        </p>
      </section>
    </LegalLayout>
  )
}
