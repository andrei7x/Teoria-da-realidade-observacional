"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Consciência", "Avatar", "Metacognição", "Dimensões", "Axiomas", "Despertar", "Hermetismo", "Simulação", "Reflexões", "Ensaios"];

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string; category: string; tags: string[];
  status: "draft" | "published"; is_featured: boolean; cover_image: string | null; published_at: string | null;
};

type FormState = Omit<Post, "id" | "published_at"> & { id?: string };

const empty: FormState = { title: "", slug: "", excerpt: "", content: "", category: "Reflexões", tags: [], status: "draft", is_featured: false, cover_image: null };

function makeSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminEditor() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    if (response.status === 401) return router.push("/admin/login");
    const data = await response.json();
    if (response.ok) setPosts(data);
  }

  useEffect(() => { void load(); }, []);

  function edit(post: Post) {
    setForm({ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", content: post.content, category: post.category, tags: post.tags ?? [], status: post.status, is_featured: post.is_featured, cover_image: post.cover_image });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage("");
    const endpoint = form.id ? `/api/admin/posts/${form.id}` : "/api/admin/posts";
    const method = form.id ? "PUT" : "POST";
    const response = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "Não foi possível salvar.");
    setMessage(form.id ? "Reflexão atualizada." : "Reflexão criada.");
    setForm(empty);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta publicação?")) return;
    const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (response.ok) { setForm(empty); await load(); }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) return setMessage("A imagem deve ter no máximo 4 MB.");
    setUploading(true); setMessage("");
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!response.ok) return setMessage(data.error || "Falha no upload.");
    setForm(current => ({ ...current, cover_image: data.url }));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login"); router.refresh();
  }

  return <main className="admin-wrap">
    <section className="card">
      <p className="eyebrow">CMS filosófico</p>
      <h1>{form.id ? "Editar reflexão" : "Nova reflexão"}</h1>
      <form className="admin-form" onSubmit={save}>
        <label>Título<input value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value, slug: v.id ? v.slug : makeSlug(e.target.value) }))} required /></label>
        <label>Slug<input value={form.slug} onChange={e => setForm(v => ({ ...v, slug: makeSlug(e.target.value) }))} required /></label>
        <label>Resumo<textarea style={{ minHeight: 110 }} value={form.excerpt ?? ""} onChange={e => setForm(v => ({ ...v, excerpt: e.target.value }))} /></label>
        <div className="row"><label>Categoria<select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Status<select value={form.status} onChange={e => setForm(v => ({ ...v, status: e.target.value as "draft" | "published" }))}><option value="draft">Rascunho</option><option value="published">Publicado</option></select></label></div>
        <label>Tags (separadas por vírgula)<input value={form.tags.join(", ")} onChange={e => setForm(v => ({ ...v, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))} /></label>
        <label>Conteúdo em Markdown<textarea value={form.content} onChange={e => setForm(v => ({ ...v, content: e.target.value }))} placeholder="# Título\n\nTexto, **negrito**, *itálico*, listas e citações." required /></label>
        <label>Imagem de capa<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label>
        {uploading && <p className="muted">Enviando imagem…</p>}
        {form.cover_image && <img className="cover" src={form.cover_image} alt="Prévia da capa" />}
        <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input style={{ width: 20, minHeight: 20 }} type="checkbox" checked={form.is_featured} onChange={e => setForm(v => ({ ...v, is_featured: e.target.checked }))} /> Destacar na página inicial</label>
        {message && <p>{message}</p>}
        <div className="actions"><button className="btn primary" disabled={saving || uploading}>{saving ? "Salvando…" : "Salvar"}</button>{form.id && <button type="button" className="btn" onClick={() => setForm(empty)}>Cancelar edição</button>}</div>
      </form>
    </section>

    <aside className="card"><div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}><div><p className="eyebrow">Publicações</p><h2>Conteúdo</h2></div><button className="btn" onClick={logout}>Sair</button></div><div className="post-list">{posts.map(post => <div className="post-row" key={post.id}><div><strong>{post.title}</strong><div className="meta">{post.status === "published" ? "Publicado" : "Rascunho"}{post.is_featured ? " · Destaque" : ""}</div></div><div className="actions"><button className="btn" onClick={() => edit(post)}>Editar</button><button className="btn" onClick={() => remove(post.id)}>Excluir</button></div></div>)}</div></aside>
  </main>;
}
