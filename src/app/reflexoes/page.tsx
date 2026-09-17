import Link from "next/link";
import { listPublished } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReflexoesPage() {
  const posts = await listPublished();
  return <main className="shell section"><p className="eyebrow">Arquivo vivo</p><h1>Reflexões</h1><p className="lead">Novos textos, axiomas, relatos e extensões da Teoria da Realidade Observacional.</p><div className="grid">{posts.map(post => <article className="card" key={post.id}>{post.cover_image && <img src={post.cover_image} alt="" />}<p className="meta">{post.category} · {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : ""}</p><h2>{post.title}</h2><p>{post.excerpt}</p><div className="tags">{post.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div><div className="actions"><Link className="btn" href={`/reflexoes/${post.slug}`}>Ler reflexão</Link></div></article>)}</div>{posts.length === 0 && <div className="card"><p>Nenhuma reflexão publicada ainda.</p></div>}</main>;
}
