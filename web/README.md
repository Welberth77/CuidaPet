# CuidaPet — Web (React + Tailwind + Supabase)

MVP funcional do CuidaPet: cadastro/login, meus pets, carteira de saúde
(vacinas e medicamentos), banho e tosa, e perfil do usuário.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS**
- **Supabase Auth** (e-mail/senha)
- **Supabase (PostgreSQL)** como banco de dados, com Row Level Security
- **React Router**

## 1. Instalar dependências
```bash
npm install
```

## 2. Criar o projeto no Supabase
1. Acesse https://supabase.com e crie uma conta / novo projeto.
2. Defina um nome e uma senha para o banco (guarde essa senha).
3. Escolha a região mais próxima (ex.: South America / São Paulo) e crie.

## 3. Criar as tabelas (schema)
1. No painel do Supabase, abra **SQL Editor**.
2. Clique em **New query**, cole todo o conteúdo de `supabase/schema.sql`
   e clique em **Run**.
3. Isso cria as tabelas (`profiles`, `pets`, `saude`, `banho_tosa`), ativa a
   segurança por linha (RLS) e o gatilho que cria o perfil no cadastro.

## 3b. Fotos de pet (opcional, mas recomendado)
Para habilitar o upload de foto do pet, rode também o arquivo
`supabase/storage.sql` no **SQL Editor**. Ele adiciona a coluna `foto_url`,
cria o bucket publico `pet-fotos` e as politicas de acesso (cada usuario
so escreve na propria pasta). Sem isso, o cadastro de pet funciona
normalmente, apenas sem foto.

## 4. Ativar login por e-mail/senha
1. Vá em **Authentication → Sign In / Providers**.
2. Confirme que **Email** está habilitado.
3. **Para o MVP:** em **Authentication → Providers → Email**, desative
   **"Confirm email"**. Assim o usuário entra direto após se cadastrar,
   sem precisar confirmar o e-mail. (Se deixar ativado, o app mostra um
   aviso pedindo a confirmação.)

## 5. Variáveis de ambiente
Em **Project Settings → API**, copie **Project URL** e a chave **anon public**.
Copie `.env.example` para `.env` e preencha:
```bash
cp .env.example .env
```
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
> A chave **anon** é pública (pode ir para o front-end) — a segurança dos
> dados é garantida pelas políticas de RLS do passo 3.

## 6. Rodar em desenvolvimento
```bash
npm run dev
```
Abra o endereço que o Vite mostrar (geralmente http://localhost:5173),
crie uma conta e teste.

## 7. Deploy na Vercel
1. Suba o projeto para um repositório no GitHub.
2. Em https://vercel.com, **Add New → Project** e importe o repositório.
3. Em **Root Directory**, selecione a pasta **`web`**. O Vercel detecta Vite
   automaticamente (build: `npm run build`, output: `dist`).
4. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY`.
5. Em **Supabase → Authentication → URL Configuration**, adicione a URL da
   Vercel (ex.: `https://seu-projeto.vercel.app`) em **Site URL / Redirect URLs**.
6. Deploy. O `vercel.json` já cuida do redirecionamento de rotas (SPA).

## Modelo de dados (PostgreSQL)
- `profiles(id, nome, email, created_at)` — 1 por usuário (id = auth.users.id)
- `pets(id, owner_id, nome, especie, raca, sexo, peso, nascimento, cor, pelagem, sobre, created_at)`
- `saude(id, owner_id, pet_id, pet_nome, categoria, nome, data, proxima, created_at)`
- `banho_tosa(id, owner_id, pet_id, pet_nome, servico, data, proxima, observacoes, created_at)`

## Próximas etapas (fora do MVP v1)
- Petshops no mapa (Google Maps/Places)
- Notícias
- Lembretes com notificação
- Upload de foto do pet (Supabase Storage)
