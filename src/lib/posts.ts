import { cmsJson } from "@/lib/cms-admin";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  is_featured: boolean;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export async function listPublished() {
  const { response, data } = await cmsJson({ action: "published" });
  if (!response.ok) throw new Error(data?.error || "Falha ao carregar publicações");
  return (data ?? []) as Post[];
}

export async function listFeatured() {
  const { response, data } = await cmsJson({ action: "featured" });
  if (!response.ok) throw new Error(data?.error || "Falha ao carregar destaques");
  return (data ?? []) as Post[];
}

export async function getPublishedBySlug(slug: string) {
  const { response, data } = await cmsJson({ action: "bySlug", slug });
  if (!response.ok) throw new Error(data?.error || "Falha ao carregar reflexão");
  return (data ?? null) as Post | null;
}
