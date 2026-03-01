import { LegalLayout } from './LegalLayout'

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p className="text-gray-400 text-sm">Effective date: March 1, 2026 · LLP Goalin</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device by your browser. SubRadar uses cookies and
          similar technologies (such as localStorage) to provide and improve our service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Cookies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-white">Authentication:</strong> We store your session token in localStorage
            to keep you logged in securely.
          </li>
          <li>
            <strong className="text-white">Preferences:</strong> We save your theme (dark/light) and language
            preferences in localStorage.
          </li>
          <li>
            <strong className="text-white">Analytics:</strong> We may use minimal, privacy-respecting analytics
            to understand how features are used. No personal data is shared with analytics providers.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">3. Third-Party Cookies</h2>
        <p>
          Google OAuth may set cookies during the authentication process. These are governed by
          Google's Cookie Policy. Lemon Squeezy may also set cookies during payment flows.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Managing Cookies</h2>
        <p>
          You can clear cookies and localStorage at any time through your browser settings. Note that
          clearing authentication data will log you out of SubRadar. You can also use your browser's
          privacy mode to prevent persistent cookies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">5. Essential Cookies Only</h2>
        <p>
          SubRadar does not use advertising cookies, tracking pixels, or third-party analytics that
          profile you across websites. We only use cookies essential to operating the service and
          storing your preferences.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
        <p>
          Questions about our cookie usage? Email us at{' '}
          <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a>.
        </p>
      </section>
    </LegalLayout>
  )
}
