import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { LegalSection } from "@/components/legal-section";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Orca IT collects, uses and protects personal information from website visitors, booking forms and Facebook Messenger.",
};

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we handle your personal information when you contact Orca IT, book a service, or message us on Facebook."
    >
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-5 lg:px-8">
          <p className="text-sm text-slate-500">Last updated: September 2026</p>

          <LegalSection title="Who we are">
            <p>
              Orca IT (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides IT support and
              technology services to homes and businesses in Australia. This policy explains how we
              collect and use personal information through our website at{" "}
              <Link href="https://orcait.com.au" className="font-semibold text-brand-blue hover:underline">
                orcait.com.au
              </Link>
              , our booking forms, website chatbot, and Facebook Page Messenger.
            </p>
          </LegalSection>

          <LegalSection title="Information we collect">
            <p>We may collect the following when you contact us or request a booking:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Name, phone number and email address</li>
              <li>Suburb or address (where relevant to the service)</li>
              <li>Details about the technology issue or service you need</li>
              <li>Preferred contact time and whether you are a home or business customer</li>
              <li>Messages you send through our website chatbot or Facebook Messenger</li>
            </ul>
            <p>
              If you message our Facebook Page, Meta may also process your message according to
              Meta&apos;s own privacy policy. We receive the content of your message so we can
              respond and arrange appointments.
            </p>
          </LegalSection>

          <LegalSection title="How we use your information">
            <p>We use your information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to enquiries and provide IT support</li>
              <li>Book and manage appointments</li>
              <li>Contact you about your service request</li>
              <li>Improve our website chatbot and Messenger assistant</li>
              <li>Keep internal business records in our CRM system</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </LegalSection>

          <LegalSection title="Where data is stored">
            <p>
              Enquiries and bookings are stored securely on our business systems, including our
              CRM database and related export files used for record-keeping. Email notifications
              may be sent to our staff when a new enquiry is submitted.
            </p>
          </LegalSection>

          <LegalSection title="How long we keep information">
            <p>
              We keep contact and booking records for as long as needed to provide services,
              manage your enquiry, meet legal obligations, and maintain business records. When
              information is no longer required, we delete or de-identify it where reasonable.
            </p>
          </LegalSection>

          <LegalSection title="Sharing your information">
            <p>We may share information only when necessary, such as:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>With our staff and technicians to deliver the service you requested</li>
              <li>With service providers that help us operate our website, email or CRM (under confidentiality)</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </LegalSection>

          <LegalSection title="Your choices and rights">
            <p>
              You may request access to, correction of, or deletion of your personal information,
              subject to applicable law. To make a request, contact us using the details below.
            </p>
            <p>
              You can stop using our website chatbot or Facebook Messenger at any time. Unsubscribing
              from marketing communications (if applicable) can be done by contacting us.
            </p>
          </LegalSection>

          <LegalSection title="Security">
            <p>
              We take reasonable steps to protect personal information from misuse, loss,
              unauthorised access, modification or disclosure. No online system is completely secure,
              and we encourage you not to send sensitive credentials through chat or email.
            </p>
          </LegalSection>

          <LegalSection title="Contact us">
            <p>For privacy questions or requests, contact:</p>
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
