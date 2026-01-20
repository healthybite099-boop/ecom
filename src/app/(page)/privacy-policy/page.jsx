import {
  ShieldCheck,
  Lock,
  ShoppingBag,
  CreditCard,
  Truck,
  Mail
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our dry fruits and food products website",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fdf9f1] text-[#3b2224] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm opacity-70">
            Last Updated: 20 January 2026
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white/70 border border-[#3b2224]/10 rounded-xl p-6 mb-10 shadow-sm">
          <p className="leading-relaxed">
            At <strong>Wownutt</strong>, your trust matters to us.
            This Privacy Policy explains how we collect, use, and protect your
            personal information when you browse our website or place an order
            for dry fruits and food products.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          <Section
            icon={<ShoppingBag />}
            title="1. Information We Collect"
          >
            <ul className="list-disc ml-6 space-y-1">
              <li>Name, mobile number, and email address</li>
              <li>Billing and delivery address</li>
              <li>Order details and purchase history</li>
            </ul>
          </Section>

          <Section
            icon={<CreditCard />}
            title="2. Payments & Transactions"
          >
            <p>
              All payments are processed securely through trusted third-party
              payment gateways. We do not store your card, UPI, or bank details
              on our servers.
            </p>
          </Section>

          <Section
            icon={<Truck />}
            title="3. Order Processing & Delivery"
          >
            <p>
              Your personal information is used only to process orders,
              arrange deliveries, send order updates, and provide customer
              support related to your purchases.
            </p>
          </Section>

          <Section
            icon={<ShieldCheck />}
            title="4. Use of Your Information"
          >
            <ul className="list-disc ml-6 space-y-1">
              <li>Order confirmation and delivery</li>
              <li>Customer service and support</li>
              <li>Improving our products and services</li>
              <li>Legal and regulatory compliance</li>
            </ul>
          </Section>

          <Section
            icon={<Lock />}
            title="5. Data Security"
          >
            <p>
              We use reasonable security practices to protect your personal
              data from unauthorized access, misuse, or disclosure. Access to
              customer data is restricted to authorized staff only.
            </p>
          </Section>

          <Section
            icon={<ShieldCheck />}
            title="6. Sharing of Information"
          >
            <p className="mb-2">
              We do not sell or rent your personal information to third parties.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Delivery partners for order fulfillment</li>
              <li>Payment gateways for transaction processing</li>
              <li>Government authorities when legally required</li>
            </ul>
          </Section>

          <Section
            icon={<Lock />}
            title="7. Cookies"
          >
            <p>
              Cookies are used to enhance browsing experience, remember cart
              items, and improve website performance. You may disable cookies
              via your browser settings.
            </p>
          </Section>

        
          <Section
            icon={<ShieldCheck />}
            title="8. Changes to This Policy"
          >
            <p>
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a revised date.
            </p>
          </Section>

          <Section
            icon={<Mail />}
            title="9. Contact Us"
          >
            <p>
              For questions or concerns related to privacy or data protection,
              please contact us:
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
