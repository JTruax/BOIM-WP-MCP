# WPCodebox Snippet Format

## Overview
WPCodebox is a WordPress plugin for managing code snippets. This guide covers the format and structure for WPCodebox snippets.

## Snippet Structure

### Basic Structure
```php
<?php
/**
 * Snippet Title
 * 
 * Snippet description explaining what it does
 * 
 * Language: PHP
 * Scope: global
 * Priority: 10
 * Active: Yes
 * Tags: wordpress, custom, function
 */

// Your code here
```

### Required Elements
- **Title**: Clear, descriptive name
- **Code**: The actual code to execute
- **Language**: php, javascript, css, or html

### Optional Elements
- **Description**: Explanation of what the snippet does
- **Tags**: Array of tags for organization
- **Scope**: Where code runs (global, admin, frontend)
- **Priority**: Execution priority (default: 10)
- **Active**: Whether snippet is active (default: true)

## Language-Specific Formats

### PHP Snippets
```php
<?php
/**
 * Custom Function
 * 
 * Adds a custom function to WordPress
 * 
 * Language: PHP
 * Scope: global
 * Tags: function, custom
 */

function my_custom_function() {
    // Function code
}
add_action( 'init', 'my_custom_function' );
```

**Important Notes:**
- Always start with `<?php` tag
- Never include closing `?>` tag
- Follow WordPress coding standards
- Include proper sanitization and escaping

### JavaScript Snippets
```javascript
/**
 * Custom JavaScript
 * 
 * Adds custom JavaScript functionality
 * 
 * Language: JavaScript
 * Scope: frontend
 * Tags: javascript, frontend
 */

jQuery( document ).ready( function( $ ) {
    // JavaScript code
} );
```

**Important Notes:**
- Use jQuery if needed (ensure it's enqueued)
- Use vanilla JavaScript when possible
- Localize strings using wp.i18n
- Remove console.log in production

### CSS Snippets
```css
/**
 * Custom Styles
 * 
 * Adds custom CSS styles
 * 
 * Language: CSS
 * Scope: frontend
 * Tags: css, styling
 */

.my-custom-class {
    /* CSS code */
}
```

**Important Notes:**
- Use specific selectors
- Avoid !important
- Test with GeneratePress/GenerateBlocks
- Use CSS variables when possible

### HTML Snippets
```html
<!--
Custom HTML
Adds custom HTML markup
Language: HTML
Scope: frontend
Tags: html, markup
-->

<div class="custom-container">
    <!-- HTML code -->
</div>
```

## Scope Options

### Global
Code runs on both admin and frontend.

**Use for:**
- General WordPress hooks
- Custom post types
- Taxonomies
- General functionality

**Example:**
```php
<?php
/**
 * Global Snippet
 * Scope: global
 */

function global_function() {
    // Runs everywhere
}
add_action( 'init', 'global_function' );
```

### Admin
Code runs only in WordPress admin.

**Use for:**
- Admin menu items
- Admin notices
- Dashboard widgets
- Admin-specific functionality

**Example:**
```php
<?php
/**
 * Admin Snippet
 * Scope: admin
 */

function admin_function() {
    // Runs only in admin
}
add_action( 'admin_init', 'admin_function' );
```

### Frontend
Code runs only on the frontend.

**Use for:**
- Theme modifications
- Frontend scripts
- Public-facing functionality

**Example:**
```php
<?php
/**
 * Frontend Snippet
 * Scope: frontend
 */

function frontend_function() {
    // Runs only on frontend
}
add_action( 'wp_enqueue_scripts', 'frontend_function' );
```

## Priority

Priority determines execution order when multiple snippets hook into the same action/filter.

- **Lower numbers** = Earlier execution
- **Default**: 10
- **Range**: 1-999

**Example:**
```php
<?php
// Runs early (priority 5)
add_action( 'init', 'early_function', 5 );

// Runs later (priority 20)
add_action( 'init', 'late_function', 20 );
```

## Tags

Tags help organize and categorize snippets.

**Common Tags:**
- `wordpress` - General WordPress
- `custom` - Custom functionality
- `function` - Functions
- `hook` - Hooks (actions/filters)
- `shortcode` - Shortcodes
- `rest-api` - REST API
- `gutenberg` - Gutenberg blocks
- `generatepress` - GeneratePress theme
- `generateblocks` - GenerateBlocks plugin
- `security` - Security-related
- `performance` - Performance optimization

**Example:**
```php
<?php
/**
 * Snippet Title
 * Tags: wordpress, custom, function, generatepress
 */
```

## Best Practices

### Security
- Always sanitize user input
- Always escape output
- Use nonces for forms
- Check user capabilities
- Validate and sanitize data

### Performance
- Keep snippets lightweight
- Avoid unnecessary database queries
- Use transients for expensive operations
- Consider caching

### Organization
- Use descriptive titles
- Add clear descriptions
- Use appropriate tags
- Group related snippets
- Document complex code

### Compatibility
- Test with GeneratePress theme
- Test with GenerateBlocks plugin
- Test with other plugins
- Test with different WordPress versions

## Common Patterns

### Pattern 1: Custom Function
```php
<?php
/**
 * Custom Function
 * Tags: function, custom
 */

function my_custom_function() {
    // Function code
}
add_action( 'init', 'my_custom_function' );
```

### Pattern 2: Filter Hook
```php
<?php
/**
 * Modify Content
 * Tags: filter, content
 */

function modify_content( $content ) {
    // Modify content
    return $content;
}
add_filter( 'the_content', 'modify_content' );
```

### Pattern 3: Action Hook
```php
<?php
/**
 * Custom Action
 * Tags: action, custom
 */

function custom_action() {
    // Action code
}
add_action( 'wp_footer', 'custom_action' );
```

### Pattern 4: Shortcode
```php
<?php
/**
 * Custom Shortcode
 * Tags: shortcode, custom
 */

function custom_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'param' => 'default',
    ), $atts );
    
    return 'Shortcode output';
}
add_shortcode( 'custom', 'custom_shortcode' );
```

### Pattern 5: REST API Endpoint
```php
<?php
/**
 * REST API Endpoint
 * Tags: rest-api, custom
 */

function register_custom_endpoint() {
    register_rest_route( 'custom/v1', '/endpoint', array(
        'methods' => 'GET',
        'callback' => 'custom_endpoint_handler',
        'permission_callback' => '__return_true',
    ) );
}
add_action( 'rest_api_init', 'register_custom_endpoint' );

function custom_endpoint_handler( $request ) {
    return new WP_REST_Response( array( 'success' => true ), 200 );
}
```

## Validation

### PHP Validation
- Check for proper opening tag (`<?php`)
- Check for missing closing tag (should be omitted)
- Validate syntax
- Check for security issues

### JavaScript Validation
- Check for proper syntax
- Verify jQuery usage (if applicable)
- Check for console.log (should be removed)
- Validate localization

### CSS Validation
- Check for proper syntax
- Verify selectors
- Check for !important (should be avoided)
- Validate vendor prefixes

## Integration with GeneratePress/GenerateBlocks

### GeneratePress
- Use GeneratePress hooks when available
- Follow GeneratePress patterns
- Test with GeneratePress theme active
- Respect GeneratePress structure

### GenerateBlocks
- Use GenerateBlocks hooks when available
- Follow GenerateBlocks patterns
- Test with GenerateBlocks active
- Respect GenerateBlocks styling

## Troubleshooting

### Issue: Snippet not executing
**Solutions:**
- Check if snippet is active
- Verify scope is correct
- Check for syntax errors
- Verify hook is correct

### Issue: Snippet causing errors
**Solutions:**
- Check for syntax errors
- Verify function names are unique
- Check for conflicts with other code
- Review error logs

### Issue: Snippet not working as expected
**Solutions:**
- Verify hook priority
- Check scope settings
- Test with other plugins disabled
- Review code logic

