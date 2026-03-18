import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How this site collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <article className="py-20 w-full max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-foreground mb-2">Privacy Policy</h1>
      <p className="font-mono text-[11px] text-default-400 mb-10">
        Last updated: February 2026
      </p>

      <div className="flex flex-col gap-8 text-sm text-default-600 leading-relaxed [&_h2]:font-sans [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <section>
          <h2>Overview</h2>
          <p>
            This site is a personal portfolio. I collect minimal data and only
            what is necessary to operate the site. I do not sell your data to
            third parties.
          </p>
        </section>

        <section>
          <h2>Information I Collect</h2>
          <p className="mb-2">When you submit a recommendation, I collect:</p>
          <ul>
            <li>Your name and job title</li>
            <li>Email address and phone number (optional)</li>
            <li>Your relationship to me (optional)</li>
            <li>The recommendation message you write</li>
          </ul>
        </section>

        <section>
          <h2>How I Use Your Information</h2>
          <ul>
            <li>
              <strong>Recommendations:</strong> Your name, title, and message may
              be displayed publicly on this site after manual review. Your email
              and phone number are never displayed publicly and are only used to
              contact you if needed.
            </li>
            <li>
              <strong>Analytics:</strong> This site uses Google Analytics to
              collect anonymous usage data (pages visited, device type, location
              at country level). This helps me understand how visitors use the
              site. No personally identifiable information is shared with Google
              Analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2>Data Storage</h2>
          <p>
            Recommendation data is stored securely in a database. I retain this
            data for as long as the recommendation is displayed on the site, or
            until you request its removal.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to the personal data I hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw a submitted recommendation at any time</li>
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy or want to exercise
            your rights, please reach out via the{' '}
            <Link href="/#contact" className="text-primary hover:underline">
              contact section
            </Link>.
          </p>
        </section>
      </div>
    </article>
  )
}
