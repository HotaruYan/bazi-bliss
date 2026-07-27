import Link from "next/link";

export const metadata = {
  title: "Order Confirmed — Bazi Bliss",
  description: "Your order has been received. Your Bazi life blueprint is being crafted.",
};

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
        Your Order Is Confirmed!
      </h1>
      <p className="text-stone-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
        Thank you for your purchase. Your personalized Bazi report is being
        crafted and will be delivered to your email within 24 hours.
      </p>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 mb-8 text-left max-w-md mx-auto shadow-sm">
        <h3 className="font-bold text-stone-900 mb-4">What happens next?</h3>
        <ol className="space-y-3 text-sm text-stone-600">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <span>You&apos;ll receive a confirmation email shortly.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <span>We calculate your birth chart and generate your personalized report (usually within a few hours).</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <span>Your full PDF report arrives in your inbox. That&apos;s it!</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/blog"
          className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
        >
          Read Our Blog
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
