# FocoENEM 🎯
**Estudo Real. Resultado Real.**

Plataforma inteligente de acompanhamento de estudos para o ENEM com monitoramento em tempo real e resumo diário no WhatsApp para os pais.

---

## 🚀 Como rodar o projeto localmente

### 1. Pré-requisitos
- [Node.js 18+](https://nodejs.org) instalado
- Conta no [Supabase](https://supabase.com) (grátis)
- Conta na [Z-API](https://z-api.io) (WhatsApp)
- Conta no [Stripe](https://stripe.com) (pagamentos)

---

### 2. Clonar e instalar dependências

```bash
# Entrar na pasta do projeto
cd focoenem

# Instalar dependências
npm install
```

---

### 3. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings → API** e copie:
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ nunca expor no frontend)
3. Vá em **SQL Editor** e cole o conteúdo de `supabase/migrations/001_schema_inicial.sql`
4. Clique em **Run** para criar todas as tabelas

---

### 4. Configurar Z-API (WhatsApp)

1. Acesse [z-api.io](https://z-api.io) e crie uma conta
2. Crie uma instância e escaneie o QR Code com seu WhatsApp
3. Copie o **Instance ID**, **Token** e **Client Token**

---

### 5. Configurar Stripe (Pagamentos)

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Vá em **Products** e crie um produto:
   - Nome: "FocoENEM"
   - Preço: R$ 49,90 / mês (recorrente)
3. Copie o **Price ID** do produto criado
4. Em **Developers → API Keys**, copie as chaves de teste
5. Para o webhook local, instale o [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

---

### 6. Preencher o .env.local

Abra o arquivo `.env.local` e preencha com suas chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_APP_URL=http://localhost:3000

ZAPI_INSTANCE_ID=seu_instance_id
ZAPI_TOKEN=seu_token
ZAPI_CLIENT_TOKEN=seu_client_token

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

---

### 7. Rodar o projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📁 Estrutura do projeto

```
focoenem/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login e Cadastro
│   │   ├── (aluno)/          # Área do aluno
│   │   │   ├── painel/
│   │   │   ├── sessao/
│   │   │   ├── questoes/
│   │   │   ├── progresso/
│   │   │   ├── historico/
│   │   │   └── perfil/
│   │   ├── (responsavel)/    # Área do responsável
│   │   │   ├── painel/
│   │   │   ├── relatorio/
│   │   │   └── configuracoes/
│   │   └── api/
│   │       ├── sessoes/       # Finalizar sessão, validar prova
│   │       ├── questoes/      # Buscar questões
│   │       ├── whatsapp/      # Enviar resumos
│   │       └── webhooks/      # Stripe
│   ├── components/
│   │   ├── aluno/             # Sidebar, componentes do aluno
│   │   ├── responsavel/       # Sidebar, componentes do responsável
│   │   └── shared/            # Componentes compartilhados
│   ├── hooks/
│   │   ├── useAuth.ts         # Autenticação
│   │   └── useSessao.ts       # Cronômetro + monitoramento
│   ├── lib/
│   │   ├── supabase/          # Clientes browser e server
│   │   └── whatsapp.ts        # Integração Z-API
│   ├── types/
│   │   └── index.ts           # Todos os tipos TypeScript
│   └── middleware.ts          # Proteção de rotas por role
├── supabase/
│   └── migrations/
│       └── 001_schema_inicial.sql
├── .env.local                 # ⚠️ Nunca commitar este arquivo
├── .env.example               # Template para outros devs
└── package.json
```

---

## 🌐 Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Adicione todas as variáveis do `.env.local` em **Settings → Environment Variables**
4. Clique em **Deploy**

Para o resumo diário automático, configure um **Vercel Cron Job** em `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/whatsapp/resumo-diario",
    "schedule": "0 * * * *"
  }]
}
```
*(roda a cada hora — a rota filtra os responsáveis pelo horário configurado)*

---

## 🔐 Segurança

- Row Level Security (RLS) ativo em todas as tabelas
- Cada usuário só acessa os próprios dados
- Responsável só acessa dados do seu aluno vinculado
- `service_role` key usada apenas em rotas server-side
- Webhook Stripe validado com assinatura criptográfica

---

## 💳 Fluxo de Pagamento

1. Responsável acessa `/responsavel/assinar`
2. Redireciona para Checkout do Stripe
3. Após pagamento, Stripe envia webhook para `/api/webhooks/stripe`
4. Sistema ativa `plano_ativo = true` no banco
5. Aluno e responsável têm acesso completo

---

## 📲 Integração WhatsApp

- **Início de sessão**: mensagem enviada assim que o aluno inicia
- **Resumo diário**: enviado no horário configurado pelo responsável
- Formato rico com emojis, dados completos e diagnóstico de dificuldades

---

Desenvolvido com ❤️ para garantir que seu filho realmente estude.
