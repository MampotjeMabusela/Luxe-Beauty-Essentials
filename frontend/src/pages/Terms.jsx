import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';
import { COMPANY } from '../data/company';

const LAST_UPDATED = '23 May 2026';

export default function Terms() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated={LAST_UPDATED}>
      <p className="legal-lead">
        These Terms and Conditions govern your use of the {COMPANY.name} website and any purchase
        inquiries or orders placed through our platform, WhatsApp, or other approved channels. By
        accessing our site or placing an order, you agree to these terms.
      </p>

      <nav className="legal-toc" aria-label="Table of contents">
        <p className="font-semibold text-luxe-brown mb-2">Contents</p>
        <ol>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#products-pricing">Products &amp; pricing</a></li>
          <li><a href="#orders">Orders &amp; WhatsApp inquiries</a></li>
          <li><a href="#payment">Payment</a></li>
          <li><a href="#delivery">Delivery</a></li>
          <li><a href="#returns">Returns &amp; refunds</a></li>
          <li><a href="#intellectual-property">Intellectual property</a></li>
          <li><a href="#limitation">Limitation of liability</a></li>
          <li><a href="#governing-law">Governing law</a></li>
          <li><a href="#contact">Contact</a></li>
        </ol>
      </nav>

      <LegalSection id="introduction" title="1. Introduction">
        <p>
          {COMPANY.name} ({COMPANY.legalName}) operates an online store offering premium hair
          extensions, lace fronts, and wigs to customers in South Africa. These terms apply to all
          visitors and customers unless we agree otherwise in writing.
        </p>
        <p>
          We may update these terms from time to time. Continued use of the website after changes
          are published constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection id="products-pricing" title="2. Products & pricing">
        <p>
          Product images are displayed in high quality (4K) for accuracy. Colours and textures may
          vary slightly due to screen settings, lighting, and natural variation in hair products.
        </p>
        <p>
          Many items are listed as <strong>price on inquiry</strong>. Final pricing, availability,
          and any applicable VAT will be confirmed via WhatsApp or email before payment is requested.
          A quote is not binding until you accept it and we confirm stock.
        </p>
      </LegalSection>

      <LegalSection id="orders" title="3. Orders & WhatsApp inquiries">
        <p>
          You may add items to your cart on the website and submit an inquiry via WhatsApp with an
          order summary (including any PDF we provide). An order is only confirmed once we
          acknowledge it and agree on price, delivery, and payment method.
        </p>
        <p>
          You are responsible for providing accurate contact details, delivery address, and product
          specifications (length, colour, texture, etc.). We are not liable for delays or errors
          caused by incorrect information you supply.
        </p>
      </LegalSection>

      <LegalSection id="payment" title="4. Payment">
        <p>
          Payment methods and instructions will be shared after your order is confirmed. Payment
          must be received (or cleared, where applicable) before dispatch unless we agree to
          alternative terms in writing.
        </p>
        <p>{COMPANY.vatNote}</p>
      </LegalSection>

      <LegalSection id="delivery" title="5. Delivery">
        <p>
          Delivery fees depend on your location and order value. Indicative zones and rates are shown
          on our website footer; final shipping cost will be confirmed with your quote.
        </p>
        <p>
          Risk in the goods passes to you upon delivery to the address you provided. Please inspect
          your package on arrival and contact us within 48 hours if there is damage or a discrepancy.
        </p>
      </LegalSection>

      <LegalSection id="returns" title="6. Returns & refunds">
        <p>
          We offer a 30-day return policy on eligible items in original, unused condition with
          packaging intact, subject to hygiene and safety requirements for hair products. Custom or
          specially ordered items may not be returnable unless faulty.
        </p>
        <p>
          To request a return, contact us via WhatsApp or {COMPANY.email} with your order reference.
          Refunds are processed to the original payment method where possible, within a reasonable
          timeframe after we receive and inspect returned goods.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="7. Intellectual property">
        <p>
          All content on this website — including logos, product photography, text, and design — is
          owned by or licensed to {COMPANY.name}. You may not copy, reproduce, or use our content
          without prior written permission.
        </p>
      </LegalSection>

      <LegalSection id="limitation" title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by South African law, we are not liable for indirect,
          incidental, or consequential loss arising from use of the website or products. Our total
          liability for any claim relating to a confirmed order is limited to the amount you paid
          for that order.
        </p>
        <p>
          Nothing in these terms excludes liability that cannot be excluded under the Consumer
          Protection Act or other applicable law.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="9. Governing law">
        <p>
          These terms are governed by the laws of the Republic of South Africa. Any dispute shall be
          subject to the exclusive jurisdiction of the courts of South Africa, unless mandatory
          consumer protection rules provide otherwise.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>For questions about these terms, contact us:</p>
        <ul>
          <li>
            <strong>WhatsApp:</strong> {COMPANY.phone}
          </li>
          <li>
            <strong>Email:</strong> {COMPANY.email}
          </li>
          <li>
            <strong>Website:</strong> {COMPANY.website}
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
