import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { User, CarsResponse } from "./types";

const API_URL = process.env.API_URL || "http://localhost:3000";

const server = new McpServer({
  name: "users-mcp",
  version: "1.0.0",
});

server.tool(
  "getUserById",
  "Busca um usuário pelo ID",
  {
    id: z.number(),
  },
  async ({ id }: { id: number }): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) {
      throw new Error(`Falha ao buscar usuário: ${res.status} ${res.statusText}`);
    }
    const user = (await res.json()) as User;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "searchCars",
  "Pesquisa carros por marca, modelo, ano ou preço máximo",
  {
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    maxPrice: z.number().optional(),
  },
  async ({ 
    brand, 
    model, 
    year, 
    maxPrice 
  }: { 
    brand?: string; 
    model?: string; 
    year?: number; 
    maxPrice?: number; 
  }): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (brand) queryParams.append("brand", brand);
    if (model) queryParams.append("model", model);
    if (year !== undefined) queryParams.append("year", year.toString());
    if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/cars${queryString ? `?${queryString}` : ""}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text().catch(() => "Erro desconhecido");
        throw new Error(`Falha ao buscar carros: ${res.status} ${res.statusText}. ${errorText}`);
      }
      const data = (await res.json()) as CarsResponse;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a connection error
        if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
          throw new Error("Servidor API não está rodando. Por favor, inicie com: npm run dev:api");
        }
        throw error;
      }
      throw new Error("Erro desconhecido ao buscar carros");
    }
  }
);


const transport = new StdioServerTransport();
server.connect(transport).catch((err: unknown) => {
  console.error("Erro de conexão do servidor:", err);
  process.exit(1);
});