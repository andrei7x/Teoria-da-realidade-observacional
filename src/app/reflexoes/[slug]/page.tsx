import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPublishedBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) return { title: "Reflexão não encontrada" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: post.cover_image ? [post.cover_image] : undefined },
  };
}

export default async function ReflexaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) notFound();
  return <main className="article"><p className="eyebrow">{post.category}</p><h1>{post.title}</h1><p className="meta">{post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : ""}</p>{post.cover_image && <img className="cover" src={post.cover_image} alt="" />}<div className="tags">{post.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div><article className="article-content"><ReactMarkdown>{post.content}</ReactMarkdown></article><div className="actions"><Link className="btn" href="/reflexoes">← Voltar às reflexões</Link></div></main>;
}
