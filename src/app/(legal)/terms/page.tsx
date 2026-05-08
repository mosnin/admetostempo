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
        <span className="text-violet-400 mr-2">{number}.</span>
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500 pb-1">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        <p className="text-gray-600 leading-relaxed">
          Please read these Terms of Service carefully before using Admetos. By creating an account or
          using our services, you agree to be bound by these terms.
        </p>
      </div>

      <Section number={1} title="Acceptance of Terms">
        <p>
          By accessing or using the Admetos application (&quot;Service&quot;), you confirm that you are
          at least 18 years old, that you have read and understood these Terms, and that you agree to be
          bound by them. If you do not agree to these Terms, you must not use the Service.
        </p>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes are
          posted constitutes your acceptance of the revised Terms. We will notify you of material changes
          via email or in-app notice.
        </p>
      </Section>

      <Section number={2} title="Description of Service">
        <p>
          Admetos is a stablecoin payment application built on the Tempo blockchain. It allows users to
          send, receive, and manage stablecoin balances using a simple, message-like interface. Additional
          features include business accounts, a multi-chain bridge, and an explore feed for discovering
          contacts.
        </p>
        <p>
          The Service is provided &quot;as is&quot; and is currently in beta. Features, fees, and
          supported assets may change without prior notice during the beta period.
        </p>
      </Section>

      <Section number={3} title="Account Registration">
        <p>
          To use Admetos you must create an account via our authentication provider (Clerk). You agree
          to provide accurate, current, and complete information during registration and to keep that
          information up to date.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all
          activity that occurs under your account. Notify us immediately at{' '}
          <a href="mailto:support@admetos.xyz" className="text-violet-600 hover:underline">
            support@admetos.xyz
          </a>{' '}
          if you suspect unauthorised access.
        </p>
      </Section>

      <Section number={4} title="Crypto Wallet &amp; Funds">
        <p>
          Admetos holds your stablecoin wallet in a custodial manner, meaning Admetos controls the
          private keys associated with your in-app wallet on your behalf. This is designed to simplify the
          user experience; however, it means you are trusting Admetos to safeguard your funds.
        </p>
        <p>
          You acknowledge and accept the following risks:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Blockchain transactions are irreversible once confirmed.</li>
          <li>Stablecoin values may de-peg in extreme market conditions.</li>
          <li>Smart contract bugs or blockchain failures may affect your balance.</li>
          <li>Admetos is not a bank and your funds are not covered by FDIC or similar deposit insurance.</li>
        </ul>
        <p>
          We take commercially reasonable steps to secure custodial wallets, including encryption at rest
          and strict access controls. We may, at our discretion, offer self-custody options in the future.
        </p>
      </Section>

      <Section number={5} title="Prohibited Activities">
        <p>You agree not to use the Service for any of the following:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Fraud, deception, or impersonation of any person or entity.</li>
          <li>Scams, phishing, or any scheme to deprive others of funds.</li>
          <li>Money laundering, terrorist financing, or any activity that violates applicable anti-money-laundering laws.</li>
          <li>Transactions involving persons or entities in OFAC-sanctioned jurisdictions or on sanctions lists.</li>
          <li>Any activity that violates applicable local, state, national, or international law.</li>
          <li>Reverse engineering, scraping, or attempting to circumvent our security measures.</li>
        </ul>
        <p>
          Violation of this section may result in immediate account suspension, forfeiture of funds in
          accordance with applicable law, and referral to relevant authorities.
        </p>
      </Section>

      <Section number={6} title="Fees">
        <p>
          Admetos currently charges no fees for sending or receiving stablecoins within the platform.
          Network gas fees on the Tempo blockchain are either subsidised by Admetos or are negligible
          during the beta period.
        </p>
        <p>
          Fee structures are subject to change. We will provide at least 30 days&apos; notice before
          introducing new fees, except where required by applicable law or blockchain network conditions.
          The bridge feature may incur third-party fees that are passed through to users; these will be
          clearly displayed before you confirm any bridging transaction.
        </p>
      </Section>

      <Section number={7} title="Privacy">
        <p>
          Your use of the Service is also governed by our{' '}
          <a href="/privacy" className="text-violet-600 hover:underline">
            Privacy Policy
          </a>
          , which is incorporated into these Terms by reference. Please review the Privacy Policy to
          understand our data practices.
        </p>
      </Section>

      <Section number={8} title="Disclaimers &amp; Limitations">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
          TO THE FULLEST EXTENT PERMITTED BY LAW, ADMETOS DISCLAIMS ALL WARRANTIES, INCLUDING
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          IN NO EVENT SHALL ADMETOS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED
          OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF
          (A) THE AMOUNT YOU PAID TO ADMETOS IN THE 12 MONTHS PRECEDING THE CLAIM OR (B) $100 USD.
        </p>
      </Section>

      <Section number={9} title="Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws of the State of Delaware,
          United States, without regard to its conflict-of-law provisions. Any dispute arising out of
          these Terms shall be resolved by binding arbitration in accordance with the rules of the American
          Arbitration Association, and the arbitration shall take place in Delaware.
        </p>
        <p>
          You waive any right to a jury trial or to participate in a class action lawsuit against Admetos.
        </p>
      </Section>

      <Section number={10} title="Contact">
        <p>
          If you have questions about these Terms, please contact us:
        </p>
        <ul className="list-none space-y-1 ml-2">
          <li>
            <span className="font-medium text-gray-700">Email: </span>
            <a href="mailto:support@admetos.xyz" className="text-violet-600 hover:underline">
              support@admetos.xyz
            </a>
          </li>
          <li>
            <span className="font-medium text-gray-700">Website: </span>
            <a href="https://admetos.xyz" className="text-violet-600 hover:underline">
              admetos.xyz
            </a>
          </li>
        </ul>
      </Section>
    </div>
  )
}
