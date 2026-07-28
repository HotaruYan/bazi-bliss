import OrderForm from "@/components/OrderForm";

export const metadata = {
  title: "Order Your Bazi Reading — Bazi Bliss",
  description:
    "Fill in your birth details and get a personalized Bazi life blueprint delivered to your inbox.",
};

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-3">
            Order Your Reading
          </h1>
          <p className="text-[#9c9588]">
            Fill in your details below. Your personalized report will be delivered
            to your email within 24 hours.
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 md:p-10">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
