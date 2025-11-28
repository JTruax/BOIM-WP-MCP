#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { registerWpCodeboxTools } from './tools/wpcodebox.js';
import { registerGutenbergTools } from './tools/gutenberg-blocks.js';
import { registerGenerateBlocksTools } from './tools/generateblocks.js';
import { registerWordPressUtils } from './tools/wordpress-utils.js';

/**
 * Interface for MCP server tool and resource registration
 */
export interface MCPServer {
  registerTool(tool: { name: string; description: string; inputSchema: any; handler: (args: any) => Promise<any> }): void;
  registerResource(resource: { uri: string; name: string; description?: string; mimeType?: string; handler: () => Promise<string> }): void;
}

/**
 * WordPress Gutenberg MCP Server
 * 
 * A Model Context Protocol server that provides WordPress development
 * knowledge, code generation tools, and best practices focused on:
 * - Gutenberg blocks
 * - GeneratePress theme
 * - GenerateBlocks plugin
 * - WPCodebox code snippet formatting
 */
class WordPressGutenbergMCPServer implements MCPServer {
  private server: Server;
  private tools: Map<string, { name: string; description: string; inputSchema: any; handler: (args: any) => Promise<any> }> = new Map();
  private resources: Map<string, { uri: string; name: string; description?: string; mimeType?: string; handler: () => Promise<string> }> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'wordpress-gutenberg-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.registerTools();
    this.registerResources();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values()).map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if (!tool) {
        return {
          content: [
            {
              type: 'text',
              text: `Tool not found: ${name}`,
            },
          ],
          isError: true,
        };
      }

      try {
        const result = await tool.handler(args || {});
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: Array.from(this.resources.values()).map(resource => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      const resource = this.resources.get(uri);
      if (!resource) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Resource not found: ${uri}`,
            },
          ],
          isError: true,
        };
      }

      try {
        const content = await resource.handler();
        return {
          contents: [
            {
              uri,
              mimeType: resource.mimeType || 'text/markdown',
              text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private registerTools(): void {
    // Register all tool modules
    registerWpCodeboxTools(this);
    registerGutenbergTools(this);
    registerGenerateBlocksTools(this);
    registerWordPressUtils(this);
  }

  // Helper methods for tool and resource registration
  registerTool(tool: { name: string; description: string; inputSchema: any; handler: (args: any) => Promise<any> }): void {
    this.tools.set(tool.name, tool);
  }

  registerResource(resource: { uri: string; name: string; description?: string; mimeType?: string; handler: () => Promise<string> }): void {
    this.resources.set(resource.uri, resource);
  }

  private registerResources(): void {
    // Register knowledge base resources
    this.registerResource({
      uri: 'resource://wordpress-gutenberg-mcp/coding-standards',
      name: 'WordPress Coding Standards',
      description: 'WordPress coding standards reference for PHP, JavaScript, and CSS',
      mimeType: 'text/markdown',
      handler: async () => {
        const { readFileSync } = await import('fs');
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return readFileSync(join(__dirname, '../resources/coding-standards.md'), 'utf-8');
      },
    });

    this.registerResource({
      uri: 'resource://wordpress-gutenberg-mcp/gutenberg-patterns',
      name: 'Gutenberg Block Development Patterns',
      description: 'Common Gutenberg block development patterns and examples',
      mimeType: 'text/markdown',
      handler: async () => {
        const { readFileSync } = await import('fs');
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return readFileSync(join(__dirname, '../resources/gutenberg-patterns.md'), 'utf-8');
      },
    });

    this.registerResource({
      uri: 'resource://wordpress-gutenberg-mcp/generateblocks-guide',
      name: 'GenerateBlocks Development Guide',
      description: 'Best practices for GenerateBlocks plugin development',
      mimeType: 'text/markdown',
      handler: async () => {
        const { readFileSync } = await import('fs');
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return readFileSync(join(__dirname, '../resources/generateblocks-guide.md'), 'utf-8');
      },
    });

    this.registerResource({
      uri: 'resource://wordpress-gutenberg-mcp/wpcodebox-format',
      name: 'WPCodebox Snippet Format',
      description: 'WPCodebox snippet format specifications and structure',
      mimeType: 'text/markdown',
      handler: async () => {
        const { readFileSync } = await import('fs');
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return readFileSync(join(__dirname, '../resources/wpcodebox-format.md'), 'utf-8');
      },
    });

    this.registerResource({
      uri: 'resource://wordpress-gutenberg-mcp/generatepress-guide',
      name: 'GeneratePress Theme Guide',
      description: 'GeneratePress theme-specific development guidelines',
      mimeType: 'text/markdown',
      handler: async () => {
        const { readFileSync } = await import('fs');
        const { fileURLToPath } = await import('url');
        const { dirname, join } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        return readFileSync(join(__dirname, '../resources/generatepress-guide.md'), 'utf-8');
      },
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('WordPress Gutenberg MCP Server running on stdio');
  }
}

// Start the server
const server = new WordPressGutenbergMCPServer();
server.run().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});

