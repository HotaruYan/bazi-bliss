import Link from "next/link";

export const metadata = {
  title: "About — Bazi Bliss",
  description:
    "Learn about Bazi Bliss and our mission to bring ancient Chinese wisdom to modern life.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-[#0f0f0f] min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-8">
        About Bazi Bliss
      </h1>

      <div className="space-y-6 text-[#9c9588] leading-relaxed">
        <p className="text-lg text-[#f0e6d3]">
          Bazi Bliss was born from a simple question: <em>what if the ancient wisdom
          of Chinese astrology could speak clearly to modern life?</em>
        </p>

        <p>
          For over a thousand years, Bazi (八字, the Four Pillars of Destiny) has
          helped people understand their nature, navigate life transitions, and
          make better decisions. But for most of that time, accessing a real
          Bazi reading required finding a master practitioner, navigating
          language barriers, and decoding dense classical terminology.
        </p>

        <p>
          We built Bazi Bliss to change that. By combining authentic Bazi
          calculation methods with modern AI, we make this profound system
          accessible to anyone — in clear, relatable English, with practical
          insights you can actually use.
        </p>

        <h2 className="text-xl font-bold text-[#f0e6d3] mt-10">Our Approach</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {[
            {
              title: "Rooted in Tradition",
              desc: "Our analysis is based on classical Bazi principles — the Five Elements, the Ten Gods, the Twelve Earthly Branches — faithfully calculated from your birth data. No shortcuts, no generic templates.",
            },
            {
              title: "Powered by AI, Reviewed by Humans",
              desc: "AI allows us to generate deeply personalized reports at scale, but every report is reviewed before delivery. We ensure accuracy, coherence, and an empowering tone.",
            },
            {
              title: "Empowering, Not Fear-Based",
              desc: "We have zero tolerance for fear-mongering. Bazi reveals tendencies, not fixed destinies. Our reports always frame challenges as growth opportunities and end with a reminder of your free will.",
            },
            {
              title: "Made for Everyone",
              desc: "You don't need any prior knowledge of Chinese culture to benefit from your reading. All concepts are explained in accessible, modern language with practical takeaways.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5"
            >
              <h3 className="font-bold text-[#f0e6d3] mb-2">{item.title}</h3>
              <p className="text-sm text-[#9c9588]">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[#f0e6d3] mt-10">
          A Note on Ethics
        </h2>
        <p>
          Bazi is a tool for self-reflection and guidance — not a substitute for
          professional medical, legal, or financial advice. We design our
          reports to inspire and inform, never to frighten or manipulate. Our
          three core rules: no fear-mongering, no claims of absolute destiny, no
          encouragement of major life decisions without independent judgment.
        </p>

        <div className="mt-12 text-center">
          <Link
            href="/order?product=life-blueprint"
            className="inline-block px-8 py-4 btn-gold rounded-xl"
          >
            Get Your Life Blueprint
          </Link>
        </div>
      </div>
    </div>
  );
}
