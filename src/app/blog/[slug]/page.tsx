import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/content/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Bazi Bliss Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="text-[#c8a951] text-sm font-medium hover:text-[#d4b96a] transition-colors mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        <article>
          <div className="flex items-center gap-3 text-xs text-[#6b6459] mb-4">
            <span className="px-2 py-0.5 bg-[#252525] text-[#c8a951] rounded-full font-medium">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-6">
            {post.title}
          </h1>

          <div className="ink-divider mb-8" />

          <div className="text-[#9c9588] leading-relaxed">
            {post.content.split("\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl font-bold text-[#f0e6d3] mt-10 mb-4"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-lg font-bold text-[#f0e6d3] mt-8 mb-3"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("- ")) {
                return (
                  <li key={i} className="ml-4 text-[#9c9588]">
                    {trimmed.replace("- ", "")}
                  </li>
                );
              }

              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return (
                  <p key={i} className="font-bold text-[#f0e6d3] mt-6">
                    {trimmed.replace(/\*\*/g, "")}
                  </p>
                );
              }

              return (
                <p key={i} className="mb-4">
                  {trimmed}
                </p>
              );
            })}
          </div>

          <div className="ink-divider my-10" />

          <div className="bg-[#1a1a1a] border border-[#c8a951]/30 rounded-2xl p-6 text-center">
            <p className="text-[#f0e6d3] font-medium mb-3">
              Curious what your own chart reveals?
            </p>
            <Link
              href="/order?product=life-blueprint"
              className="inline-block px-6 py-3 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-semibold hover:bg-[#d4b96a] transition-all"
            >
              Get Your Life Blueprint — $39.99
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
