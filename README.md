# WordPress Gutenberg MCP Server

A Model Context Protocol (MCP) server that acts as a coding standards and framework guide for LLMs (like Claude Desktop or Cursor). It provides WordPress development knowledge, code generation tools, and best practices focused on Gutenberg blocks, GeneratePress theme, GenerateBlocks plugin, and WPCodebox code snippet formatting.

## Overview

This MCP server does **NOT** directly access WordPress websites. Instead, it provides:

- **Code Generation Tools**: Generate WordPress code following best practices
- **Coding Standards**: WordPress coding standards validation and formatting
- **Framework Guides**: Knowledge base for Gutenberg, GeneratePress, GenerateBlocks, and WPCodebox
- **Best Practices**: Security, performance, and compatibility guidelines

## Features

### Code Generation
- Gutenberg block code (block.json, PHP registration, React components)
- GenerateBlocks-compatible block code
- WordPress functions, hooks, shortcodes, and REST API endpoints
- WPCodebox-formatted code snippets

### Coding Standards
- PHP coding standards validation
- JavaScript coding standards validation
- CSS coding standards validation
- Security best practices (sanitization, escaping, nonces)
- Performance optimization guidelines

### Knowledge Base
- WordPress coding standards reference
- Gutenberg block development patterns
- GenerateBlocks development guide
- WPCodebox snippet format specifications
- GeneratePress theme best practices

## Quick Start: Connecting the MCP Server

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn
- Claude Desktop or Cursor installed

Follow these simple steps to connect this MCP server to Claude Desktop or Cursor.

### Step 1: Install and Build

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/wordpress-gutenberg-mcp-server.git
   cd wordpress-gutenberg-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Note the full path** to the `dist/index.js` file. You'll need this in the next step.
   
   Example paths:
   - macOS/Linux: `/Users/yourname/wordpress-gutenberg-mcp-server/dist/index.js`
   - Windows: `C:\Users\yourname\wordpress-gutenberg-mcp-server\dist\index.js`

### Step 2: Configure Claude Desktop

1. **Locate your Claude Desktop config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Open the config file** in a text editor. If it doesn't exist, create it.

3. **Add the MCP server configuration:**
   
   If the file is empty or doesn't have `mcpServers`, use this:
   ```json
   {
     "mcpServers": {
       "wordpress-gutenberg": {
         "command": "node",
         "args": ["/full/path/to/wordpress-gutenberg-mcp-server/dist/index.js"]
       }
     }
   }
   ```
   
   If the file already has `mcpServers`, add to the existing object:
   ```json
   {
     "mcpServers": {
       "existing-server": { ... },
       "wordpress-gutenberg": {
         "command": "node",
         "args": ["/full/path/to/wordpress-gutenberg-mcp-server/dist/index.js"]
       }
     }
   }
   ```

4. **Replace `/full/path/to/wordpress-gutenberg-mcp-server/dist/index.js`** with your actual path from Step 1.

5. **Save the file** and restart Claude Desktop.

### Step 3: Configure Cursor

1. **Open Cursor Settings:**
   - Press `Cmd/Ctrl + Shift + P` to open the command palette
   - Type "Preferences: Open User Settings (JSON)"
   - Or go to Settings → Extensions → MCP

2. **Add the MCP server configuration:**
   
   Add this to your Cursor settings JSON:
   ```json
   {
     "mcp.servers": {
       "wordpress-gutenberg": {
         "command": "node",
         "args": ["/full/path/to/wordpress-gutenberg-mcp-server/dist/index.js"]
       }
     }
   }
   ```

3. **Replace `/full/path/to/wordpress-gutenberg-mcp-server/dist/index.js`** with your actual path from Step 1.

4. **Save the settings** and restart Cursor.

### Step 4: Verify Connection

1. **Restart your application** (Claude Desktop or Cursor).

2. **Check for the MCP server:**
   - In Claude Desktop: The server should appear in the MCP servers list
   - In Cursor: Check the MCP status indicator

3. **Test a tool:**
   - Try asking: "Generate a Gutenberg block called 'custom-card'"
   - Or: "Format this PHP code for WPCodebox: [your code]"

### Troubleshooting

**MCP server not appearing?**
- Verify the path to `dist/index.js` is correct and absolute (not relative)
- Make sure you ran `npm run build` successfully
- Check that Node.js is installed: `node --version` (should be 18.0.0 or higher)
- Restart your application completely

**"Command not found" error?**
- Make sure Node.js is in your system PATH
- Try using the full path to Node.js: `"/usr/local/bin/node"` or `"C:\Program Files\nodejs\node.exe"`

**JSON syntax error?**
- Validate your JSON at [jsonlint.com](https://jsonlint.com)
- Make sure all quotes are properly escaped
- Ensure there are no trailing commas

**Still having issues?**
- Open an issue on GitHub with:
  - Your operating system
  - The error message (if any)
  - Your configuration file (with paths redacted)

## Available Tools

### WPCodebox Tools
- `format_wpcodebox_snippet` - Format code snippet for WPCodebox
- `get_wpcodebox_guidelines` - Get WPCodebox usage guidelines
- `validate_wpcodebox_snippet` - Validate snippet structure

### Gutenberg Tools
- `generate_gutenberg_block` - Generate complete Gutenberg block code
- `generate_block_variation` - Generate block variation
- `generate_block_pattern` - Generate block pattern
- `get_gutenberg_standards` - Get Gutenberg development standards

### GenerateBlocks Tools
- `generate_gb_block` - Generate GenerateBlocks-compatible block code
- `generate_gb_styles` - Generate GenerateBlocks-specific CSS
- `generate_gb_template` - Generate GenerateBlocks template code
- `get_generateblocks_guide` - Get GenerateBlocks development guide

### WordPress Utility Tools
- `generate_php_function` - Generate WordPress PHP function
- `generate_hook` - Generate WordPress action or filter hook
- `generate_shortcode` - Generate WordPress shortcode
- `generate_rest_endpoint` - Generate WordPress REST API endpoint
- `format_for_wpcodebox` - Format any code for WPCodebox

## Available Resources

### Knowledge Base Resources
- `resource://wordpress-gutenberg-mcp/coding-standards` - WordPress coding standards
- `resource://wordpress-gutenberg-mcp/gutenberg-patterns` - Gutenberg block patterns
- `resource://wordpress-gutenberg-mcp/generateblocks-guide` - GenerateBlocks guide
- `resource://wordpress-gutenberg-mcp/wpcodebox-format` - WPCodebox format
- `resource://wordpress-gutenberg-mcp/generatepress-guide` - GeneratePress guide

## Examples

### Generate a Gutenberg Block

```javascript
// Use the generate_gutenberg_block tool
{
  "name": "custom-card",
  "title": "Custom Card",
  "description": "A custom card block",
  "category": "design"
}
```

### Format Code for WPCodebox

```javascript
// Use the format_wpcodebox_snippet tool
{
  "title": "Custom Function",
  "code": "function my_function() { ... }",
  "language": "php",
  "description": "A custom WordPress function",
  "tags": ["function", "custom"]
}
```

### Generate a WordPress Hook

```javascript
// Use the generate_hook tool
{
  "type": "filter",
  "hook": "the_content",
  "callback": "modify_content",
  "description": "Modify post content"
}
```

## Development

### Project Structure

```
wordpress-gutenberg-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── standards.ts           # Coding standards
│   └── tools/
│       ├── wpcodebox.ts      # WPCodebox tools
│       ├── gutenberg-blocks.ts # Gutenberg tools
│       ├── generateblocks.ts  # GenerateBlocks tools
│       └── wordpress-utils.ts # WordPress utilities
├── resources/
│   ├── coding-standards.md    # Coding standards guide
│   ├── gutenberg-patterns.md # Gutenberg patterns
│   ├── generateblocks-guide.md # GenerateBlocks guide
│   ├── wpcodebox-format.md    # WPCodebox format
│   └── generatepress-guide.md # GeneratePress guide
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

## WordPress Best Practices

This MCP server follows and enforces WordPress best practices:

### Security
- Sanitize all user input
- Escape all output
- Use nonces for forms
- Check user capabilities
- Validate and sanitize data

### Performance
- Minimize database queries
- Use transients for expensive operations
- Optimize CSS/JS delivery
- Use lazy loading when appropriate

### Compatibility
- GeneratePress theme compatibility
- GenerateBlocks plugin compatibility
- WordPress coding standards compliance
- Backward compatibility considerations

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow WordPress coding standards
5. Test your changes
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- WordPress community for coding standards
- GeneratePress team for the excellent theme
- GenerateBlocks team for the powerful block collection
- WPCodebox for code snippet management

## Changelog

### 1.0.0
- Initial release
- WPCodebox formatting tools
- Gutenberg block generation
- GenerateBlocks integration
- WordPress utility tools
- Coding standards validation
- Knowledge base resources

