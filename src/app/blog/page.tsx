import Link from "next/link";
import { getAllPosts } from "@/content/blog-posts";

export const metadata = {
  title: "Blog — Bazi Bliss",
  description:
    "Explore articles about Bazi, the Five Elements, Chinese astrology, and self-discovery.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-3">
          Blog
        </h1>
        <p className="text-[#9c9588] mb-12">
          Exploring Bazi, the Five Elements, and ancient wisdom for modern life.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-[#6b6459]">
            <p className="text-lg">Articles coming soon.</p>
            <p className="text-sm mt-2">
              We&apos;re crafting in-depth content to help you understand Bazi and
              the Five Elements.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 hover:border-[#c8a951]/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 text-xs text-[#6b6459] mb-3">
                  <span className="px-2 py-0.5 bg-[#252525] text-[#c8a951] rounded-full font-medium">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-[#f0e6d3] mb-2 hover:text-[#c8a951] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[#9c9588] text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
