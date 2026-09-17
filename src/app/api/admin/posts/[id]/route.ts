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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  try {
    const payload = normalize(await request.json());
    const { data, error } = await adminSupabase().from("posts").update(payload).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.code === "23505" ? "Este slug já existe." : error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const { error } = await adminSupabase().from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
