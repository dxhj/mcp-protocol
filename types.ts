// types.ts - Shared types for the project

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
}

export interface CarsResponse {
  content: Car[];
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// MCP Tool Result types
export interface McpToolResultContent {
  type: "text";
  text: string;
}

export interface McpToolResult {
  content: McpToolResultContent[];
  isError?: boolean;
}

// Type guard for MCP tool result
export function isMcpToolResult(result: unknown): result is McpToolResult {
  return (
    typeof result === "object" &&
    result !== null &&
    "content" in result &&
    Array.isArray(result.content) &&
    result.content.length > 0 &&
    typeof result.content[0] === "object" &&
    result.content[0] !== null &&
    "text" in result.content[0] &&
    typeof (result.content[0] as { text: unknown }).text === "string"
  );
}

// Type guard for error response
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as { error: unknown }).error === "string"
  );
}

