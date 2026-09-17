import Link from "next/link";
import { listFeatured, listPublished } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [featured, published] = await Promise.all([listFeatured(), listPublished()]);
  const latest = published.slice(0, 6);
  return (
    <main>
      <section className="shell hero">
        <p className="eyebrow">Ensaio filosófico e metafísico</p>
        <h1>Teoria da Realidade Observacional</h1>
        <p className="lead">Uma leitura sistemática sobre consciência, avatar, narrativa, metacognição e níveis de realidade — inspirada em lógica digital, observadores e interfaces.</p>
        <div className="actions"><a className="btn primary" href="#ensaio">Explorar a teoria</a><Link className="btn" href="/reflexoes">Ler reflexões</Link></div>
      </section>

      <section className="shell section" id="ensaio">
        <p className="eyebrow">Premissa central</p>
        <h2>Uma dimensão superior observa a inferior como um objeto completo.</h2>
        <div className="grid">
          <article className="card"><h3>Observador</h3><p>A consciência que percebe a experiência sem se reduzir integralmente aos estados do avatar.</p></article>
          <article className="card"><h3>Avatar</h3><p>Corpo, memória, impulsos e condicionamentos como interface de interação dentro da narrativa.</p></article>
          <article className="card"><h3>Metacognição</h3><p>O momento em que o observador identifica pensamentos como eventos mentais, não como identidade absoluta.</p></article>
        </div>
      </section>

      <section className="shell section">
        <p className="eyebrow">Mapa observacional</p>
        <h2>Da geometria à consciência</h2>
        <div className="grid">
          <article className="card"><strong>1D → 3D</strong><p>Linha, narrativa visual e simulação explorável: níveis ainda representáveis por geometria e estrutura.</p></article>
          <article className="card"><strong>4D</strong><p>O mundo vivido pelo avatar: espaço, tempo, corpo, emoção, memória e consequência narrativa.</p></article>
          <article className="card"><strong>5D+</strong><p>A geometria perde centralidade. Relação, informação, possibilidade e observação passam a organizar o modelo.</p></article>
        </div>
      </section>

      {featured.length > 0 && <section className="shell section"><p className="eyebrow">Reflexões em destaque</p><h2>Ideias que expandem o ensaio</h2><div className="grid">{featured.map(post => <article className="card" key={post.id}>{post.cover_image && <img src={post.cover_image} alt="" />}<p className="meta">{post.category}</p><h3>{post.title}</h3><p>{post.excerpt}</p><Link className="btn" href={`/reflexoes/${post.slug}`}>Ler reflexão</Link></article>)}</div></section>}

      <section className="shell section"><p className="eyebrow">Últimas publicações</p><h2>O ensaio continua em movimento</h2>{latest.length ? <div className="grid">{latest.map(post => <article className="card" key={post.id}><p className="meta">{post.category}</p><h3>{post.title}</h3><p>{post.excerpt}</p><Link href={`/reflexoes/${post.slug}`}>Continuar →</Link></article>)}</div> : <div className="card"><p className="muted">Nenhuma reflexão publicada ainda. O núcleo filosófico permanece disponível acima.</p></div>}<div className="actions"><Link className="btn primary" href="/reflexoes">Ver todas as reflexões</Link></div></section>

      <section className="shell section"><div className="card"><p className="eyebrow">Nota epistemológica</p><h2>Uma visão filosófica, não uma teoria física.</h2><p>Este projeto organiza uma experiência subjetiva e uma cosmologia pessoal por meio de analogias computacionais, narrativas e observacionais. Ele não afirma comprovação científica de dimensões superiores, consciências extracorpóreas ou entidades extradimensionais.</p></div></section>
    </main>
  );
}
