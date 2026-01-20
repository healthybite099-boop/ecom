import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Mail
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for our dry fruits and food products website",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#fdf9f1] text-[#3b2224] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-sm opacity-70">
            Last Updated: 20 January 2026
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white/70 border border-[#3b2224]/10 rounded-xl p-6 mb-10 shadow-sm">
          <p className="leading-relaxed">
            These Terms & Conditions govern your use of our website and the
            purchase of dry fruits and food products from our platform. By
            accessing or placing an order on our website, you agree to be bound
            by these terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          <Section icon={<FileText />} title="1. Use of Website">
            <p>
              You agree to use this website for lawful purposes only. Any misuse,
              unauthorized access, or attempt to disrupt the website’s
              functionality is strictly prohibited.
            </p>
          </Section>

          <Section icon={<ShoppingBag />} title="2. Products & Availability">
            <p>
              All products listed are subject to availability. We reserve the
              right to modify or discontinue any product without prior notice.
              Product images are for representation purposes only.
            </p>
          </Section>

          <Section icon={<CreditCard />} title="3. Pricing & Payments">
            <p>
              Prices are listed in INR and are inclusive of applicable taxes
              unless stated otherwise. Payments are processed securely through
              third-party payment gateways. We do not store payment details.
            </p>
          </Section>

          <Section icon={<Truck />} title="4. Shipping & Delivery">
            <p>
              Delivery timelines are estimated and may vary based on location,
              availability, and external factors. We are not responsible for
              delays caused by courier partners or unforeseen circumstances.
            </p>
          </Section>

          <Section icon={<RefreshCcw />} title="5. Returns, Refunds & Cancellations">
            <p>
              Due to the perishable nature of food products, returns or refunds
              are accepted only in cases of damaged, expired, or incorrect items
              delivered. Requests must be raised within 24 hours of delivery
              with proper proof.
            </p>
          </Section>

          <Section icon={<ShieldCheck />} title="6. Quality & Safety Disclaimer">
            <p>
              We ensure that our products meet quality standards at the time of
              dispatch. However, we are not responsible for improper storage or
              handling after delivery.
            </p>
          </Section>

          <Section icon={<ShieldCheck />} title="7. Intellectual Property">
            <p>
              All content on this website, including logos, images, text, and
              designs, is the property of our brand and may not be used without
              prior written permission.
            </p>
          </Section>

          <Section icon={<ShieldCheck />} title="8. Limitation of Liability">
            <p>
              We shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              website.
            </p>
          </Section>

          <Section icon={<ShieldCheck />} title="9. Changes to Terms">
            <p>
              We reserve the right to update these Terms & Conditions at any
              time. Continued use of the website implies acceptance of the
              revised terms.
            </p>
          </Section>

          <Section icon={<Mail />} title="10. Contact Information">
            <p>
              For any questions regarding these Terms & Conditions, please
              contact us:
            </p>
            <p className="mt-2 font-medium">
               Email: healthybite099@gmail.com
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="bg-white/80 border border-[#3b2224]/10 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#3b2224]/5">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="leading-relaxed text-[15px]">
        {children}
      </div>
    </div>
  );
}
