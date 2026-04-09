import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsById, getAllNews } from "@/data/news";

export function generateStaticParams() {
  return getAllNews().map((article) => ({ id: article.id }));
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getNewsById(id);

  if (!article) {
    notFound();
  }

  return (
    <article>
      <Link
        href="/"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        &larr; Back to news
      </Link>
      <div className="mb-2 text-sm text-gray-500">
        {article.date} &middot; {article.author}
      </div>
      <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
      <div className="prose max-w-none">
        <p className="text-lg leading-relaxed text-gray-700">
          {article.content}
        </p>
      </div>
    </article>
  );
}
