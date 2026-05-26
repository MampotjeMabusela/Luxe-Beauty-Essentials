import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';
import { COMPANY } from '../data/company';

const LAST_UPDATED = '23 May 2026';

export default function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="legal-lead">
        {COMPANY.name} respects your privacy and processes personal information in line with the
        Protection of Personal Information Act (POPIA) of South Africa. This policy explains what we
        collect, why we use it, and your rights.
      </p>

      <nav className="legal-toc" aria-label="Table of contents">
        <p className="font-semibold text-luxe-brown mb-2">Contents</p>
        <ol>
          <li><a href="#who-we-are">Who we are</a></li>
          <li><a href="#data-we-collect">Information we collect</a></li>
          <li><a href="#how-we-use">How we use your information</a></li>
          <li><a href="#legal-basis">Lawful processing</a></li>
          <li><a href="#sharing">Sharing &amp; third parties</a></li>
          <li><a href="#storage">Storage &amp; security</a></li>
          <li><a href="#cookies">Cookies &amp; local storage</a></li>
          <li><a href="#your-rights">Your rights</a></li>
          <li><a href="#retention">Retention</a></li>
          <li><a href="#contact-privacy">Contact &amp; complaints</a></li>
        </ol>
      </nav>

      <LegalSection id="who-we-are" title="1. Who we are">
        <p>
          The responsible party for your personal information is {COMPANY.legalName} trading as{' '}
          <strong>{COMPANY.name}</strong>, based in {COMPANY.address}. {COMPANY.popia}
        </p>
      </LegalSection>

      <LegalSection id="data-we-collect" title="2. Information we collect">
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li>
            <strong>Identity &amp; contact:</strong> name, phone number, email address, city or
            delivery area
          </li>
          <li>
            <strong>Order details:</strong> products requested, quantities, notes (e.g. length,
            colour), and cart or PDF order summaries
          </li>
          <li>
            <strong>Account data:</strong> if you register — email, password (stored securely), and
            profile preferences
          </li>
          <li>
            <strong>Technical data:</strong> browser type, device information, and usage data when
            you visit our website
          </li>
          <li>
            <strong>Communications:</strong> messages sent via WhatsApp, email, or contact forms
          </li>
        </ul>
        <p>
          We do not intentionally collect special personal information (such as health data) unless
          you voluntarily include it in order notes and it is relevant to fulfilling your request.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" title="3. How we use your information">
        <p>We use your information to:</p>
        <ul>
          <li>Process inquiries, quotes, and orders</li>
          <li>Communicate with you via WhatsApp, email, or phone</li>
          <li>Arrange delivery and handle returns or support requests</li>
          <li>Improve our website, products, and customer experience</li>
          <li>Comply with legal, tax, and regulatory obligations</li>
          <li>Send marketing only where you have given consent (you may opt out at any time)</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-basis" title="4. Lawful processing">
        <p>Under POPIA, we process personal information when:</p>
        <ul>
          <li>You consent (e.g. submitting a contact form or WhatsApp inquiry)</li>
          <li>Processing is necessary to perform a contract or take steps at your request</li>
          <li>We have a legitimate interest that is not overridden by your rights</li>
          <li>We are required to do so by law</li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="5. Sharing & third parties">
        <p>
          We do not sell your personal information. We may share data with trusted service providers
          who assist us — for example payment processors, delivery couriers, hosting providers, or
          email services — only to the extent needed for their role and under appropriate
          confidentiality obligations.
        </p>
        <p>
          If you complete payment or checkout through a third-party gateway, their privacy policy
          also applies to information you provide directly to them.
        </p>
      </LegalSection>

      <LegalSection id="storage" title="6. Storage & security">
        <p>
          We implement reasonable technical and organisational measures to protect your information
          against unauthorised access, loss, or misuse. Data may be stored on secure servers locally
          or with reputable cloud providers.
        </p>
        <p>
          No method of transmission over the internet is 100% secure. While we strive to protect your
          data, we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="7. Cookies & local storage">
        <p>Our website may use:</p>
        <ul>
          <li>
            <strong>Essential storage</strong> — e.g. cart contents and saved contact details in your
            browser to improve checkout convenience
          </li>
          <li>
            <strong>Session cookies</strong> — if you sign in, to keep you authenticated
          </li>
        </ul>
        <p>
          You can clear cookies and local storage via your browser settings. Some features may not
          work correctly if you disable essential storage.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="8. Your rights">
        <p>Under POPIA, you have the right to:</p>
        <ul>
          <li>Request access to personal information we hold about you</li>
          <li>Ask for correction or deletion where applicable</li>
          <li>Object to processing in certain circumstances</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with the Information Regulator (South Africa)</li>
        </ul>
        <p>
          To exercise these rights, contact us using the details below. We will respond within a
          reasonable period as required by law.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="9. Retention">
        <p>
          We retain personal information only for as long as necessary to fulfil the purposes
          described in this policy, including legal, accounting, or reporting requirements. Order
          and communication records may be kept for several years where required for tax or dispute
          resolution purposes.
        </p>
      </LegalSection>

      <LegalSection id="contact-privacy" title="10. Contact & complaints">
        <p>For privacy-related requests or questions:</p>
        <ul>
          <li>
            <strong>Email:</strong> {COMPANY.email}
          </li>
          <li>
            <strong>WhatsApp:</strong> {COMPANY.phone}
          </li>
        </ul>
        <p>
          <strong>Information Regulator (South Africa):</strong>{' '}
          <a
            href="https://www.justice.gov.za/inforeg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-luxe-gold hover:underline"
          >
            www.justice.gov.za/inforeg
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
