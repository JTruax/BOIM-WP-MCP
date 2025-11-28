import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * GenerateBlocks Integration Tools
 * 
 * Provides tools for generating GenerateBlocks-compatible code
 */

export interface GenerateBlockConfig {
  type: 'container' | 'grid' | 'headline' | 'button' | 'image' | 'query-loop';
  attributes?: Record<string, any>;
  innerBlocks?: any[];
}

/**
 * Generate GenerateBlocks block code
 */
function generateGbBlock(config: GenerateBlockConfig): string {
  const { type, attributes = {}, innerBlocks = [] } = config;

  // GenerateBlocks block structure
  const blockCode = `<!-- wp:generateblocks/gb-${type} ${JSON.stringify(attributes)} -->
<div class="gb-block-container gb-block-${type}">
${innerBlocks.length > 0 ? innerBlocks.map(block => `\t${block}`).join('\n') : '\t<!-- Inner blocks here -->'}
</div>
<!-- /wp:generateblocks/gb-${type} -->`;

  // PHP registration if needed
  const phpCode = `<?php
/**
 * GenerateBlocks ${type} Block Configuration
 *
 * This code demonstrates how to work with GenerateBlocks ${type} blocks
 */

// Example: Filter GenerateBlocks ${type} block attributes
function custom_gb_${type}_attributes( \$attributes, \$block ) {
	// Modify attributes as needed
	return \$attributes;
}
add_filter( 'generateblocks_attr_${type}', 'custom_gb_${type}_attributes', 10, 2 );

// Example: Add custom CSS for GenerateBlocks ${type} block
function custom_gb_${type}_css( \$css, \$attributes, \$block ) {
	if ( 'generateblocks/gb-${type}' === \$block['blockName'] ) {
		// Add custom CSS
		\$css .= '.gb-block-${type} { /* Custom styles */ }';
	}
	return \$css;
}
add_filter( 'generateblocks_css', 'custom_gb_${type}_css', 10, 3 );
`;

  return `# GenerateBlocks ${type.charAt(0).toUpperCase() + type.slice(1)} Block

## Block Markup

\`\`\`html
${blockCode}
\`\`\`

## PHP Integration

\`\`\`php
${phpCode}
\`\`\`

## Common Attributes

### Container Block
- \`containerWidth\` - Container width
- \`paddingTop\` - Top padding
- \`paddingRight\` - Right padding
- \`paddingBottom\` - Bottom padding
- \`paddingLeft\` - Left padding
- \`marginTop\` - Top margin
- \`marginBottom\` - Bottom margin
- \`backgroundColor\` - Background color
- \`textColor\` - Text color

### Grid Block
- \`columns\` - Number of columns
- \`columnGap\` - Gap between columns
- \`rowGap\` - Gap between rows
- \`verticalAlignment\` - Vertical alignment
- \`horizontalAlignment\` - Horizontal alignment

### Headline Block
- \`element\` - HTML element (h1, h2, h3, etc.)
- \`fontSize\` - Font size
- \`fontWeight\` - Font weight
- \`textAlign\` - Text alignment
- \`textColor\` - Text color

### Button Block
- \`url\` - Button URL
- \`target\` - Link target
- \`rel\` - Link rel attribute
- \`backgroundColor\` - Background color
- \`textColor\` - Text color
- \`borderRadius\` - Border radius
- \`paddingTop\` - Top padding
- \`paddingBottom\` - Bottom padding
- \`paddingLeft\` - Left padding
- \`paddingRight\` - Right padding

## Usage Notes

- GenerateBlocks blocks are lightweight and performance-optimized
- Use GenerateBlocks hooks for customization
- Test with GeneratePress theme for best compatibility
- Follow GenerateBlocks naming conventions
`;
}

/**
 * Generate GenerateBlocks-specific CSS
 */
function generateGbStyles(config: {
  blockType: string;
  selector: string;
  styles: Record<string, string>;
}): string {
  const { blockType, selector, styles } = config;

  const cssCode = `/**
 * GenerateBlocks ${blockType} Custom Styles
 *
 * Target: ${selector}
 */

${selector} {
${Object.entries(styles)
  .map(([property, value]) => `\t${property}: ${value};`)
  .join('\n')}
}

/* Responsive styles */
@media (max-width: 768px) {
\t${selector} {
\t\t/* Mobile-specific styles */
\t}
}
`;

  const phpCode = `<?php
/**
 * Add GenerateBlocks ${blockType} Custom CSS
 */
function add_gb_${blockType}_custom_css() {
	\$css = '
${cssCode.split('\n').map(line => `\t\t${line}`).join('\n')}
	';
	
	wp_add_inline_style( 'generateblocks-style', \$css );
}
add_action( 'wp_enqueue_scripts', 'add_gb_${blockType}_custom_css', 100 );
`;

  return `# GenerateBlocks ${blockType} Custom Styles

## CSS

\`\`\`css
${cssCode}
\`\`\`

## PHP Integration

\`\`\`php
${phpCode}
\`\`\`

## Best Practices

- Use GenerateBlocks CSS variables when available
- Target specific block classes for specificity
- Use responsive breakpoints (768px, 1024px)
- Test with GeneratePress theme
- Avoid !important unless necessary
- Use GenerateBlocks spacing system
`;
}

/**
 * Generate GenerateBlocks template code
 */
function generateGbTemplate(config: {
  name: string;
  description?: string;
  blocks: Array<{ type: string; attributes?: Record<string, any> }>;
}): string {
  const { name, description = '', blocks } = config;

  const templateBlocks = blocks.map(block => {
    const attrs = block.attributes ? ` ${JSON.stringify(block.attributes)}` : '';
    return `<!-- wp:generateblocks/gb-${block.type}${attrs} -->
<div class="gb-block-container gb-block-${block.type}">
\t<!-- Block content -->
</div>
<!-- /wp:generateblocks/gb-${block.type} -->`;
  }).join('\n\n');

  const phpCode = `<?php
/**
 * Template: ${name}
 *
 * ${description}
 */
function register_${name.toLowerCase().replace(/\s+/g, '_')}_template() {
	\$template = array(
		array( 'generateblocks/gb-container', array(
			'containerWidth' => '1200px',
			'paddingTop' => '60px',
			'paddingBottom' => '60px',
		), array(
${blocks.map(block => {
  const attrs = block.attributes ? JSON.stringify(block.attributes, null, '\t\t\t\t') : 'array()';
  return `\t\t\t\tarray( 'generateblocks/gb-${block.type}', ${attrs}, array() ),`;
}).join('\n')}
		) ),
	);
	
	return \$template;
}
`;

  return `# GenerateBlocks Template: ${name}

## Template Structure

\`\`\`html
${templateBlocks}
\`\`\`

## PHP Registration

\`\`\`php
${phpCode}
\`\`\`

## Usage

This template can be used with:
- Block patterns
- Template parts
- Full site editing
- GenerateBlocks Query Loop

## Notes

- Ensure GenerateBlocks plugin is active
- Test with GeneratePress theme
- Use GenerateBlocks spacing system
- Follow GenerateBlocks best practices
`;
}

/**
 * Get GenerateBlocks development guide
 */
function getGenerateBlocksGuide(): string {
  return `# GenerateBlocks Development Guide

## Overview
GenerateBlocks is a lightweight, versatile block collection for WordPress Gutenberg. This guide covers best practices for working with GenerateBlocks.

## Core Blocks

### Container Block
- Flexible container with padding, margin, and background controls
- Supports nested containers
- Responsive controls for all devices
- Use for layout structure

### Grid Block
- CSS Grid-based layout system
- Responsive column controls
- Gap controls for spacing
- Use for multi-column layouts

### Headline Block
- Typography controls
- Multiple HTML elements (h1-h6, p, span)
- Responsive font sizes
- Use for headings and text

### Button Block
- Link and styling controls
- Icon support
- Responsive padding
- Use for call-to-action buttons

### Image Block
- Lightweight image block
- Lazy loading support
- Responsive controls
- Use for images

### Query Loop Block
- Display posts dynamically
- Custom post type support
- Template builder
- Use for post listings

## Best Practices

### Performance
- GenerateBlocks is optimized for performance
- Minimal CSS output
- Efficient JavaScript
- Use GenerateBlocks spacing system

### GeneratePress Compatibility
- GenerateBlocks works seamlessly with GeneratePress
- Use GeneratePress hooks when available
- Follow GeneratePress patterns
- Test with GeneratePress theme active

### Customization
- Use GenerateBlocks filters for customization
- Hook into GenerateBlocks CSS generation
- Extend GenerateBlocks functionality via filters
- Follow GenerateBlocks coding standards

### Styling
- Use GenerateBlocks CSS variables
- Target specific block classes
- Use responsive breakpoints
- Avoid overriding core styles

## Hooks and Filters

### CSS Generation
\`generateblocks_css\` - Filter generated CSS
\`generateblocks_attr_{block}\` - Filter block attributes

### Block Rendering
\`generateblocks_do_container_open\` - Container opening
\`generateblocks_do_container_close\` - Container closing

### Query Loop
\`generateblocks_query_loop_args\` - Modify query arguments
\`generateblocks_query_loop_post_data\` - Modify post data

## Spacing System
- Use GenerateBlocks spacing units
- Follow spacing scale (0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100)
- Use responsive spacing controls
- Maintain consistent spacing

## Color System
- Use GenerateBlocks color palette
- Support dark mode when applicable
- Use CSS variables for colors
- Test color contrast

## Responsive Design
- Use device-specific controls
- Test on mobile, tablet, desktop
- Use GenerateBlocks responsive utilities
- Follow mobile-first approach

## Accessibility
- Use semantic HTML
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility

## Testing
- Test with GeneratePress theme
- Test with different content
- Test responsive behavior
- Test with GenerateBlocks Pro features
- Test performance impact
`;
}

/**
 * Register GenerateBlocks tools
 */
export function registerGenerateBlocksTools(server: Server): void {
  // Generate GB block tool
  server.setTool({
    name: 'generate_gb_block',
    description: 'Generate GenerateBlocks-compatible block code',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['container', 'grid', 'headline', 'button', 'image', 'query-loop'],
          description: 'GenerateBlocks block type',
        },
        attributes: {
          type: 'object',
          description: 'Block attributes',
        },
        innerBlocks: {
          type: 'array',
          items: { type: 'string' },
          description: 'Inner block markup',
        },
      },
      required: ['type'],
    },
    handler: async (args) => {
      return generateGbBlock(args as GenerateBlockConfig);
    },
  });

  // Generate GB styles tool
  server.setTool({
    name: 'generate_gb_styles',
    description: 'Generate GenerateBlocks-specific CSS',
    inputSchema: {
      type: 'object',
      properties: {
        blockType: {
          type: 'string',
          description: 'Block type (container, grid, headline, etc.)',
        },
        selector: {
          type: 'string',
          description: 'CSS selector',
        },
        styles: {
          type: 'object',
          description: 'CSS properties and values',
        },
      },
      required: ['blockType', 'selector', 'styles'],
    },
    handler: async (args) => {
      return generateGbStyles(args as any);
    },
  });

  // Generate GB template tool
  server.setTool({
    name: 'generate_gb_template',
    description: 'Generate GenerateBlocks template code',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Template name',
        },
        description: {
          type: 'string',
          description: 'Template description',
        },
        blocks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Block type',
              },
              attributes: {
                type: 'object',
                description: 'Block attributes',
              },
            },
          },
          description: 'Array of blocks in the template',
        },
      },
      required: ['name', 'blocks'],
    },
    handler: async (args) => {
      return generateGbTemplate(args as any);
    },
  });

  // Get GenerateBlocks guide tool
  server.setTool({
    name: 'get_generateblocks_guide',
    description: 'Get GenerateBlocks development guide and best practices',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      return getGenerateBlocksGuide();
    },
  });
}

