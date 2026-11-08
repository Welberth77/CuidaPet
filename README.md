# CuidaPet — Web

Aplicação web para acompanhar a saúde e os cuidados do seu pet: cadastro de pets,
carteira de saúde exportável, vacinas e medicamentos, banho e tosa, despesas,
compartilhamento entre tutores, lembretes e relatórios administrativos.

Produção: **https://cuida-pet-olive.vercel.app**

## Funcionalidades

- **Conta:** cadastro e login com e-mail e senha, confirmação por link, recuperação
  de senha, edição de perfil com foto e exclusão de conta.
- **Pets:** cadastro e edição com foto (com editor de recorte), dados como espécie,
  raça, sexo, peso, nascimento, cor, pelagem e observações.
- **Carteira de saúde:** vacinas e medicamentos com próxima dose, exportável em PDF e
  compartilhável como imagem (Web Share API quando disponível).
- **Banho e tosa:** histórico de serviços com próxima data.
- **Despesas:** controle de gastos por pet.
- **Compartilhamento:** convide outro tutor por usuário; o pet e seus registros ficam
  acessíveis a ambos, com atualização em tempo real (Supabase Realtime) e notificações.
- **Aniversário:** comemoração especial no dia do aniversário do pet.
- **Memorial:** ao registrar a partida de um pet, ele vai para a seção "Em memória",
  com uma homenagem discreta, e pode ser restaurado.
- **Tema claro e escuro:** o modo claro é o padrão; o usuário pode alternar, inclusive
  nas telas de login e cadastro.
- **Acessibilidade:** link "Pular para o conteúdo", foco visível, suporte a
  "reduzir movimento" e navegação por teclado.
- **Busca e ordenação** nas listas de registros.
- **PWA:** pode ser instalado no celular (service worker ativo apenas em produção).
- **Relatórios administrativos (somente admins):** indicadores, gráficos, abas de
  usuários e pets com último acesso, ordenação, busca e opção de incluir ou excluir
  administradores da análise.
- **Páginas legais:** Termos de Uso e Política de Privacidade (LGPD). O cadastro exige
  o aceite desses documentos.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (tema claro/escuro via classe `dark`)
- **React Router 6** (rotas com carregamento sob demanda)
- **Supabase**: Auth, PostgreSQL com Row Level Security (RLS), Storage (fotos),
  Realtime (notificações) e funções RPC
- **E-mail transacional:** Brevo (SMTP) configurado no Supabase
- **html2canvas** e **jsPDF** para a carteira de saúde (carregados sob demanda)

## Estrutura do projeto

```
web/
├── public/              # manifest, service worker, ícones e imagem Open Graph
├── src/
│   ├── components/      # interface reutilizável (layout, modais, gráficos, ilustrações)
│   ├── contexts/        # Auth, Notificações, Tema
│   ├── data/            # opções de espécie, raça, etc.
│   ├── pages/           # telas (rotas)
│   ├── services/        # acesso ao Supabase (pets, saúde, banho, despesas, relatórios...)
│   └── utils/           # datas, mensagens de erro de autenticação
└── supabase/            # scripts SQL e templates de e-mail
```

## 1. Instalar dependências

```bash
npm install
```

## 2. Criar o projeto no Supabase

1. Acesse https://supabase.com, crie uma conta e um novo projeto.
2. Defina um nome e uma senha para o banco (guarde essa senha).
3. Escolha a região mais próxima (ex.: South America / São Paulo).

## 3. Criar o banco de dados

No **SQL Editor** do Supabase, abra **New query**, cole o conteúdo de cada arquivo
abaixo e clique em **Run**, **nesta ordem**:

| Ordem | Arquivo | O que faz |
|-------|---------|-----------|
| 1 | `supabase/schema.sql` | Tabelas `profiles`, `pets`, `saude`, `banho_tosa`, RLS e gatilho de cadastro |
| 2 | `supabase/storage.sql` | Coluna `foto_url` e bucket público `pet-fotos` (cada usuário escreve só na própria pasta) |
| 3 | `supabase/compartilhamento.sql` | Tabela `pet_shares`, convites e políticas de acesso compartilhado |
| 4 | `supabase/excluir_conta.sql` | Função `excluir_minha_conta()` (apaga o usuário e todos os seus dados) |
| 5 | `supabase/extras.sql` | Foto de perfil, tabela `despesas` e Realtime para notificações |
| 6 | `supabase/memorial.sql` | Campos `falecido` e `data_falecimento` em `pets` |
| 7 | `supabase/relatorios.sql` | Coluna `is_admin` em `profiles` e funções dos relatórios administrativos |

Os scripts podem ser executados de novo com segurança na maioria dos casos.

### Tornar alguém administrador

Depois de rodar `relatorios.sql`, marque a conta do administrador:

```sql
update public.profiles set is_admin = true where email = 'seu-email@exemplo.com';
```

## 4. Autenticação e e-mails

1. Em **Authentication → Sign In / Providers → Email**, mantenha **"Confirm email" ativado**.
2. Em **Authentication → URL Configuration**:
   - **Site URL:** `https://cuida-pet-olive.vercel.app` (em desenvolvimento, `http://localhost:5173`).
   - **Redirect URLs:** `https://cuida-pet-olive.vercel.app/**` e `http://localhost:5173/**`.
3. Em **Authentication → Emails → SMTP Settings**, configure o SMTP do Brevo
   (servidor `smtp-relay.brevo.com`, porta `587`, usuário e chave SMTP geradas no painel do Brevo).
   Não coloque essas credenciais no repositório.
4. Em **Authentication → Email Templates**, cole o conteúdo de
   `supabase/email-templates/confirmar-cadastro.html` (confirmação) e
   `supabase/email-templates/redefinir-senha.html` (recuperação de senha).
   Os templates usam `{{ .ConfirmationURL }}`.

> Observação: o remetente de e-mail deve ser verificado no Brevo. Para produção,
> recomenda-se um domínio próprio, o que melhora a entrega e evita o aviso de
> "Freemail" e a caixa de spam.

## 5. Variáveis de ambiente

Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.
Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> A chave **anon** é pública e pode ir para o front-end. A segurança dos dados é
> garantida pelas políticas de RLS criadas no passo 3.

## 6. Rodar em desenvolvimento

```bash
npm run dev
```

Abra http://localhost:5173, crie uma conta e teste.

## 7. Build de produção

```bash
npm run build      # gera a pasta dist/
npm run preview    # pré-visualiza o build localmente
```

O build separa as dependências em blocos (React, Supabase e geração de PDF) para
melhorar o carregamento.

## 8. Deploy na Vercel

1. Suba o repositório no GitHub.
2. Em https://vercel.com, **Add New → Project** e importe o repositório.
3. Em **Root Directory**, selecione a pasta **`web`**. A Vercel detecta o Vite
   automaticamente (build: `npm run build`, saída: `dist`).
4. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Confirme a URL da Vercel em **Supabase → Authentication → URL Configuration** (passo 4).
6. Faça o deploy. O `vercel.json` já redireciona as rotas para a aplicação (SPA).

## PWA (instalável no celular)

Em produção (HTTPS), o navegador oferece "Instalar" ou "Adicionar à tela inicial".
O service worker (`public/sw.js`) é registrado somente em produção, para não
atrapalhar o desenvolvimento.

## Modelo de dados (PostgreSQL)

- `profiles(id, nome, email, avatar_url, is_admin, created_at)`: um por usuário (id = `auth.users.id`)
- `pets(id, owner_id, nome, especie, raca, sexo, peso, nascimento, cor, pelagem, sobre, foto_url, falecido, data_falecimento, created_at)`
- `saude(id, owner_id, pet_id, pet_nome, categoria, nome, data, proxima, created_at)`
- `banho_tosa(id, owner_id, pet_id, pet_nome, servico, data, proxima, observacoes, created_at)`
- `despesas`: gastos por pet
- `pet_shares`: convites e compartilhamento de pets entre tutores

## Segurança e privacidade

- Todas as tabelas têm RLS; cada usuário acessa somente os próprios dados ou os pets
  compartilhados com ele.
- Validações nos formulários: intervalo de datas (a partir de 1990 até 5 anos no
  futuro), limites de peso e de valores e tamanho máximo dos textos.
- Os textos de Termos de Uso e Política de Privacidade são um ponto de partida e
  devem passar por revisão jurídica antes do lançamento oficial.

## Próximas etapas

- Lembretes de vacinas e banho por e-mail (job agendado)
- Exportação completa dos dados do usuário (LGPD)
- Troca de e-mail da conta
- Petshops no mapa (Google Maps / Places)
