# ZAINIFO — Sistema de Gestão (versão independente)

Este é o mesmo sistema, mas pronto para funcionar sozinho, fora do Claude — em MT
(Meticais), com login de equipe, portal do cliente, catálogo de serviços e
pagamento por E-Mola / M-Pesa / dinheiro.

Ele guarda os dados num banco de dados gratuito (Supabase), então segue funcionando
mesmo depois de publicado.

## Passo 1 — Criar o banco de dados (Supabase, grátis)

1. Vá a **https://supabase.com** → **Start your project** → crie uma conta grátis.
2. Clique em **New project**. Dê um nome (ex: `zainifo`) e uma senha para o banco
   (guarde essa senha, mas não vai precisar dela no dia a dia).
3. Espere uns 2 minutos o projeto ser criado.
4. No menu à esquerda, abra **SQL Editor** → **New query**.
5. Copie todo o conteúdo do arquivo `supabase-setup.sql` (está aqui na pasta) e cole
   ali. Clique em **Run**.
6. Agora vá em **Project Settings** (ícone de engrenagem) → **API**.
   Você vai precisar de dois valores:
   - **Project URL**
   - **anon public key**

## Passo 2 — Colocar as chaves no projeto

Abra o arquivo `src/lib/supabase.js` e troque:
- `COLE_AQUI_A_SUA_SUPABASE_URL` pela sua **Project URL**
- `COLE_AQUI_A_SUA_ANON_KEY` pela sua **anon public key**

(Ou, se preferir, crie um arquivo `.env` na raiz do projeto com:
```
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```
— nesse caso não precisa editar o `supabase.js`.)

## Passo 3 — Publicar no Cloudflare Pages

**Caminho mais simples (sem instalar nada no computador):**

1. Crie uma conta grátis em **https://github.com** (se ainda não tiver).
2. Crie um novo repositório (ex: `zainifo-sistema`) e envie todos os arquivos
   desta pasta para lá (dá para arrastar e soltar os arquivos na própria página
   do GitHub, em "Add file" → "Upload files").
3. Vá a **https://dash.cloudflare.com** → crie conta grátis (se não tiver) →
   **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
4. Selecione o repositório que você criou.
5. Nas configurações de build, use:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Em **Environment variables**, adicione (se você optou pelo `.env` no passo 2):
   - `VITE_SUPABASE_URL` = sua Project URL
   - `VITE_SUPABASE_ANON_KEY` = sua anon key
7. Clique em **Save and Deploy**. Em poucos minutos o Cloudflare te dá um link
   tipo `zainifo-sistema.pages.dev` — esse é o link definitivo do sistema.

## Primeiro acesso

Abra o link publicado, escolha **"Sou da equipe"** → **"Criar conta"** e crie o
usuário administrador. As próximas pessoas fazem login normalmente.

## Observação de segurança

O banco está configurado com acesso público de leitura/escrita (chave "anon"),
o que é suficiente para uso interno de uma pequena equipe, mas não tem o mesmo
nível de proteção de um sistema empresarial robusto. Se o negócio crescer e os
dados ficarem mais sensíveis, vale reforçar as regras de acesso no Supabase.
