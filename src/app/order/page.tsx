import OrderForm from "@/components/OrderForm";

export const metadata = {
  title: "Order Your Bazi Reading — Bazi Bliss",
  description:
    "Fill in your birth details and get a personalized Bazi life blueprint delivered to your inbox.",
};

export default function OrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          Order Your Reading
        </h1>
        <p className="text-stone-500">
          Fill in your details below. Your personalized report will be delivered
          to your email within 24 hours.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-10 shadow-sm">
        <OrderForm />
      </div>
    </div>
  );
}
