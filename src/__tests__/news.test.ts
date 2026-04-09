/**
 * @jest-environment node
 */

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    article: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
}));

import { getAllNews, getNewsById } from "@/data/news";

const mockArticles = [
  {
    id: "test-1",
    title: "Test Article",
    summary: "Test summary",
    content: "Test content",
    date: new Date("2026-04-08"),
    author: "Test Author",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

beforeEach(() => {
  mockFindMany.mockResolvedValue(mockArticles);
  mockFindUnique.mockImplementation(({ where }: { where: { id: string } }) => {
    const found = mockArticles.find((a) => a.id === where.id);
    return Promise.resolve(found || null);
  });
});

describe("news data", () => {
  it("returns all news articles", async () => {
    const articles = await getAllNews();
    expect(articles.length).toBeGreaterThan(0);
  });

  it("each article has required fields", async () => {
    const articles = await getAllNews();
    for (const article of articles) {
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("summary");
      expect(article).toHaveProperty("content");
      expect(article).toHaveProperty("date");
      expect(article).toHaveProperty("author");
    }
  });

  it("finds article by id", async () => {
    const article = await getNewsById("test-1");
    expect(article).toBeDefined();
    expect(article!.id).toBe("test-1");
  });

  it("returns null for non-existent id", async () => {
    const article = await getNewsById("999");
    expect(article).toBeNull();
  });
});
