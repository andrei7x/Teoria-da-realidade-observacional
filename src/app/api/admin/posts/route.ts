import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase";
import { slugify } from "@/lib/posts";

function normalize(body: any) {
  const title = String(body.title ?? "").trim();
  const slug = slugify(String(body.slug || title));
  const category = String(body.category ?? "").trim();
  const content = String(body.content ?? "").trim();
  if (!title || !slug || !category || !content) throw new Error("Título, slug, categoria e conteúdo são obrigatórios.");
  const status = body.status === "published" ? "published" : "draft";
  return {
    title,
    slug,
    excerpt: String(body.excerpt ?? "").trim() || null,
    content,
    category,
    tags: Array.isArray(body.tags) ? body.tags.map((v: unknown) => String(v).trim()).filter(Boolean) : [],
    status,
    is_featured: Boolean(body.is_featured),
    cover_image: body.cover_image ? String(body.cover_image) : null,
    updated_at: new Date().toISOString(),
    published_at: status === "published" ? (body.published_at || new Date().toISOString()) : null,
  };
}

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { data, error } = await adminSupabase().from("posts").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const payload = normalize(await request.json());
    const { data, error } = await adminSupabase().from("posts").insert(payload).select("*").single();
    if (error) return NextResponse.json({ error: error.code === "23505" ? "Este slug já existe." : error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
  }
}
