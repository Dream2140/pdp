export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
}

export const news: NewsArticle[] = [
  {
    id: "1",
    title: "SpaceX Successfully Lands Starship",
    summary:
      "SpaceX achieved a major milestone with the successful landing of its Starship rocket after an orbital test flight.",
    content:
      "SpaceX achieved a major milestone with the successful landing of its Starship rocket after an orbital test flight. The massive vehicle, standing at 120 meters tall, completed its full flight profile for the first time, including a controlled descent and landing at the Boca Chica facility in Texas. CEO Elon Musk called it 'a great day for humanity's future as a multiplanetary species.' The success paves the way for future missions to the Moon and Mars, with NASA already relying on Starship for its Artemis program.",
    date: "2026-04-08",
    author: "Sarah Chen",
  },
  {
    id: "2",
    title: "Global AI Regulation Framework Adopted",
    summary:
      "The United Nations approved a comprehensive framework for AI governance, setting international standards for development and deployment.",
    content:
      "The United Nations General Assembly has approved a comprehensive framework for artificial intelligence governance. The framework establishes binding international standards for AI development and deployment, including mandatory safety testing for large-scale AI systems, transparency requirements for automated decision-making, and protections against AI-generated misinformation. The agreement, signed by 154 countries, represents the most significant step toward global AI regulation to date.",
    date: "2026-04-07",
    author: "James Miller",
  },
  {
    id: "3",
    title: "Breakthrough in Quantum Computing",
    summary:
      "Researchers at MIT demonstrated a 1000-qubit quantum processor that maintains coherence for record-breaking durations.",
    content:
      "Researchers at MIT have demonstrated a 1000-qubit quantum processor that maintains quantum coherence for over 10 milliseconds — a record-breaking achievement. The new processor uses a novel error-correction technique that dramatically reduces decoherence, bringing practical quantum computing closer to reality. The team believes this breakthrough could accelerate drug discovery, materials science, and cryptography applications within the next five years.",
    date: "2026-04-06",
    author: "Dr. Emily Park",
  },
  {
    id: "4",
    title: "Electric Vehicles Surpass 50% of New Car Sales",
    summary:
      "For the first time, electric vehicles accounted for more than half of all new car sales globally in Q1 2026.",
    content:
      "Electric vehicles have crossed a historic threshold, accounting for 51.3% of all new car sales globally in the first quarter of 2026. The milestone was driven by falling battery prices, expanding charging infrastructure, and stricter emissions regulations in major markets. China led the transition with 68% EV adoption, followed by Europe at 55% and North America at 42%. Industry analysts predict the internal combustion engine will become a niche product by 2032.",
    date: "2026-04-05",
    author: "Michael Torres",
  },
  {
    id: "5",
    title: "Ocean Cleanup Project Removes 100,000 Tons of Plastic",
    summary:
      "The Ocean Cleanup initiative reached a major milestone, having removed over 100,000 tons of plastic waste from the Pacific Ocean.",
    content:
      "The Ocean Cleanup project has reached its ambitious target of removing 100,000 tons of plastic from the Great Pacific Garbage Patch. Using its fleet of autonomous cleanup systems, the organization has been systematically clearing the massive accumulation of ocean debris. The collected plastic is being recycled into durable consumer products, creating a sustainable funding model for continued operations. The project now plans to expand to the Atlantic and Indian oceans.",
    date: "2026-04-04",
    author: "Lisa Anderson",
  },
  {
    id: "6",
    title: "New Programming Language 'Volt' Gains Traction",
    summary:
      "Volt, a new systems programming language focused on safety and performance, has entered the TIOBE top 20.",
    content:
      "Volt, a systems programming language released last year, has rapidly climbed to the TIOBE index top 20. Designed as a modern alternative to C++, Volt combines memory safety guarantees similar to Rust with a gentler learning curve and familiar syntax. Major tech companies including Google and Microsoft have started adopting Volt for performance-critical services. The language's growing ecosystem now includes over 5,000 packages and comprehensive tooling support.",
    date: "2026-04-03",
    author: "Alex Rivera",
  },
];

export function getNewsById(id: string): NewsArticle | undefined {
  return news.find((article) => article.id === id);
}

export function getAllNews(): NewsArticle[] {
  return news;
}
