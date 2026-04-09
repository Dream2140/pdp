import { getAllNews, getNewsById } from "@/data/news";

describe("news data", () => {
  it("returns all news articles", () => {
    const articles = getAllNews();
    expect(articles.length).toBeGreaterThan(0);
  });

  it("each article has required fields", () => {
    const articles = getAllNews();
    for (const article of articles) {
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("summary");
      expect(article).toHaveProperty("content");
      expect(article).toHaveProperty("date");
      expect(article).toHaveProperty("author");
    }
  });

  it("finds article by id", () => {
    const article = getNewsById("1");
    expect(article).toBeDefined();
    expect(article!.id).toBe("1");
  });

  it("returns undefined for non-existent id", () => {
    const article = getNewsById("999");
    expect(article).toBeUndefined();
  });
});
