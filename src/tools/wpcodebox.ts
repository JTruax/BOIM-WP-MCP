import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * WPCodebox Tool Registration
 * 
 * Provides tools for formatting code snippets for WPCodebox plugin
 */

export interface WpCodeboxSnippet {
  title: string;
  code: string;
  language: 'php' | 'javascript' | 'css' | 'html';
  description?: string;
  tags?: string[];
  scope?: 'global' | 'admin' | 'frontend';
  priority?: number;
  active?: boolean;
}

/**
 * Format code snippet for WPCodebox
 */
function formatSnippet(snippet: WpCodeboxSnippet): string {
  const {
    title,
    code,
    language,
    description = '',
    tags = [],
    scope = 'global',
    priority = 10,
    active = true,
  } = snippet;

  // WPCodebox format structure
  let formatted = `/**
 * ${title}
 * 
 * ${description || 'WordPress code snippet'}
 * 
 * Language: ${language.toUpperCase()}
 * Scope: ${scope}
 * Priority: ${priority}
 * Active: ${active ? 'Yes' : 'No'}
 * Tags: ${tags.length > 0 ? tags.join(', ') : 'none'}
 */

`;

  // Add language-specific formatting
  if (language === 'php') {
    formatted += code;
    // Ensure proper PHP opening tag
    if (!code.trim().startsWith('<?php')) {
      formatted = '<?php\n' + formatted;
    }
  } else if (language === 'javascript') {
    formatted += code;
  } else if (language === 'css') {
    formatted += code;
  } else if (language === 'html') {
    formatted += code;
  }

  return formatted;
}

/**
 * Get WPCodebox usage guidelines
 */
function getWpCodeboxGuidelines(): string {
  return `# WPCodebox Usage Guidelines

## Overview
WPCodebox is a WordPress plugin for managing code snippets. This guide helps you format code properly for WPCodebox.

## Snippet Structure

### Required Fields
- **Title**: Clear, descriptive name for the snippet
- **Code**: The actual code to execute
- **Language**: php, javascript, css, or html

### Optional Fields
- **Description**: Explanation of what the snippet does
- **Tags**: Array of tags for organization
- **Scope**: Where the code runs (global, admin, frontend)
- **Priority**: Execution priority (default: 10)
- **Active**: Whether snippet is active (default: true)

## Best Practices

### PHP Snippets
- Always start with <?php tag
- Never include closing ?> tag
- Use WordPress functions and hooks
- Follow WordPress coding standards
- Include proper sanitization and escaping

### JavaScript Snippets
- Use vanilla JavaScript or jQuery (if enqueued)
- Localize strings using wp.i18n
- Avoid console.log in production
- Properly enqueue scripts via wp_enqueue_script

### CSS Snippets
- Use specific selectors to avoid conflicts
- Consider GeneratePress/GenerateBlocks compatibility
- Use CSS variables when possible
- Avoid !important unless necessary

## Scope Options

### Global
Code runs on both admin and frontend. Use for:
- General WordPress hooks
- Custom post types
- Taxonomies
- General functionality

### Admin
Code runs only in WordPress admin. Use for:
- Admin menu items
- Admin notices
- Dashboard widgets
- Admin-specific functionality

### Frontend
Code runs only on the frontend. Use for:
- Theme modifications
- Frontend scripts
- Public-facing functionality

## Security Considerations
- Always sanitize user input
- Escape output properly
- Verify nonces for form submissions
- Check user capabilities
- Validate and sanitize data

## Performance
- Keep snippets lightweight
- Avoid unnecessary database queries
- Use transients for expensive operations
- Consider caching for frequently accessed data

## GeneratePress/GenerateBlocks Compatibility
- Test snippets with GeneratePress theme active
- Ensure compatibility with GenerateBlocks
- Use GeneratePress hooks when available
- Follow GeneratePress coding patterns
`;
}

/**
 * Validate snippet format
 */
function validateSnippetFormat(snippet: WpCodeboxSnippet): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!snippet.title || snippet.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!snippet.code || snippet.code.trim().length === 0) {
    errors.push('Code is required');
  }

  if (!snippet.language) {
    errors.push('Language is required');
  } else if (!['php', 'javascript', 'css', 'html'].includes(snippet.language)) {
    errors.push('Language must be one of: php, javascript, css, html');
  }

  // Validate PHP code
  if (snippet.language === 'php') {
    if (!snippet.code.includes('<?php') && !snippet.code.trim().startsWith('<?php')) {
      warnings.push('PHP code should start with <?php tag');
    }
    if (snippet.code.trim().endsWith('?>')) {
      warnings.push('PHP code should not end with closing ?> tag');
    }
  }

  // Validate scope
  if (snippet.scope && !['global', 'admin', 'frontend'].includes(snippet.scope)) {
    errors.push('Scope must be one of: global, admin, frontend');
  }

  // Validate priority
  if (snippet.priority !== undefined && (snippet.priority < 1 || snippet.priority > 999)) {
    warnings.push('Priority should be between 1 and 999');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Register WPCodebox tools
 */
export function registerWpCodeboxTools(server: Server): void {
  // Format snippet tool
  server.setTool({
    name: 'format_wpcodebox_snippet',
    description: 'Format a code snippet for WPCodebox plugin with proper structure and metadata',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Snippet title',
        },
        code: {
          type: 'string',
          description: 'The code to format',
        },
        language: {
          type: 'string',
          enum: ['php', 'javascript', 'css', 'html'],
          description: 'Programming language',
        },
        description: {
          type: 'string',
          description: 'Optional description of what the snippet does',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional array of tags for organization',
        },
        scope: {
          type: 'string',
          enum: ['global', 'admin', 'frontend'],
          description: 'Where the code should run (default: global)',
        },
        priority: {
          type: 'number',
          description: 'Execution priority (default: 10)',
        },
        active: {
          type: 'boolean',
          description: 'Whether snippet should be active (default: true)',
        },
      },
      required: ['title', 'code', 'language'],
    },
    handler: async (args) => {
      const snippet = args as WpCodeboxSnippet;
      const validation = validateSnippetFormat(snippet);
      
      if (!validation.valid) {
        return `Validation errors:\n${validation.errors.join('\n')}`;
      }

      if (validation.warnings.length > 0) {
        console.warn('Warnings:', validation.warnings);
      }

      return formatSnippet(snippet);
    },
  });

  // Get guidelines tool
  server.setTool({
    name: 'get_wpcodebox_guidelines',
    description: 'Get WPCodebox usage guidelines and best practices',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      return getWpCodeboxGuidelines();
    },
  });

  // Validate snippet format tool
  server.setTool({
    name: 'validate_wpcodebox_snippet',
    description: 'Validate a snippet structure against WPCodebox requirements',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Snippet title',
        },
        code: {
          type: 'string',
          description: 'The code to validate',
        },
        language: {
          type: 'string',
          enum: ['php', 'javascript', 'css', 'html'],
          description: 'Programming language',
        },
        scope: {
          type: 'string',
          enum: ['global', 'admin', 'frontend'],
          description: 'Where the code should run',
        },
        priority: {
          type: 'number',
          description: 'Execution priority',
        },
      },
      required: ['title', 'code', 'language'],
    },
    handler: async (args) => {
      const snippet = args as WpCodeboxSnippet;
      const validation = validateSnippetFormat(snippet);
      
      let result = `Validation ${validation.valid ? 'PASSED' : 'FAILED'}\n\n`;
      
      if (validation.errors.length > 0) {
        result += `Errors:\n${validation.errors.map(e => `- ${e}`).join('\n')}\n\n`;
      }
      
      if (validation.warnings.length > 0) {
        result += `Warnings:\n${validation.warnings.map(w => `- ${w}`).join('\n')}\n`;
      }
      
      if (validation.valid && validation.warnings.length === 0) {
        result += 'No issues found. Snippet is ready for WPCodebox.';
      }
      
      return result;
    },
  });
}

