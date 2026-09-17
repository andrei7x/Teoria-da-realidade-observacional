import { publicSupabase } from "@/lib/supabase";

export type PostStatus = "draft" | "published";
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[];
  status: PostStatus;
  is_featured: boolean;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export const categories = ["Consciência", "Avatar", "Metacognição", "Dimensões", "Axiomas", "Despertar", "Hermetismo", "Simulação", "Reflexões", "Ensaios"];

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function listPublished() {
  const { data, error } = await publicSupabase().from("posts").select("*").eq("status", "published").order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function listFeatured() {
  const { data, error } = await publicSupabase().from("posts").select("*").eq("status", "published").eq("is_featured", true).order("published_at", { ascending: false, nullsFirst: false }).limit(6);
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function getPublishedBySlug(slug: string) {
  const { data, error } = await publicSupabase().from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw error;
  return data as Post | null;
}
