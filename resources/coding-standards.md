# WordPress Coding Standards

## Overview
WordPress has established coding standards to ensure consistency, readability, and maintainability across the WordPress ecosystem. This guide covers PHP, JavaScript, and CSS standards.

## PHP Coding Standards

### Indentation
- Use **tabs** for indentation, not spaces
- Each level of indentation should be one tab
- Never mix tabs and spaces

### Naming Conventions
- **Functions**: lowercase with underscores
  ```php
  function my_custom_function() {}
  ```
- **Classes**: Capitalized_Words (PascalCase)
  ```php
  class My_Custom_Class {}
  ```
- **Constants**: UPPERCASE with underscores
  ```php
  define( 'MY_CONSTANT', 'value' );
  ```
- **Variables**: lowercase with underscores
  ```php
  $my_variable = 'value';
  ```

### Brace Style
- Opening braces on the same line
- Closing braces on their own line
- Always use braces, even for single-line statements

```php
if ( condition ) {
    // code
} else {
    // code
}
```

### Spacing
- One space after control structures (`if`, `for`, `while`, etc.)
- No space after function names
- One space on each side of operators
- No space after opening parentheses or before closing parentheses

```php
if ( $condition && $other_condition ) {
    $result = $value + $other_value;
    my_function( $param1, $param2 );
}
```

### Yoda Conditions
- Use Yoda conditions for comparisons
- Put the constant on the left side

```php
if ( 'value' === $variable ) {}
if ( 0 === $count ) {}
```

### Database Queries
- Always use `$wpdb->prepare()` for queries
- Use `$wpdb->get_results()`, `$wpdb->get_var()`, etc.
- Never use `mysql_*` functions

```php
global $wpdb;
$results = $wpdb->get_results( $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_status = %s",
    'publish'
) );
```

### Security

#### Sanitization
- Always sanitize user input
- Use appropriate `sanitize_*` functions

```php
$title = sanitize_text_field( $_POST['title'] );
$email = sanitize_email( $_POST['email'] );
$url = sanitize_url( $_POST['url'] );
```

#### Escaping
- Always escape output
- Use appropriate `esc_*` functions

```php
echo esc_html( $title );
echo esc_attr( $attribute );
echo esc_url( $link );
echo esc_js( $javascript );
echo esc_textarea( $textarea );
```

#### Nonces
- Always use nonces for form submissions
- Verify nonces before processing

```php
// Output nonce
wp_nonce_field( 'my_action', 'my_nonce' );

// Verify nonce
if ( ! isset( $_POST['my_nonce'] ) || ! wp_verify_nonce( $_POST['my_nonce'], 'my_action' ) ) {
    return;
}
```

#### Capability Checks
- Always check user capabilities
- Use `current_user_can()`

```php
if ( ! current_user_can( 'manage_options' ) ) {
    return;
}
```

### File Headers
- Include proper file headers
- Use DocBlocks for functions and classes

```php
<?php
/**
 * Plugin Name: My Plugin
 * Description: Plugin description
 * Version: 1.0.0
 * Author: Your Name
 */

/**
 * Function description
 *
 * @param string $param Parameter description.
 * @return string Return description.
 */
function my_function( $param ) {
    return $param;
}
```

### PHP Tags
- Always use `<?php` (not `<?`)
- Never include closing `?>` tag at end of files
- One space after `<?php`

## JavaScript Coding Standards

### Indentation
- Use **spaces** for indentation (2 or 4 spaces)
- Be consistent throughout the file

### Naming Conventions
- **Variables**: camelCase
  ```javascript
  const myVariable = 'value';
  ```
- **Functions**: camelCase
  ```javascript
  function myFunction() {}
  ```
- **Constants**: UPPERCASE with underscores
  ```javascript
  const MY_CONSTANT = 'value';
  ```
- **Classes**: PascalCase
  ```javascript
  class MyClass {}
  ```

### Spacing
- One space after keywords (`if`, `for`, `while`, etc.)
- One space on each side of operators
- No space after function names
- One space after commas

```javascript
if ( condition && otherCondition ) {
    const result = value + otherValue;
    myFunction( param1, param2 );
}
```

### jQuery
- Use `jQuery` instead of `$` when appropriate
- Cache jQuery selectors
- Use proper event delegation

```javascript
jQuery( document ).ready( function( $ ) {
    const $element = $( '.my-element' );
    $element.on( 'click', function() {
        // code
    } );
} );
```

### Localization
- Use `wp.i18n` for translations
- Use `__()`, `_e()`, `_n()`, etc.

```javascript
import { __ } from '@wordpress/i18n';

const message = __( 'Hello World', 'textdomain' );
```

### Modern JavaScript
- Use ES6+ features when possible
- Use `const` and `let` instead of `var`
- Use arrow functions when appropriate
- Use template literals

```javascript
const myFunction = ( param ) => {
    return `Hello ${ param }`;
};
```

### Console
- Remove `console.log()` in production
- Use proper debugging tools

## CSS Coding Standards

### Indentation
- Use **tabs** for indentation
- Be consistent throughout the file

### Naming Conventions
- Use lowercase with hyphens
- Be descriptive
- Consider BEM methodology

```css
.my-element {}
.my-element__child {}
.my-element--modifier {}
```

### Selectors
- Keep selectors specific
- Avoid overly nested selectors (max 3-4 levels)
- Use classes, not IDs

```css
/* Good */
.my-element .my-child {}

/* Bad */
#my-element div div div {}
```

### Properties
- One property per line
- Alphabetical order (optional but recommended)
- Use shorthand when appropriate

```css
.my-element {
    background-color: #fff;
    border: 1px solid #000;
    color: #333;
    margin: 10px;
    padding: 20px;
}
```

### Values
- Use lowercase for hex colors
- Use quotes for font names with spaces
- Use relative units when possible

```css
.my-element {
    color: #ffffff;
    font-family: "Helvetica Neue", sans-serif;
    font-size: 16px;
    margin: 1em;
}
```

### !important
- Avoid `!important` unless absolutely necessary
- Use specificity instead

### Vendor Prefixes
- Use autoprefixer instead of manual prefixes
- Only add prefixes when necessary

### Comments
- Use comments to explain complex code
- Keep comments up to date

```css
/* Main container */
.container {
    /* Layout */
    display: flex;
    flex-direction: column;
}
```

## Best Practices

### Performance
- Minimize database queries
- Use transients for expensive operations
- Enqueue scripts and styles properly
- Use lazy loading when appropriate

### Security
- Always sanitize input
- Always escape output
- Use nonces for forms
- Check user capabilities
- Validate and sanitize data

### Compatibility
- Test with different WordPress versions
- Test with different themes
- Test with different plugins
- Follow WordPress backward compatibility guidelines

### Documentation
- Document complex code
- Use DocBlocks for functions
- Keep comments up to date
- Write clear variable names

## GeneratePress/GenerateBlocks Considerations

### Theme Compatibility
- Test with GeneratePress theme
- Use GeneratePress hooks when available
- Follow GeneratePress patterns
- Respect GeneratePress structure

### Block Compatibility
- Test with GenerateBlocks
- Use GenerateBlocks hooks
- Follow GenerateBlocks patterns
- Respect GenerateBlocks styling

### Performance
- Keep code lightweight
- Minimize CSS/JS output
- Use GeneratePress/GenerateBlocks optimization features
- Test performance impact

