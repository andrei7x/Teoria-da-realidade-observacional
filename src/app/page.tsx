import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import Script from "next/script";
import { listPublished } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function loadLegacySite() {
  const root = process.cwd();
  const html = readFileSync(join(root, "index.html"), "utf8");
  const css = readFileSync(join(root, "style.css"), "utf8");
  const script = readFileSync(join(root, "script.js"), "utf8");

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch?.[1] ?? "";

  body = body
    .replace(/<script\s+src=["']script\.js["']><\/script>/i, "")
    .replace(
      "</nav>",
      '<a href="#reflexoes-novas">Reflexões</a><a href="/admin">Admin</a></nav>'
    );

  return { body, css, script };
}

export default async function HomePage() {
  const { body, css, script } = loadLegacySite();
  const published = await listPublished();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div dangerouslySetInnerHTML={{ __html: body }} />

      <section className="section dark-band" id="reflexoes-novas">
        <div className="section-heading reveal visible">
          <p className="eyebrow">Reflexões e atualizações</p>
          <h2>O ensaio continua em movimento.</h2>
        </div>

        {published.length > 0 ? (
          <div className="card-grid">
            {published.map((post) => (
              <article className="glass-card consequence-card reveal visible" key={post.id}>
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt=""
                    style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", marginBottom: 18 }}
                  />
                )}
                <p className="eyebrow">{post.category}</p>
                <h3>{post.title}</h3>
                {post.excerpt && <p style={{ marginTop: 12 }}>{post.excerpt}</p>}
                <div className="hero-actions">
                  <Link className="button secondary" href={`/reflexoes/${post.slug}`}>
                    Ler reflexão →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="notice-box reveal visible">
            <p>
              Nenhuma nova publicação foi adicionada ainda. Todo o conteúdo original da
              Teoria da Realidade Observacional permanece preservado acima.
            </p>
          </div>
        )}

        <div className="hero-actions" style={{ marginTop: 28 }}>
          <Link className="button primary" href="/reflexoes">
            Ver todas as reflexões
          </Link>
          <Link className="button secondary" href="/admin">
            Área administrativa
          </Link>
        </div>
      </section>

      <Script id="legacy-site-script" strategy="afterInteractive">
        {script}
      </Script>
    </>
  );
}
