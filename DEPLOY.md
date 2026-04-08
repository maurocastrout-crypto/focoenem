# 🚀 Guia de Deploy — FocoENEM

Siga exatamente esta ordem. Leva cerca de 30 minutos.

---

## PASSO 1 — Criar o projeto no Supabase

1. Acesse **https://supabase.com** e clique em **New Project**
2. Dê o nome **focoenem** e escolha a região **South America (São Paulo)**
3. Anote a senha do banco (você vai precisar)
4. Aguarde o projeto inicializar (~2 min)

### Copiar as chaves:
- Vá em **Settings → API**
- Copie:
  - `Project URL` → vai para `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → vai para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` → vai para `SUPABASE_SERVICE_ROLE_KEY`

### Criar o banco:
- Vá em **SQL Editor → New Query**
- Cole o conteúdo de `supabase/migrations/001_schema_inicial.sql`
- Clique em **Run** ✓
- Abra uma nova query, cole `supabase/migrations/002_seed_questoes.sql`
- Clique em **Run** ✓ (isso insere as 50 questões do ENEM)

### Configurar Auth:
- Vá em **Authentication → URL Configuration**
- Em **Site URL**, coloque: `https://SEU_DOMINIO.vercel.app`
- Em **Redirect URLs**, adicione: `https://SEU_DOMINIO.vercel.app/**`

---

## PASSO 2 — Configurar a Z-API (WhatsApp)

1. Acesse **https://z-api.io** e crie uma conta
2. Clique em **Criar Instância**
3. Escaneie o QR Code com o WhatsApp do responsável (ou um número de teste)
4. Copie:
   - **Instance ID** → vai para `ZAPI_INSTANCE_ID`
   - **Token** → vai para `ZAPI_TOKEN`
   - **Client Token** → vai para `ZAPI_CLIENT_TOKEN`

---

## PASSO 3 — Configurar o Stripe (Pagamentos)

1. Acesse **https://stripe.com** e crie uma conta
2. No Dashboard, vá em **Products → Add Product**
   - Nome: `FocoENEM`
   - Preço: `R$ 49,90`
   - Recorrência: `Mensal`
   - Moeda: `BRL`
3. Copie o **Price ID** (começa com `price_`) → vai para `STRIPE_PRICE_ID`
4. Vá em **Developers → API Keys** e copie:
   - `Publishable key` → vai para `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → vai para `STRIPE_SECRET_KEY`

> ⚠️ Use as chaves de **TEST** (pk_test_ / sk_test_) durante o desenvolvimento.
> Troque para LIVE apenas quando for lançar de verdade.

---

## PASSO 4 — Publicar na Vercel

1. Crie uma conta em **https://vercel.com**
2. Instale o Git em seu computador se ainda não tiver
3. Crie um repositório no GitHub e envie o projeto:

```bash
cd focoenem
git init
git add .
git commit -m "FocoENEM - primeiro deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/focoenem.git
git push -u origin main
```

4. Na Vercel, clique em **Add New Project → Import Git Repository**
5. Selecione o repositório `focoenem`
6. Antes de fazer o deploy, clique em **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJ...
SUPABASE_SERVICE_ROLE_KEY         = eyJ...
NEXT_PUBLIC_APP_URL               = https://SEU_DOMINIO.vercel.app
ZAPI_INSTANCE_ID                  = seu_instance_id
ZAPI_TOKEN                        = seu_token
ZAPI_CLIENT_TOKEN                 = seu_client_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY                 = sk_test_...
STRIPE_WEBHOOK_SECRET             = whsec_... (ver passo 5)
STRIPE_PRICE_ID                   = price_...
CRON_SECRET                       = uma_senha_aleatoria_forte_aqui
```

7. Clique em **Deploy** ✓

---

## PASSO 5 — Configurar Webhook do Stripe

Após o deploy, você precisa informar ao Stripe para onde enviar os eventos de pagamento.

1. No Stripe Dashboard, vá em **Developers → Webhooks**
2. Clique em **Add Endpoint**
3. URL: `https://SEU_DOMINIO.vercel.app/api/webhooks/stripe`
4. Eventos para escutar:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Copie o **Signing Secret** (começa com `whsec_`)
6. Vá na Vercel → **Settings → Environment Variables**
7. Adicione/atualize `STRIPE_WEBHOOK_SECRET` com o valor copiado
8. Clique em **Redeploy** para aplicar

---

## PASSO 6 — Testar tudo

### Teste 1 — Cadastro e login
- Acesse `https://SEU_DOMINIO.vercel.app/cadastro`
- Crie uma conta de **aluno**
- Crie uma conta de **responsável**
- Verifique se o redirecionamento está correto

### Teste 2 — Sessão de estudo
- Login como aluno
- Inicie uma sessão de estudo
- Verifique se o responsável recebe a notificação no WhatsApp

### Teste 3 — Pagamento
- Login como responsável
- Acesse a tela de assinatura
- Use o cartão de teste do Stripe: `4242 4242 4242 4242`
- Validade: qualquer data futura | CVV: qualquer 3 dígitos
- Verifique se o plano foi ativado

### Teste 4 — Resumo diário
- Faça uma sessão completa com mini-prova
- Chame manualmente a API para testar:
```
POST https://SEU_DOMINIO.vercel.app/api/whatsapp/resumo-diario
Authorization: Bearer SUA_CRON_SECRET
```

---

## PASSO 7 — Domínio personalizado (opcional)

1. Compre um domínio (sugestão: **focoenem.com.br** no Registro.br)
2. Na Vercel → **Settings → Domains** → Add domain
3. Aponte os DNS do domínio para a Vercel conforme instruções
4. Atualize `NEXT_PUBLIC_APP_URL` e a URL no Supabase Auth

---

## ✅ Checklist final antes de lançar

- [ ] Banco criado e populado com questões
- [ ] Auth configurado com URL de produção
- [ ] Z-API conectada e testada
- [ ] Stripe configurado com webhook ativo
- [ ] Todas as variáveis de ambiente na Vercel
- [ ] Cron job do resumo diário funcionando
- [ ] Testado cadastro, sessão, mini-prova e pagamento
- [ ] Domínio personalizado configurado (opcional)
- [ ] Chaves Stripe trocadas para LIVE

---

## 🆘 Problemas comuns

**Erro de CORS no Supabase**
→ Vá em Supabase → Settings → API → Allowed Origins e adicione seu domínio

**WhatsApp não envia mensagem**
→ Verifique se a instância Z-API está conectada (ícone verde no painel)

**Webhook Stripe não funciona**
→ Verifique se o `STRIPE_WEBHOOK_SECRET` está correto na Vercel

**Build falha na Vercel**
→ Verifique se todas as variáveis de ambiente foram adicionadas
