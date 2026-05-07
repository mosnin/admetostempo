import React from 'react'

const LAST_UPDATED = 'May 7, 2025'

interface SectionProps {
  number: number
  title: string
  children: React.ReactNode
}

function Section({ number, title, children }: SectionProps) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 p-6 shadow-sm space-y-3">
      <h2 className="text-lg font-bold text-gray-800">
        <span className="text-emerald-400 mr-2">{number}.</span>
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500 pb-1">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        <p className="text-gray-600 leading-relaxed">
          At Admetos, your privacy is fundamental to how we build our products. This Policy explains what
          information we collect, how we use it, and what choices you have.
        </p>
      </div>

      <Section number={1} title="Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <span className="font-medium text-gray-700">Account information:</span> Your name, email
            address, username, and profile photo provided during registration.
          </li>
          <li>
            <span className="font-medium text-gray-700">Transaction history:</span> Records of payments
            sent and received, including amounts, timestamps, and counterparty usernames.
          </li>
          <li>
            <span className="font-medium text-gray-700">Device &amp; usage data:</span> IP address,
            browser or device type, operating system, and in-app activity logs used for security and
            analytics.
          </li>
          <li>
            <span className="font-medium text-gray-700">Communications:</span> Payment notes and messages
            you attach to transactions.
          </li>
        </ul>
        <p>
          We do not collect biometric data, social security numbers, or traditional payment card
          information.
        </p>
      </Section>

      <Section number={2} title="How We Use Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Operate, maintain, and improve the Admetos application.</li>
          <li>Process and record on-chain transactions on your behalf.</li>
          <li>Detect, investigate, and prevent fraud, abuse, and security incidents.</li>
          <li>Comply with legal obligations, including anti-money-laundering (AML) and know-your-customer (KYC) requirements.</li>
          <li>Send you transactional notifications (receipts, security alerts).</li>
          <li>Respond to your support requests.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties, and we do not use your data for
          targeted advertising.
        </p>
      </Section>

      <Section number={3} title="Wallet &amp; Blockchain Data">
        <p>
          Your wallet address is public on the Tempo blockchain. All transactions confirmed on-chain are
          permanently recorded in the public ledger and are visible to anyone who queries the blockchain.
          This is an inherent property of public blockchains and is outside Admetos&apos;s control.
        </p>
        <p>
          Your wallet address is linked to your Admetos username within our platform. We take steps to
          minimise the exposure of this link to third parties, but you should be aware that blockchain
          analytics tools may be able to associate your on-chain activity with your Admetos account.
        </p>
        <p>
          Private keys are never exposed to your browser or device. They are encrypted and stored
          server-side with strict access controls.
        </p>
      </Section>

      <Section number={4} title="Data Sharing">
        <p>We share your information only with the following trusted service providers:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <span className="font-medium text-gray-700">Clerk:</span> Our authentication provider.
            Clerk processes your email and identity data to manage sign-in and session security. Governed
            by Clerk&apos;s own privacy policy.
          </li>
          <li>
            <span className="font-medium text-gray-700">Supabase:</span> Our database and storage
            provider. Your account and transaction data are stored in Supabase databases hosted in secure
            data centres. Governed by Supabase&apos;s privacy policy.
          </li>
          <li>
            <span className="font-medium text-gray-700">Law enforcement:</span> We may disclose
            information when required by law, court order, or to protect the rights and safety of our
            users.
          </li>
        </ul>
        <p>All third-party providers are bound by data processing agreements that prohibit them from using your data for their own purposes.</p>
      </Section>

      <Section number={5} title="Security">
        <p>
          We implement industry-standard security measures to protect your information, including:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>AES-256 encryption of wallet private keys at rest.</li>
          <li>TLS 1.3 encryption for all data in transit.</li>
          <li>Role-based access controls limiting who can access production data.</li>
          <li>Regular security audits and penetration testing.</li>
          <li>Private keys are never exposed to the client side — all signing occurs server-side in an isolated environment.</li>
        </ul>
        <p>
          Despite these measures, no system is completely secure. If you discover a security vulnerability,
          please report it responsibly to{' '}
          <a href="mailto:security@admetos.xyz" className="text-emerald-600 hover:underline">
            security@admetos.xyz
          </a>
          .
        </p>
      </Section>

      <Section number={6} title="Your Rights">
        <p>
          Depending on your jurisdiction, you may have the following rights with respect to your personal
          data:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <span className="font-medium text-gray-700">Access:</span> Request a copy of the personal
            data we hold about you.
          </li>
          <li>
            <span className="font-medium text-gray-700">Correction:</span> Ask us to correct inaccurate
            or incomplete data.
          </li>
          <li>
            <span className="font-medium text-gray-700">Deletion:</span> Request deletion of your account
            and associated personal data. Note that on-chain transaction records cannot be deleted as they
            are part of the public blockchain.
          </li>
          <li>
            <span className="font-medium text-gray-700">Portability:</span> Receive your data in a
            machine-readable format.
          </li>
          <li>
            <span className="font-medium text-gray-700">Objection:</span> Object to certain types of
            processing.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:privacy@admetos.xyz" className="text-emerald-600 hover:underline">
            privacy@admetos.xyz
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section number={7} title="Cookies &amp; Tracking">
        <p>
          Admetos uses strictly necessary session cookies to maintain your authentication state. We do not
          use third-party advertising cookies or tracking pixels.
        </p>
        <p>
          We may use privacy-preserving analytics (aggregated, anonymised) to understand how features are
          used and improve the product. This does not involve tracking individual users across sessions or
          websites.
        </p>
      </Section>

      <Section number={8} title="Contact">
        <p>
          If you have questions or concerns about this Privacy Policy or your data, please reach out:
        </p>
        <ul className="list-none space-y-1 ml-2">
          <li>
            <span className="font-medium text-gray-700">Privacy inquiries: </span>
            <a href="mailto:privacy@admetos.xyz" className="text-emerald-600 hover:underline">
              privacy@admetos.xyz
            </a>
          </li>
          <li>
            <span className="font-medium text-gray-700">General support: </span>
            <a href="mailto:support@admetos.xyz" className="text-emerald-600 hover:underline">
              support@admetos.xyz
            </a>
          </li>
        </ul>
      </Section>
    </div>
  )
}
