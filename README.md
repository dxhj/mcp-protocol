# MCP Protocol Project

Este projeto demonstra o Model Context Protocol (MCP) com um servidor Express API, servidor MCP e cliente MCP usando Groq (LLM gratuito e rápido).

## Estrutura do Projeto

- **`api.ts`** - Servidor Express API que fornece dados de usuários e carros na porta 3000
- **`mcp-server.ts`** - Servidor MCP que expõe ferramentas para buscar usuários e carros da API
- **`mcp-client-groq.ts`** - Cliente MCP que se conecta ao servidor usando Groq para processar requisições
- **`types.ts`** - Tipos TypeScript compartilhados e type guards

## Pré-requisitos

- Node.js (v18+)
- npm
- Conta no Groq (gratuita) - https://console.groq.com

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione sua chave da API Groq:
   ```
   GROQ_API_KEY=sua-chave-aqui
   ```

## Compilação

Compile TypeScript para JavaScript:

```bash
npm run build
```

## Executando o Projeto

O projeto possui três componentes que precisam ser executados em uma ordem específica:

### Opção 1: Modo Desenvolvimento (TypeScript)

**Terminal 1 - Inicie o servidor API:**
```bash
npm run dev:api
```
A API será executada em `http://localhost:3000`

**Terminal 2 - Execute o cliente MCP:**
```bash
npm run dev:client-groq
```
O cliente irá automaticamente iniciar o servidor MCP via stdio, conectar ao Groq e executar as ferramentas disponíveis.

### Opção 2: Modo Produção (JavaScript Compilado)

Primeiro, compile o projeto:
```bash
npm run build
```

**Terminal 1 - Inicie o servidor API:**
```bash
npm run start:api
```

**Terminal 2 - Execute o cliente MCP:**
```bash
npm run start:client-groq
```

## Como Funciona

1. **Servidor API** (`api.ts`): 
   - Fornece endpoints REST:
     - `GET /users/:id` - Retorna dados de um usuário específico
     - `GET /cars` - Retorna lista de carros (com filtros opcionais: brand, model, year, maxPrice)

2. **Servidor MCP** (`mcp-server.ts`): 
   - Registra ferramentas:
     - `getUserById` - Busca usuário por ID na API
     - `searchCars` - Pesquisa carros por marca, modelo, ano ou preço máximo
   - Comunica via transporte stdio

3. **Cliente MCP** (`mcp-client-groq.ts`):
   - Inicia o servidor MCP como um subprocesso
   - Conecta via stdio
   - Usa Groq (LLM) para processar requisições em linguagem natural
   - Converte as ferramentas MCP para o formato OpenAI
   - Executa as ferramentas conforme solicitado pelo LLM
   - Exibe os resultados

## Ferramentas Disponíveis

### `getUserById`
Busca um usuário específico pelo ID.

**Parâmetros:**
- `id` (number, obrigatório) - ID do usuário

**Exemplo de uso:**
```
"Busque o usuário com id 2"
```

### `searchCars`
Pesquisa carros com filtros opcionais.

**Parâmetros:**
- `brand` (string, opcional) - Marca do carro
- `model` (string, opcional) - Modelo do carro
- `year` (number, opcional) - Ano do carro
- `maxPrice` (number, opcional) - Preço máximo

**Exemplo de uso:**
```
"Encontre carros da marca Toyota com preço máximo de 150000"
```

## Scripts Disponíveis

- `npm run build` - Compila TypeScript para JavaScript
- `npm run dev:api` - Executa o servidor API em modo desenvolvimento (TypeScript)
- `npm run dev:server` - Executa o servidor MCP em modo desenvolvimento (standalone)
- `npm run dev:client-groq` - Executa o cliente MCP em modo desenvolvimento
- `npm run start:api` - Executa o servidor API (JavaScript compilado)
- `npm run start:server` - Executa o servidor MCP (JavaScript compilado, standalone)
- `npm run start:client-groq` - Executa o cliente MCP (JavaScript compilado)

## Tecnologias Utilizadas

- **TypeScript** - Tipagem estática e melhor DX
- **Express** - Framework web para a API
- **@modelcontextprotocol/sdk** - SDK oficial do MCP
- **Groq** - LLM gratuito e rápido (alternativa ao OpenAI)
- **Zod** - Validação de esquemas
- **dotenv** - Gerenciamento de variáveis de ambiente

## Tipagem TypeScript

O projeto utiliza tipagem forte com:
- Interfaces compartilhadas em `types.ts`
- Type guards para validação segura
- Tipos explícitos em todas as funções
- Validação de runtime com Zod

## Notas

- O servidor MCP requer que a API esteja rodando na porta 3000
- O cliente MCP inicia automaticamente o servidor, então você não precisa executar o servidor separadamente
- O servidor se comunica via stdio, então é projetado para ser iniciado pelo cliente
- A chave da API Groq é carregada automaticamente do arquivo `.env` usando dotenv
- O arquivo `.env` não é versionado (está no `.gitignore`)

## Estrutura de Arquivos

```
mcp-protocol/
├── api.ts                 # Servidor Express API
├── mcp-server.ts          # Servidor MCP
├── mcp-client-groq.ts     # Cliente MCP com Groq
├── types.ts               # Tipos TypeScript compartilhados
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── .env.example           # Exemplo de variáveis de ambiente
├── .env                   # Variáveis de ambiente (não versionado)
└── dist/                  # Arquivos compilados (gerado)
```
