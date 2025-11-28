import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * Gutenberg Block Generation Tools
 * 
 * Provides tools for generating Gutenberg block code following
 * WordPress block development standards.
 */

export interface BlockDefinition {
  name: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  keywords?: string[];
  supports?: {
    align?: boolean | string[];
    alignWide?: boolean;
    anchor?: boolean;
    customClassName?: boolean;
    html?: boolean;
    inserter?: boolean;
    multiple?: boolean;
    reusable?: boolean;
  };
  attributes?: Record<string, any>;
  example?: Record<string, any>;
  edit?: string; // Custom edit component code
  save?: string; // Custom save function code
}

/**
 * Generate complete Gutenberg block code
 */
function generateBlock(block: BlockDefinition): string {
  const {
    name,
    title,
    description = '',
    category = 'common',
    icon = 'block-default',
    keywords = [],
    supports = {},
    attributes = {},
    example = {},
  } = block;

  // Generate block.json
  const blockJson = {
    $schema: 'https://schemas.wp.org/trunk/block.json',
    apiVersion: 3,
    name: `custom/${name}`,
    version: '1.0.0',
    title,
    category,
    icon,
    description,
    keywords,
    textdomain: 'custom-blocks',
    supports,
    attributes,
    example,
    editorScript: 'file:./index.js',
    editorStyle: 'file:./index.css',
    style: 'file:./style-index.css',
  };

  // Generate block registration PHP
  const registrationPHP = `<?php
/**
 * Register ${title} Block
 *
 * ${description || 'Custom Gutenberg block'}
 */
function register_${name.replace(/-/g, '_')}_block() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'render_${name.replace(/-/g, '_')}_block',
	) );
}
add_action( 'init', 'register_${name.replace(/-/g, '_')}_block' );

/**
 * Render ${title} Block
 *
 * @param array $attributes Block attributes.
 * @param string $content Block content.
 * @return string Rendered block HTML.
 */
function render_${name.replace(/-/g, '_')}_block( $attributes, $content ) {
	// Extract attributes
	$classes = isset( $attributes['className'] ) ? esc_attr( $attributes['className'] ) : '';
	
	// Build wrapper attributes
	$wrapper_attributes = get_block_wrapper_attributes( array(
		'class' => $classes,
	) );
	
	// Render block
	ob_start();
	?>
	<div <?php echo $wrapper_attributes; ?>>
		<?php echo wp_kses_post( $content ); ?>
	</div>
	<?php
	return ob_get_clean();
}
`;

  // Generate block editor JavaScript (React)
  const editorJS = `/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Block metadata
 */
import metadata from './block.json';

/**
 * Edit component
 */
function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	
	return (
		<div { ...blockProps }>
			<p>{ __( '${title} - Edit', 'custom-blocks' ) }</p>
		</div>
	);
}

/**
 * Save component
 */
function save() {
	const blockProps = useBlockProps.save();
	
	return (
		<div { ...blockProps }>
			{ /* Block content */ }
		</div>
	);
}

/**
 * Register block
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
`;

  // Generate package.json for block
  const packageJson = {
    name: `@custom/${name}`,
    version: '1.0.0',
    description,
    main: 'build/index.js',
    scripts: {
      build: 'wp-scripts build',
      start: 'wp-scripts start',
      'packages-update': 'wp-scripts packages-update',
    },
    dependencies: {
      '@wordpress/block-editor': '^12.0.0',
      '@wordpress/blocks': '^13.0.0',
      '@wordpress/i18n': '^5.0.0',
    },
    devDependencies: {
      '@wordpress/scripts': '^27.0.0',
    },
  };

  return `# ${title} Block

## Block Registration (PHP)

\`\`\`php
${registrationPHP}
\`\`\`

## block.json

\`\`\`json
${JSON.stringify(blockJson, null, '\t')}
\`\`\`

## Editor Script (src/index.js)

\`\`\`javascript
${editorJS}
\`\`\`

## package.json

\`\`\`json
${JSON.stringify(packageJson, null, '\t')}
\`\`\`

## Installation

1. Create block directory: \`blocks/${name}/\`
2. Place block.json in the block directory
3. Create \`src/\` directory with index.js
4. Run \`npm install\` to install dependencies
5. Run \`npm run build\` to build the block
6. The block will be available in the Gutenberg editor
`;
}

/**
 * Generate block variation
 */
function generateBlockVariation(variation: {
  name: string;
  title: string;
  description?: string;
  attributes?: Record<string, any>;
  innerBlocks?: any[];
  scope?: string[];
}): string {
  const {
    name,
    title,
    description = '',
    attributes = {},
    innerBlocks = [],
    scope = ['block', 'inserter'],
  } = variation;

  const variationCode = `/**
 * Register ${title} Block Variation
 */
function register_${name.replace(/-/g, '_')}_variation() {
	wp.blocks.registerBlockVariation( 'core/group', {
		name: '${name}',
		title: __( '${title}', 'textdomain' ),
		description: __( '${description}', 'textdomain' ),
		attributes: ${JSON.stringify(attributes, null, '\t\t\t')},
		innerBlocks: ${JSON.stringify(innerBlocks, null, '\t\t\t')},
		scope: ${JSON.stringify(scope)},
	} );
}
add_action( 'init', 'register_${name.replace(/-/g, '_')}_variation' );
`;

  return `# ${title} Block Variation

\`\`\`php
${variationCode}
\`\`\`

## Usage

This variation extends the core/group block with predefined attributes and inner blocks.
It will appear in the block inserter as "${title}".
`;
}

/**
 * Generate block pattern
 */
function generateBlockPattern(pattern: {
  title: string;
  description?: string;
  content: string;
  categories?: string[];
  keywords?: string[];
  viewportWidth?: number;
  blockTypes?: string[];
  inserter?: boolean;
}): string {
  const {
    title,
    description = '',
    content,
    categories = ['patterns'],
    keywords = [],
    viewportWidth = 1200,
    blockTypes = [],
    inserter = true,
  } = pattern;

  const patternCode = `<?php
/**
 * Title: ${title}
 * Description: ${description}
 * Categories: ${categories.join(', ')}
 * Keywords: ${keywords.join(', ')}
 * Viewport Width: ${viewportWidth}
 * Block Types: ${blockTypes.length > 0 ? blockTypes.join(', ') : 'all'}
 * Inserter: ${inserter ? 'yes' : 'no'}
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
	${content}
</div>
<!-- /wp:group -->
`;

  return `# ${title} Block Pattern

\`\`\`php
${patternCode}
\`\`\`

## Registration

Register this pattern in your theme's \`functions.php\` or a plugin:

\`\`\`php
function register_${title.toLowerCase().replace(/\s+/g, '_')}_pattern() {
	register_block_pattern(
		'custom/${title.toLowerCase().replace(/\s+/g, '-')}',
		array(
			'title'       => __( '${title}', 'textdomain' ),
			'description' => __( '${description}', 'textdomain' ),
			'content'     => '${content.replace(/'/g, "\\'")}',
			'categories'  => array( ${categories.map(c => `'${c}'`).join(', ')} ),
			'keywords'    => array( ${keywords.map(k => `'${k}'`).join(', ')} ),
		)
	);
}
add_action( 'init', 'register_${title.toLowerCase().replace(/\s+/g, '_')}_pattern' );
\`\`\`
`;
}

/**
 * Get Gutenberg standards reference
 */
function getGutenbergStandards(): string {
  return `# Gutenberg Block Development Standards

## Overview
This guide covers WordPress Gutenberg block development standards and best practices.

## Block Structure

### Required Files
- \`block.json\` - Block metadata and configuration
- \`src/index.js\` - Block registration and React components
- \`build/\` - Compiled block files (generated)

### Optional Files
- \`src/style.scss\` - Block editor styles
- \`src/editor.scss\` - Block editor-specific styles
- \`src/save.js\` - Custom save function
- \`src/edit.js\` - Custom edit component

## block.json Configuration

### Required Fields
- \`apiVersion\` - Block API version (use 3 for latest)
- \`name\` - Block namespace/name (format: namespace/block-name)
- \`title\` - Human-readable block title
- \`category\` - Block category (text, media, design, widgets, theme, embed)

### Common Fields
- \`icon\` - Dashicon name or SVG
- \`description\` - Block description
- \`keywords\` - Array of search keywords
- \`supports\` - Block support features
- \`attributes\` - Block attributes definition
- \`example\` - Example attributes for preview

## React Components

### Edit Component
- Use \`useBlockProps()\` hook for wrapper attributes
- Use \`@wordpress/block-editor\` components
- Implement attribute updates via \`setAttributes\`
- Use \`@wordpress/i18n\` for translations

### Save Component
- Use \`useBlockProps.save()\` for wrapper attributes
- Return static HTML (no React hooks)
- Use \`wp_kses_post()\` for sanitization in PHP

## PHP Rendering

### Server-Side Render
- Use \`render_callback\` in block registration
- Extract and sanitize attributes
- Use \`get_block_wrapper_attributes()\` for wrapper
- Escape all output using appropriate functions

### Security
- Sanitize all attributes
- Escape all output
- Validate user input
- Use nonces for form submissions

## Performance

### Best Practices
- Minimize JavaScript bundle size
- Use lazy loading for heavy components
- Optimize CSS delivery
- Cache block rendering when possible

## GenerateBlocks Compatibility

### Considerations
- Test blocks with GenerateBlocks active
- Ensure proper block wrapper structure
- Use GenerateBlocks hooks when available
- Follow GenerateBlocks styling patterns

## Accessibility

### Requirements
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Testing

### Checklist
- Test in Gutenberg editor
- Test on frontend
- Test with different themes
- Test with GenerateBlocks
- Test responsive behavior
- Test accessibility
`;
}

/**
 * Register Gutenberg tools
 */
export function registerGutenbergTools(server: Server): void {
  // Generate block tool
  server.setTool({
    name: 'generate_gutenberg_block',
    description: 'Generate complete Gutenberg block code including block.json, PHP registration, and React components',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Block name (slug, e.g., "custom-card")',
        },
        title: {
          type: 'string',
          description: 'Block title (display name)',
        },
        description: {
          type: 'string',
          description: 'Block description',
        },
        category: {
          type: 'string',
          description: 'Block category (text, media, design, widgets, theme, embed)',
        },
        icon: {
          type: 'string',
          description: 'Dashicon name or icon identifier',
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Search keywords for the block',
        },
      },
      required: ['name', 'title'],
    },
    handler: async (args) => {
      return generateBlock(args as BlockDefinition);
    },
  });

  // Generate block variation tool
  server.setTool({
    name: 'generate_block_variation',
    description: 'Generate a Gutenberg block variation',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variation name (slug)',
        },
        title: {
          type: 'string',
          description: 'Variation title',
        },
        description: {
          type: 'string',
          description: 'Variation description',
        },
        attributes: {
          type: 'object',
          description: 'Default attributes for the variation',
        },
      },
      required: ['name', 'title'],
    },
    handler: async (args) => {
      return generateBlockVariation(args as any);
    },
  });

  // Generate block pattern tool
  server.setTool({
    name: 'generate_block_pattern',
    description: 'Generate a Gutenberg block pattern',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Pattern title',
        },
        description: {
          type: 'string',
          description: 'Pattern description',
        },
        content: {
          type: 'string',
          description: 'Block markup content',
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Pattern categories',
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Pattern keywords',
        },
      },
      required: ['title', 'content'],
    },
    handler: async (args) => {
      return generateBlockPattern(args as any);
    },
  });

  // Get Gutenberg standards tool
  server.setTool({
    name: 'get_gutenberg_standards',
    description: 'Get Gutenberg block development standards and best practices',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      return getGutenbergStandards();
    },
  });
}

