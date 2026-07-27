interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  product: string;
}

export default function TestimonialCard({
  quote,
  name,
  location,
  product,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-amber-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-sm text-stone-600 leading-relaxed mb-4 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="text-xs text-stone-500">
        <span className="font-semibold text-stone-700">{name}</span>
        {" · "}
        {location}
        <br />
        <span className="text-amber-700">{product}</span>
      </div>
    </div>
  );
}
