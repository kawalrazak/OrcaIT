import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { LegalSection } from "@/components/legal-section";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for using the Orca IT website, booking forms, chatbot and Facebook Messenger assistant.",
};

export default function TermsPage() {
  return (
    <MarketingPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="Terms for using the Orca IT website, booking enquiries, chatbot and Facebook Messenger."
    >
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-5 lg:px-8">
          <p className="text-sm text-slate-500">Last updated: September 2026</p>

          <LegalSection title="Agreement">
            <p>
              By using the Orca IT website at{" "}
              <Link href="https://orcait.com.au" className="font-semibold text-brand-blue hover:underline">
                orcait.com.au
              </Link>
              , submitting a booking or enquiry form, using our website chatbot, or messaging our
              Facebook Page, you agree to these Terms of Service. If you do not agree, please do not
              use these services.
            </p>
          </LegalSection>

          <LegalSection title="Services">
            <p>
              Orca IT provides IT support, repairs, consulting and related technology services to
              homes and businesses in Australia. Information on our website is general in nature
              and does not constitute a binding quote until confirmed by our team.
            </p>
          </LegalSection>

          <LegalSection title="Bookings and enquiries">
            <p>
              When you submit a booking request or message us through the website chatbot or
              Facebook Messenger, you agree to provide accurate contact details and a fair
              description of the help you need. Submitting a request does not guarantee a specific
              appointment time until we confirm it with you.
            </p>
            <p>
              Our automated chatbot and Messenger assistant collect information to help arrange
              callbacks and appointments. A member of our team may follow up by phone or email.
            </p>
          </LegalSection>

          <LegalSection title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use our website or messaging channels for unlawful, abusive or misleading purposes</li>
              <li>Attempt to disrupt, scrape or interfere with our systems</li>
              <li>Submit false, spam or automated messages</li>
              <li>Share content that infringes the rights of others</li>
            </ul>
          </LegalSection>

          <LegalSection title="Website content">
            <p>
              We aim to keep website information accurate and up to date, but we do not warrant
              that all content is complete, current or error-free. Pricing, availability and service
              descriptions may change without notice.
            </p>
          </LegalSection>

          <LegalSection title="Limitation of liability">
            <p>
              To the maximum extent permitted by Australian law, Orca IT is not liable for any loss
              arising from use of the website, chatbot or Messenger assistant, including delayed
              responses, technical outages, or reliance on general information published online.
              Nothing in these terms excludes rights that cannot be excluded under the Australian
              Consumer Law.
            </p>
          </LegalSection>

          <LegalSection title="Third-party platforms">
            <p>
              If you contact us through Facebook Messenger, your use of Meta&apos;s platform is also
              governed by Meta&apos;s terms and policies. We are not responsible for Meta&apos;s
              services or platform availability.
            </p>
          </LegalSection>

          <LegalSection title="Privacy">
            <p>
              Our collection and use of personal information is described in our{" "}
              <Link href="/privacy" className="font-semibold text-brand-blue hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="Changes">
            <p>
              We may update these terms from time to time. The updated version will be posted on
              this page with a revised &quot;Last updated&quot; date. Continued use of our services
              after changes are posted constitutes acceptance of the updated terms.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>Questions about these terms:</p>
            <p>
              Email:{" "}
              <a href={`mailto:${ORCA_EMAIL}`} className="font-semibold text-brand-blue hover:underline">
                {ORCA_EMAIL}
              </a>
              <br />
              Phone:{" "}
              <a href={`tel:${ORCA_PHONE_TEL}`} className="font-semibold text-brand-blue hover:underline">
                {ORCA_PHONE_DISPLAY}
              </a>
            </p>
          </LegalSection>
        </div>
      </section>
    </MarketingPageShell>
  );
}
