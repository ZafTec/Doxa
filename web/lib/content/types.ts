/**
 * Data contracts for content pages that don't have a backend endpoint yet.
 * Every page under app/(storefront)/(content) renders a placeholder today,
 * typed against the shape it will eventually fetch - so wiring the real
 * endpoint later is a data-fetching change, not a page redesign.
 */

export interface StoryPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string; // ISO date
  author: string;
}

export interface CollectionSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  itemCount: number;
}

export interface RetailerLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  phone?: string;
  mapUrl?: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: "shipping" | "service" | "general";
}

export interface AboutContent {
  heroTitle: string;
  heroBody: string;
  manufactureSections: Array<{ title: string; body: string; image?: string }>;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
}
