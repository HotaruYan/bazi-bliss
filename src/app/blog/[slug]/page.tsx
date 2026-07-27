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
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/blog"
        className="text-amber-700 text-sm font-medium hover:text-amber-800 transition-colors mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <article>
        <div className="flex items-center gap-3 text-xs text-stone-400 mb-4">
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
          {post.title}
        </h1>

        <div className="ink-divider mb-8" />

        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
          {post.content.split("\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-xl font-bold text-stone-900 mt-10 mb-4"
                >
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="text-lg font-bold text-stone-900 mt-8 mb-3"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("- ")) {
              return (
                <li key={i} className="ml-4 text-stone-600">
                  {trimmed.replace("- ", "")}
                </li>
              );
            }

            if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
              return (
                <p key={i} className="font-bold text-stone-900 mt-6">
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

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-stone-700 font-medium mb-3">
            Curious what your own chart reveals?
          </p>
          <Link
            href="/order?product=life-blueprint"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all"
          >
            Get Your Life Blueprint — $39.99
          </Link>
        </div>
      </article>
    </div>
  );
}
