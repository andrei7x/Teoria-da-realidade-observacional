# Teoria da Realidade Observacional

Versão dinâmica do **Site da Consciência**, com ensaio filosófico público, arquivo de reflexões e CMS administrativo protegido.

## Stack

- Next.js + TypeScript
- Supabase Postgres
- Supabase Storage
- Markdown para o corpo das reflexões
- Sessão administrativa por cookie HTTP-only assinado
- Deploy recomendado: Vercel

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_SESSION_SECRET=um-segredo-aleatorio-com-32-caracteres-ou-mais
```

`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` nunca devem ser expostos no frontend ou enviados ao GitHub.

## Supabase

No SQL Editor, execute:

`supabase/migrations/001_create_posts.sql`

A migration cria a tabela `posts`, índices, RLS de leitura pública para posts publicados e o bucket público `consciousness-images` com limite de 4 MB para JPG, PNG e WEBP.

### Tabela `posts`

Campos principais:

- `title`, `slug`, `excerpt`, `content`
- `category`, `tags`
- `status` (`draft` ou `published`)
- `is_featured`
- `cover_image`
- `created_at`, `updated_at`, `published_at`

## Administração

Acesse:

`/admin/login`

Depois do login, `/admin` permite:

- criar, editar e excluir reflexões;
- salvar rascunhos ou publicar;
- marcar destaque na home;
- escolher categoria e tags;
- escrever em Markdown;
- enviar imagem de capa ao Supabase Storage.

Categorias incluídas: Consciência, Avatar, Metacognição, Dimensões, Axiomas, Despertar, Hermetismo, Simulação, Reflexões e Ensaios.

## Rotas públicas

- `/` — interface original do ensaio preservada + reflexões dinâmicas
- `/reflexoes` — arquivo de textos publicados
- `/reflexoes/[slug]` — leitura individual com metadados SEO e Open Graph

## Rodar localmente

```bash
pnpm install
pnpm typecheck
pnpm dev
```

Build de produção:

```bash
pnpm typecheck
pnpm build
```

## Vercel

Conecte o repositório `andrei7x/Teoria-da-realidade-observacional` à branch `main` e use o preset Next.js. Cada novo commit em `main` deve disparar um novo deployment.

## Segurança

- A senha administrativa permanece apenas em variável de ambiente server-side.
- A sessão usa cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção.
- CRUD e upload exigem sessão administrativa válida.
- A service role do Supabase é usada apenas no servidor.
- Slugs são normalizados e duplicidade é rejeitada pelo banco.
- Imagens são validadas por tipo e tamanho antes do upload.

## Observação epistemológica

O projeto apresenta uma visão filosófica e cosmológica pessoal sobre consciência, avatar, metacognição e níveis observacionais da realidade. Não é apresentado como teoria física comprovada.

<!-- deployment trigger: restore original interface -->
