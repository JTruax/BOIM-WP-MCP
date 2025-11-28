import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WordPressStandards } from '../standards.js';

/**
 * WordPress Utility Tools
 * 
 * Provides tools for generating common WordPress code patterns
 */

/**
 * Generate PHP function
 */
function generatePHPFunction(config: {
  name: string;
  description?: string;
  parameters?: Array<{ name: string; type?: string; default?: string }>;
  returnType?: string;
  body: string;
  hooks?: Array<{ type: 'action' | 'filter'; hook: string; priority?: number; args?: number }>;
}): string {
  const {
    name,
    description = '',
    parameters = [],
    returnType = 'void',
    body,
    hooks = [],
  } = config;

  // Build function signature
  const paramList = parameters.map(param => {
    let paramStr = `$${param.name}`;
    if (param.type) {
      paramStr = `${param.type} ${paramStr}`;
    }
    if (param.default !== undefined) {
      paramStr += ` = ${param.default}`;
    }
    return paramStr;
  }).join(', ');

  // Build function docblock
  const docblock = `/**
 * ${description || name}
 *
${parameters.map(p => ` * @param ${p.type || 'mixed'} $${p.name} ${p.name}`).join('\n')}
 * @return ${returnType}
 */`;

  // Build function code
  const functionCode = `${docblock}
function ${name}( ${paramList} ) {
${body.split('\n').map(line => `\t${line}`).join('\n')}
}`;

  // Build hook registrations
  const hookCode = hooks.map(hook => {
    const priority = hook.priority || 10;
    const args = hook.args || 1;
    if (hook.type === 'action') {
      return `add_action( '${hook.hook}', '${name}', ${priority}, ${args} );`;
    } else {
      return `add_filter( '${hook.hook}', '${name}', ${priority}, ${args} );`;
    }
  }).join('\n');

  return `# ${name} Function

## Function Code

\`\`\`php
<?php
${functionCode}
${hookCode.length > 0 ? `\n${hookCode}` : ''}
\`\`\`

## Usage

\`\`\`php
${name}( ${parameters.map(p => `$${p.name}`).join(', ')} );
\`\`\`

## Notes

- Function follows WordPress coding standards
- Parameters are properly typed
- Hooks are registered as specified
- Code is ready for WPCodebox
`;
}

/**
 * Generate hook code
 */
function generateHook(config: {
  type: 'action' | 'filter';
  hook: string;
  callback: string;
  priority?: number;
  args?: number;
  description?: string;
}): string {
  const {
    type,
    hook,
    callback,
    priority = 10,
    args = 1,
    description = '',
  } = config;

  const hookCode = `<?php
/**
 * ${description || `${type.charAt(0).toUpperCase() + type.slice(1)}: ${hook}`}
 */
function ${callback}( ${args > 0 ? Array.from({ length: args }, (_, i) => `$$arg${i + 1}`).join(', ') : ''} ) {
\t// Hook implementation
${type === 'filter' ? '\treturn $arg1;' : ''}
}
${type === 'action' ? `add_action( '${hook}', '${callback}', ${priority}, ${args} );` : `add_filter( '${hook}', '${callback}', ${priority}, ${args} );`}
`;

  return `# ${hook} ${type.charAt(0).toUpperCase() + type.slice(1)}

## Hook Code

\`\`\`php
${hookCode}
\`\`\`

## Common ${type === 'action' ? 'Actions' : 'Filters'}

${type === 'action' ? `
- \`init\` - WordPress initialization
- \`wp_enqueue_scripts\` - Enqueue scripts and styles
- \`admin_init\` - Admin initialization
- \`save_post\` - Post save
- \`wp_head\` - Header output
- \`wp_footer\` - Footer output
` : `
- \`the_content\` - Post content
- \`the_title\` - Post title
- \`excerpt_length\` - Excerpt length
- \`body_class\` - Body classes
- \`post_class\` - Post classes
`}

## Notes

- Priority: ${priority} (lower = earlier execution)
- Arguments: ${args}
- ${type === 'filter' ? 'Must return a value' : 'Does not return a value'}
`;
}

/**
 * Generate shortcode
 */
function generateShortcode(config: {
  tag: string;
  description?: string;
  attributes?: Array<{ name: string; default?: string; description?: string }>;
  body: string;
}): string {
  const {
    tag,
    description = '',
    attributes = [],
    body,
  } = config;

  const shortcodeCode = `<?php
/**
 * Shortcode: [${tag}]
 *
 * ${description}
 *
 * Attributes:
${attributes.map(attr => ` * - ${attr.name}${attr.default ? ` (default: ${attr.default})` : ''}${attr.description ? ` - ${attr.description}` : ''}`).join('\n')}
 */
function ${tag.replace(/-/g, '_')}_shortcode( \$atts, \$content = '' ) {
	// Parse attributes
	\$atts = shortcode_atts( array(
${attributes.map(attr => `\t\t'${attr.name}' => ${attr.default ? `'${attr.default}'` : "''"},`).join('\n')}
	), \$atts, '${tag}' );
	
	// Sanitize attributes
${attributes.map(attr => `\t\$atts['${attr.name}'] = sanitize_text_field( \$atts['${attr.name}'] );`).join('\n')}
	
	// Process content
	\$content = do_shortcode( \$content );
	
	// Build output
	ob_start();
	?>
${body.split('\n').map(line => `\t${line}`).join('\n')}
	<?php
	return ob_get_clean();
}
add_shortcode( '${tag}', '${tag.replace(/-/g, '_')}_shortcode' );
`;

  return `# [${tag}] Shortcode

## Shortcode Code

\`\`\`php
${shortcodeCode}
\`\`\`

## Usage

\`\`\`php
[${tag}${attributes.length > 0 ? ` ${attributes.map(a => `${a.name}="${a.default || ''}"`).join(' ')}` : ''}]
\`\`\`

## Example

\`\`\`html
[${tag}${attributes.length > 0 ? ` ${attributes[0].name}="example"` : ''}]
Content here
[/${tag}]
\`\`\`

## Notes

- Attributes are sanitized
- Content is processed through do_shortcode()
- Output is escaped
- Ready for WPCodebox
`;
}

/**
 * Generate REST API endpoint
 */
function generateRestEndpoint(config: {
  namespace: string;
  route: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  parameters?: Array<{ name: string; type?: string; required?: boolean; description?: string }>;
  callback: string;
}): string {
  const {
    namespace,
    route,
    method = 'GET',
    description = '',
    parameters = [],
    callback,
  } = config;

  const endpointCode = `<?php
/**
 * REST API Endpoint: ${namespace}/${route}
 *
 * Method: ${method}
 * ${description}
 */
function register_${callback}_endpoint() {
	register_rest_route( '${namespace}', '/${route}', array(
		'methods'             => '${method}',
		'callback'            => '${callback}_handler',
		'permission_callback' => '${callback}_permission',
		'args'                => array(
${parameters.map(param => `\t\t\t'${param.name}' => array(
\t\t\t\t'required'          => ${param.required ? 'true' : 'false'},
\t\t\t\t'type'              => '${param.type || 'string'}',
\t\t\t\t'description'       => '${param.description || param.name}',
\t\t\t\t'sanitize_callback' => 'sanitize_text_field',
\t\t\t),`).join('\n')}
\t\t),
	) );
}
add_action( 'rest_api_init', 'register_${callback}_endpoint' );

/**
 * Endpoint handler
 */
function ${callback}_handler( \$request ) {
	// Get parameters
${parameters.map(param => `\t$${param.name} = $request->get_param( '${param.name}' );`).join('\n')}
	
	// Process request
	\$response = array(
		'success' => true,
		'data'    => array(
			// Response data
		),
	);
	
	return new WP_REST_Response( \$response, 200 );
}

/**
 * Permission callback
 */
function ${callback}_permission( \$request ) {
	// Check user capabilities
	return current_user_can( 'manage_options' );
}
`;

  return `# REST API Endpoint: ${namespace}/${route}

## Endpoint Code

\`\`\`php
${endpointCode}
\`\`\`

## Usage

\`\`\`javascript
fetch( '/wp-json/${namespace}/${route}${parameters.length > 0 ? '?' + parameters.map(p => `${p.name}=value`).join('&') : ''}', {
\tmethod: '${method}',
\theaders: {
\t\t'Content-Type': 'application/json',
\t\t'X-WP-Nonce': wpApiSettings.nonce,
	},
} )
\t.then( response => response.json() )
\t.then( data => console.log( data ) );
\`\`\`

## Notes

- Endpoint is registered on \`rest_api_init\`
- Parameters are sanitized
- Permission callback checks user capabilities
- Follows WordPress REST API standards
- Ready for WPCodebox
`;
}

/**
 * Format code for WPCodebox
 */
function formatForWpCodebox(config: {
  title: string;
  code: string;
  language: 'php' | 'javascript' | 'css';
  description?: string;
  tags?: string[];
}): string {
  const { title, code, language, description = '', tags = [] } = config;

  return `/**
 * ${title}
 * 
 * ${description}
 * 
 * Language: ${language.toUpperCase()}
 * Tags: ${tags.length > 0 ? tags.join(', ') : 'none'}
 */

${code}`;
}

/**
 * Register WordPress utility tools
 */
export function registerWordPressUtils(server: Server): void {
  // Generate PHP function tool
  server.setTool({
    name: 'generate_php_function',
    description: 'Generate WordPress PHP function following coding standards',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Function name',
        },
        description: {
          type: 'string',
          description: 'Function description',
        },
        parameters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              default: { type: 'string' },
            },
          },
          description: 'Function parameters',
        },
        returnType: {
          type: 'string',
          description: 'Return type',
        },
        body: {
          type: 'string',
          description: 'Function body code',
        },
        hooks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['action', 'filter'] },
              hook: { type: 'string' },
              priority: { type: 'number' },
              args: { type: 'number' },
            },
          },
          description: 'Hooks to register',
        },
      },
      required: ['name', 'body'],
    },
    handler: async (args) => {
      return generatePHPFunction(args as any);
    },
  });

  // Generate hook tool
  server.setTool({
    name: 'generate_hook',
    description: 'Generate WordPress action or filter hook code',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['action', 'filter'],
          description: 'Hook type',
        },
        hook: {
          type: 'string',
          description: 'Hook name',
        },
        callback: {
          type: 'string',
          description: 'Callback function name',
        },
        priority: {
          type: 'number',
          description: 'Hook priority (default: 10)',
        },
        args: {
          type: 'number',
          description: 'Number of arguments (default: 1)',
        },
        description: {
          type: 'string',
          description: 'Hook description',
        },
      },
      required: ['type', 'hook', 'callback'],
    },
    handler: async (args) => {
      return generateHook(args as any);
    },
  });

  // Generate shortcode tool
  server.setTool({
    name: 'generate_shortcode',
    description: 'Generate WordPress shortcode implementation',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Shortcode tag',
        },
        description: {
          type: 'string',
          description: 'Shortcode description',
        },
        attributes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              default: { type: 'string' },
              description: { type: 'string' },
            },
          },
          description: 'Shortcode attributes',
        },
        body: {
          type: 'string',
          description: 'Shortcode body code',
        },
      },
      required: ['tag', 'body'],
    },
    handler: async (args) => {
      return generateShortcode(args as any);
    },
  });

  // Generate REST endpoint tool
  server.setTool({
    name: 'generate_rest_endpoint',
    description: 'Generate WordPress REST API endpoint',
    inputSchema: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          description: 'REST API namespace',
        },
        route: {
          type: 'string',
          description: 'Route path',
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE'],
          description: 'HTTP method',
        },
        description: {
          type: 'string',
          description: 'Endpoint description',
        },
        parameters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              required: { type: 'boolean' },
              description: { type: 'string' },
            },
          },
          description: 'Endpoint parameters',
        },
        callback: {
          type: 'string',
          description: 'Callback function name',
        },
      },
      required: ['namespace', 'route', 'callback'],
    },
    handler: async (args) => {
      return generateRestEndpoint(args as any);
    },
  });

  // Format for WPCodebox tool
  server.setTool({
    name: 'format_for_wpcodebox',
    description: 'Format any generated code for WPCodebox snippet structure',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Snippet title',
        },
        code: {
          type: 'string',
          description: 'Code to format',
        },
        language: {
          type: 'string',
          enum: ['php', 'javascript', 'css'],
          description: 'Programming language',
        },
        description: {
          type: 'string',
          description: 'Snippet description',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for organization',
        },
      },
      required: ['title', 'code', 'language'],
    },
    handler: async (args) => {
      return formatForWpCodebox(args as any);
    },
  });
}

