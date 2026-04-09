import Link from "next/link";
import { getAllNews } from "@/data/news";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getAllNews();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Latest News</h1>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.id}`}
            className="block rounded-lg bg-white p-6 shadow transition hover:shadow-md"
          >
            <div className="mb-1 text-sm text-gray-500">
              {article.date.toLocaleDateString("en-US")} &middot;{" "}
              {article.author}
            </div>
            <h2 className="mb-2 text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
