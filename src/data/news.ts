import { prisma } from "@/lib/prisma";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: Date;
  author: string;
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  return prisma.article.findUnique({ where: { id } });
}

export async function getAllNews(): Promise<NewsArticle[]> {
  return prisma.article.findMany({ orderBy: { date: "desc" } });
}
