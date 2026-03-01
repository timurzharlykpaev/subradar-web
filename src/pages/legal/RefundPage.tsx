import { LegalLayout } from './LegalLayout'

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy">
      <p className="text-gray-400 text-sm">Effective date: March 1, 2026 · LLP Goalin</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">1. Our Commitment</h2>
        <p>
          At SubRadar (operated by LLP Goalin), we want you to be completely satisfied with your subscription.
          If you're not happy with our service, we offer a straightforward refund process as described below.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">2. 14-Day Money-Back Guarantee</h2>
        <p>
          We offer a <strong className="text-white">14-day money-back guarantee</strong> for all new{' '}
          <strong className="text-white">Pro</strong> and <strong className="text-white">Team</strong> plan subscriptions
          (both monthly and annual).
        </p>
        <p className="mt-3">
          If you are not satisfied with SubRadar for any reason within the first 14 days of your paid subscription,
          you are entitled to a full refund — no questions asked.
        </p>
        <div className="mt-4 p-4 rounded-xl" style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)'}}>
          <p className="text-green-400 font-semibold">✓ 14-day full refund for Pro plan</p>
          <p className="text-green-400 font-semibold">✓ 14-day full refund for Team plan</p>
          <p className="text-green-400 font-semibold">✓ No questions asked</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">3. How to Request a Refund</h2>
        <p>To request a refund, please follow these steps:</p>
        <ol className="list-decimal pl-6 space-y-2 mt-2">
          <li>
            Send an email to{' '}
            <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a>
            {' '}with the subject line: <strong className="text-white">"Refund Request"</strong>
          </li>
          <li>Include the email address associated with your SubRadar account.</li>
          <li>Briefly describe why you're requesting a refund (optional, but helps us improve).</li>
          <li>Our support team will review your request and confirm eligibility.</li>
        </ol>
        <p className="mt-3">
          You can also initiate a refund directly through Lemon Squeezy (our payment processor) using
          the receipt email you received at the time of purchase.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Processing Time</h2>
        <p>
          Once your refund request is approved, the refund will be processed within{' '}
          <strong className="text-white">5–10 business days</strong>. The time it takes for the funds to
          appear in your account depends on your bank or card issuer.
        </p>
        <p className="mt-2">
          You will receive an email confirmation once the refund has been initiated.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">5. Exceptions & Limitations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-white">Annual plans after 60 days:</strong> For annual plan subscribers,
            refund requests made after 60 days from the original purchase date will not be eligible for a
            full refund. Partial refunds may be considered on a case-by-case basis.
          </li>
          <li>
            <strong className="text-white">Monthly plans after 14 days:</strong> Monthly subscriptions are
            not eligible for refunds after the 14-day window has passed.
          </li>
          <li>
            <strong className="text-white">Free plan:</strong> The free plan has no charges, so no refunds apply.
          </li>
          <li>
            <strong className="text-white">Abuse of policy:</strong> Repeated refund requests or abuse of
            the money-back guarantee may result in account suspension.
          </li>
          <li>
            <strong className="text-white">Promotional purchases:</strong> Subscriptions purchased at a
            special promotional price may have different refund terms as specified at the time of purchase.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">6. Cancellation vs. Refund</h2>
        <p>
          Cancelling your subscription and requesting a refund are two separate actions:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong className="text-white">Cancellation</strong> stops future billing but does not automatically
            issue a refund for the current period. You will retain access until the end of your billing period.
          </li>
          <li>
            <strong className="text-white">Refund</strong> returns money already charged and may result in
            immediate loss of access to paid features.
          </li>
        </ul>
        <p className="mt-3">
          You can cancel your subscription at any time from Settings → Billing in the app.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
        <p>
          If you have any questions about our refund policy or need assistance, please don't hesitate to reach out:
        </p>
        <div className="mt-3 p-4 rounded-xl" style={{background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)'}}>
          <p className="text-white font-semibold">LLP Goalin / SubRadar Support</p>
          <p>Email: <a href="mailto:support@subradar.ai" className="text-purple-400 hover:underline">support@subradar.ai</a></p>
          <p>Response time: within 1 business day</p>
        </div>
      </section>
    </LegalLayout>
  )
}
