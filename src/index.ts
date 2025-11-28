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
 * WordPress Gutenberg MCP Server
 * 
 * A Model Context Protocol server that provides WordPress development
 * knowledge, code generation tools, and best practices focused on:
 * - Gutenberg blocks
 * - GeneratePress theme
 * - GenerateBlocks plugin
 * - WPCodebox code snippet formatting
 */
class WordPressGutenbergMCPServer {
  private server: Server;

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

    this.setupHandlers();
    this.registerTools();
    this.registerResources();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.server.listTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const tool = this.server.getTool(name);
        if (!tool) {
          throw new Error(`Tool not found: ${name}`);
        }

        if (tool.handler) {
          const result = await tool.handler(args || {});
          return {
            content: [
              {
                type: 'text',
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        throw new Error(`Tool ${name} has no handler`);
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
        resources: this.server.listResources(),
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        const resource = this.server.getResource(uri);
        if (!resource) {
          throw new Error(`Resource not found: ${uri}`);
        }

        if (resource.handler) {
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
        }

        throw new Error(`Resource ${uri} has no handler`);
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
    registerWpCodeboxTools(this.server);
    registerGutenbergTools(this.server);
    registerGenerateBlocksTools(this.server);
    registerWordPressUtils(this.server);
  }

  private registerResources(): void {
    // Register knowledge base resources
    this.server.setResource({
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

    this.server.setResource({
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

    this.server.setResource({
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

    this.server.setResource({
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

    this.server.setResource({
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

