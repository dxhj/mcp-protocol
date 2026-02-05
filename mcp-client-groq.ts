// client-groq.ts - Example using Groq (free tier, fast)
import "dotenv/config";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import { isMcpToolResult } from "./types";

const client = new Client({
  name: "users-mcp-client",
  version: "1.0.0",
});
const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/mcp-server.js"],
});

client.connect(transport).then(async () => {
  console.log("Cliente conectado com sucesso");
  const mcpTools = await client.listTools();
  console.log("Ferramentas MCP:", JSON.stringify(mcpTools, null, 2));
  
  // Convert MCP tools to OpenAI format
  const openaiTools = mcpTools.tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description || "",
      parameters: tool.inputSchema,
    },
  }));
  
  const apiKey: string | undefined = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Variável de ambiente GROQ_API_KEY é obrigatória");
    process.exit(1);
  }
  
  const openai = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: apiKey,
  });
  
  const userMessage = "Encontre carros da marca Toyota com preço máximo de 150000 e também busque o usuário com id 2";
  
  const completion = await openai.chat.completions.create({
    model: "Llama-3.3-70b-Versatile",
    messages: [{ role: "user", content: userMessage }],
    tools: openaiTools,
    temperature: 0.7,
  });

  console.log("Mensagem do usuário:", userMessage);
  console.log("Chamadas de ferramentas:", JSON.stringify(completion.choices[0].message.tool_calls, null, 2));
  
  const message = completion.choices[0].message;
  const toolCalls = message.tool_calls || [];
  
  // Handle multiple tool calls if needed
  if (toolCalls.length > 0) {
    for (const toolCall of toolCalls) {
      if (toolCall.type === "function") {
        console.log(`\nExecutando ferramenta: ${toolCall.function.name}`);
        console.log(`Argumentos: ${toolCall.function.arguments}`);
        
        const toolArguments = JSON.parse(toolCall.function.arguments || "{}") as Record<string, unknown>;
        const result = await client.callTool({
          name: toolCall.function.name,
          arguments: toolArguments,
        });
        
        console.log(`\nResultado da ferramenta ${toolCall.function.name}:`);
        
        if (isMcpToolResult(result)) {
          try {
            const parsedContent = JSON.parse(result.content[0].text);
            console.log(parsedContent);
          } catch (parseError) {
            // If parsing fails, just show the text as-is
            console.error(result.content[0].text);
          }
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
      }
    }
  } else {
    console.log("Resposta do modelo:", message.content);
  }
  process.exit(0);
}).catch((err: unknown) => {
  console.error("Falha ao conectar ou listar ferramentas:", err);
  process.exit(1);
});

