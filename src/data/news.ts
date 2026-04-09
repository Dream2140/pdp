import { prisma } from "@/lib/prisma";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: Date;
  author: string;
}

const fallbackArticles: NewsArticle[] = [
  {
    id: "1",
    title: "SpaceX Successfully Lands Starship",
    summary:
      "SpaceX achieved a major milestone with the successful landing of its Starship rocket after an orbital test flight.",
    content:
      "SpaceX achieved a major milestone with the successful landing of its Starship rocket after an orbital test flight. The massive vehicle, standing at 120 meters tall, completed its full flight profile for the first time, including a controlled descent and landing at the Boca Chica facility in Texas.",
    date: new Date("2026-04-08"),
    author: "Sarah Chen",
  },
  {
    id: "2",
    title: "Global AI Regulation Framework Adopted",
    summary:
      "The United Nations approved a comprehensive framework for AI governance.",
    content:
      "The United Nations General Assembly has approved a comprehensive framework for artificial intelligence governance. The framework establishes binding international standards for AI development and deployment.",
    date: new Date("2026-04-07"),
    author: "James Miller",
  },
  {
    id: "3",
    title: "Breakthrough in Quantum Computing",
    summary: "Researchers at MIT demonstrated a 1000-qubit quantum processor.",
    content:
      "Researchers at MIT have demonstrated a 1000-qubit quantum processor that maintains quantum coherence for over 10 milliseconds — a record-breaking achievement.",
    date: new Date("2026-04-06"),
    author: "Dr. Emily Park",
  },
];

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  try {
    if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
    return await prisma.article.findUnique({ where: { id } });
  } catch {
    return fallbackArticles.find((a) => a.id === id) || null;
  }
}

export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL");
    return await prisma.article.findMany({ orderBy: { date: "desc" } });
  } catch {
    return fallbackArticles;
  }
}
