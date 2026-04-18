
# 💰 InvestiMax

**InvestiMax** é uma aplicação web de gestão financeira pessoal que permite registrar transações, acompanhar investimentos e obter insights inteligentes sobre seus gastos com o auxílio de IA generativa.

-----

## ✨ Funcionalidades

- **Dashboard financeiro** — visão geral de receitas, despesas e saldo com filtro por mês e ano
- **Controle de transações** — registro de entradas e saídas por categoria, método de pagamento e recorrência
- **Gestão de investimentos** — cadastro de investimentos com taxa de rendimento e prazo de vencimento
- **Análise de gastos com IA** — insights personalizados gerados via Google Gemini (Genkit) com base no perfil financeiro do usuário
- **Gráficos e relatórios** — gráfico de barras mensal e pizza por categoria (Recharts)
- **Autenticação segura** — cadastro/login com senha criptografada (bcrypt) e sessão via JWT
- **Tema claro/escuro** — alternância de tema com `next-themes`
- **Design responsivo** — interface mobile-first com sidebar recolhível

-----

## 🛠️ Stack Tecnológica

|Camada        |Tecnologia                                                         |
|--------------|-------------------------------------------------------------------|
|Framework     |[Next.js 15](https://nextjs.org/) (App Router + Turbopack)         |
|Linguagem     |TypeScript                                                         |
|Estilização   |Tailwind CSS + shadcn/ui                                           |
|Banco de dados|PostgreSQL (via `pg`)                                              |
|Autenticação  |JWT (`jose`) + bcrypt                                              |
|IA            |Google Gemini via [Genkit](https://firebase.google.com/docs/genkit)|
|Gráficos      |Recharts                                                           |
|Formulários   |React Hook Form + Zod                                              |
|Runtime       |Node.js 20.x                                                       |

-----

## 📁 Estrutura do Projeto

```
src/
├── ai/
│   └── flows/          # Fluxos de IA com Genkit
├── app/
│   ├── api/            # Rotas de API (auth, investments, transactions)
│   ├── investimentos/  # Página de investimentos
│   ├── transacoes/     # Página de transações
│   └── page.tsx        # Dashboard principal
├── components/
│   ├── ai/             # Componente de análise de gastos
│   ├── dashboard/      # Cards, gráficos e resumo
│   ├── investments/    # Formulários de investimento
│   ├── layout/         # Sidebar e header
│   ├── profile/        # Configurações de perfil
│   ├── transactions/   # Lista e formulário de transações
│   └── ui/             # Componentes shadcn/ui
├── hooks/              # Hooks customizados (auth, transactions, investments)
└── lib/                # Utilitários, tipos, db e auth
```

-----

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20.x
- PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/investimax.git
cd investimax
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
POSTGRES_URL=postgresql://usuario:senha@localhost:5432/investimax
JWT_SECRET=sua-chave-secreta-com-no-minimo-32-caracteres
GOOGLE_GENAI_API_KEY=sua-chave-api-google
```

### 4. Configure o banco de dados

Execute os scripts SQL necessários para criar as tabelas de `users`, `transactions` e `investments` no seu banco PostgreSQL.

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em <http://localhost:9002>.

-----

## 🤖 IA com Genkit

Para rodar o servidor de IA em paralelo (desenvolvimento):

```bash
npm run genkit:dev
```

O fluxo `spendingInsightsFlow` analisa os dados financeiros do usuário e retorna insights e recomendações personalizadas usando o modelo Google Gemini.

-----

## 📦 Scripts Disponíveis

|Comando             |Descrição                                         |
|--------------------|--------------------------------------------------|
|`npm run dev`       |Inicia o servidor de desenvolvimento com Turbopack|
|`npm run build`     |Gera o build de produção                          |
|`npm run start`     |Inicia o servidor em modo produção                |
|`npm run lint`      |Executa o ESLint                                  |
|`npm run typecheck` |Verifica os tipos TypeScript                      |
|`npm run genkit:dev`|Inicia o servidor Genkit (IA)                     |

-----

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo <LICENSE> para mais detalhes.
