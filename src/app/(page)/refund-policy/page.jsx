import {
    RefreshCcw,
    Truck,
    CreditCard,
    ShieldCheck,
    AlertCircle,
    Mail
} from "lucide-react";

export const metadata = {
    title: "Refund & Cancellation Policy",
    description: "Refund and cancellation policy for our dry fruits and food products website",
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-[#fdf9f1] text-[#3b2224] min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-14">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-sm opacity-70">
                        Last Updated: 20 January 2026
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white/70 border border-[#3b2224]/10 rounded-xl p-6 mb-10 shadow-sm">
                    <p className="leading-relaxed">
                        We strive to ensure complete customer satisfaction. Due to the
                        perishable nature of dry fruits and food products, our refund and
                        cancellation policy is designed to be fair, transparent, and in
                        compliance with applicable regulations.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">

                    <Section icon={<AlertCircle />} title="1. Order Cancellation">
                        <p>
                            Orders can be cancelled only before they are processed or shipped.
                            Once an order has been dispatched, cancellation requests will not
                            be accepted.
                        </p>
                    </Section>

                    <Section icon={<Truck />} title="2. Non-Returnable Items">
                        <p>
                            Dry fruits and food items are non-returnable due to hygiene and
                            safety reasons. Returns are accepted only if the product delivered
                            is damaged, expired, or incorrect.
                        </p>
                    </Section>

                    <Section icon={<ShieldCheck />} title="3. Eligible Refund Cases">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Damaged or tampered packaging at the time of delivery</li>
                            <li>Expired products</li>
                            <li>Incorrect items delivered</li>
                        </ul>
                    </Section>

                    <Section icon={<RefreshCcw />} title="4. Refund Request Process">
                        <p className="mb-2">
                            To request a refund:
                        </p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Contact us within <strong>24 hours</strong> of delivery</li>
                            <li>Provide order ID and clear images of the issue</li>
                            <li>Refund requests without proof may not be accepted</li>
                        </ul>
                    </Section>

                    <Section icon={<CreditCard />} title="5. Refund Method & Timeline">
                        <p>
                            Approved refunds will be processed to the original payment method
                            within <strong>5–7 business days</strong>. Processing time may vary
                            depending on the payment provider or bank.
                        </p>
                    </Section>

                    <Section icon={<ShieldCheck />} title="6. Replacement Policy">
                        <p>
                            In certain cases, we may offer a replacement instead of a refund,
                            subject to product availability and verification.
                        </p>
                    </Section>

                    <Section icon={<ShieldCheck />} title="7. Late or Missing Refunds">
                        <p>
                            If you have not received a refund after the processing period,
                            please check with your bank or payment provider before contacting
                            us.
                        </p>
                    </Section>

                    <Section icon={<Mail />} title="8. Contact Us">
                        <p>
                            For any questions regarding refunds or cancellations, please
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
