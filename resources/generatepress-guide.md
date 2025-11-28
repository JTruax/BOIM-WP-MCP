# GeneratePress Theme Guide

## Overview
GeneratePress is a lightweight, fast WordPress theme. This guide covers best practices for developing with GeneratePress.

## Theme Structure

### Core Files
- `functions.php` - Theme functions
- `style.css` - Theme stylesheet
- `header.php` - Header template
- `footer.php` - Footer template
- `index.php` - Main template

### GeneratePress Features
- Lightweight (minimal code)
- Fast performance
- Modular architecture
- Extensive hooks
- Customizer options
- Block editor support

## Hooks and Filters

### Common Hooks

#### Actions
- `generate_before_header` - Before header
- `generate_header` - Header output
- `generate_after_header` - After header
- `generate_before_main_content` - Before main content
- `generate_after_main_content` - After main content
- `generate_before_footer` - Before footer
- `generate_footer` - Footer output
- `generate_after_footer` - After footer

#### Filters
- `generate_site_logo` - Modify site logo
- `generate_navigation_location` - Navigation location
- `generate_show_title` - Show/hide title
- `generate_post_date` - Post date output
- `generate_post_author` - Post author output
- `generate_footer_copyright` - Footer copyright

### Example Usage

```php
<?php
/**
 * Add content before header
 */
function custom_before_header() {
    echo '<div class="custom-before-header">Custom content</div>';
}
add_action( 'generate_before_header', 'custom_before_header' );

/**
 * Modify site logo
 */
function custom_site_logo( $logo ) {
    // Modify logo
    return $logo;
}
add_filter( 'generate_site_logo', 'custom_site_logo' );
```

## Customization

### Functions.php
Add custom code to `functions.php` or use WPCodebox:

```php
<?php
/**
 * GeneratePress Customizations
 */

// Enqueue custom styles
function custom_enqueue_styles() {
    wp_enqueue_style( 'custom-style', get_stylesheet_directory_uri() . '/custom.css' );
}
add_action( 'wp_enqueue_scripts', 'custom_enqueue_styles' );

// Add custom body classes
function custom_body_classes( $classes ) {
    $classes[] = 'custom-class';
    return $classes;
}
add_filter( 'body_class', 'custom_body_classes' );
```

### Custom CSS
Add custom CSS via Customizer or WPCodebox:

```css
/* Custom GeneratePress Styles */

/* Header customization */
.site-header {
    background-color: #ffffff;
    padding: 20px 0;
}

/* Navigation customization */
.main-navigation a {
    color: #333333;
    font-weight: 600;
}

/* Content area customization */
.site-main {
    max-width: 1200px;
    margin: 0 auto;
}
```

## GenerateBlocks Integration

### Best Practices
- GenerateBlocks works seamlessly with GeneratePress
- Use GenerateBlocks for layouts
- Follow GenerateBlocks patterns
- Test with both active

### Example Layout
```html
<!-- wp:generateblocks/gb-container {"containerWidth":"1200px"} -->
<div class="gb-container">
    <!-- wp:generateblocks/gb-headline {"element":"h1"} -->
    <h1 class="gb-headline">Page Title</h1>
    <!-- /wp:generateblocks/gb-headline -->
    
    <!-- Content -->
</div>
<!-- /wp:generateblocks/gb-container -->
```

## Performance

### Optimization Tips
- GeneratePress is already optimized
- Minimize custom code
- Use GeneratePress hooks efficiently
- Cache when possible
- Optimize images
- Minimize CSS/JS

### Performance Features
- Minimal CSS output
- Efficient JavaScript
- Optimized database queries
- Fast page load times

## Customizer Options

### Available Options
- Site identity
- Colors
- Typography
- Layout
- Navigation
- Buttons
- Forms
- Spacing

### Customizer Hooks
```php
<?php
/**
 * Add custom Customizer options
 */
function custom_customizer_options( $wp_customize ) {
    // Add custom section
    $wp_customize->add_section( 'custom_section', array(
        'title' => 'Custom Section',
        'priority' => 30,
    ) );
    
    // Add custom setting
    $wp_customize->add_setting( 'custom_setting', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    
    // Add custom control
    $wp_customize->add_control( 'custom_setting', array(
        'label' => 'Custom Setting',
        'section' => 'custom_section',
        'type' => 'text',
    ) );
}
add_action( 'customize_register', 'custom_customizer_options' );
```

## Layout Options

### Container Width
- Full width
- Contained
- Custom width

### Sidebar Layout
- Right sidebar
- Left sidebar
- No sidebar
- Both sidebars

### Content Layout
- Boxed
- Full width
- Contained

## Typography

### Font Options
- System fonts
- Google Fonts
- Custom fonts

### Typography Controls
- Font family
- Font size
- Font weight
- Line height
- Letter spacing

## Colors

### Color Options
- Base colors
- Text colors
- Link colors
- Background colors
- Button colors

### Color System
- Use CSS variables
- Support dark mode
- Test color contrast
- Follow accessibility guidelines

## Spacing

### Spacing System
- Consistent spacing scale
- Responsive spacing
- Padding controls
- Margin controls

### Best Practices
- Use GeneratePress spacing system
- Maintain consistency
- Test responsive spacing
- Follow spacing guidelines

## Accessibility

### Requirements
- Semantic HTML
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- Screen reader support
- Color contrast

### Best Practices
- Test with screen readers
- Test keyboard navigation
- Verify color contrast
- Use proper ARIA labels
- Follow WCAG guidelines

## Security

### Best Practices
- Sanitize all input
- Escape all output
- Use nonces for forms
- Check user capabilities
- Validate data
- Follow WordPress security guidelines

## Testing

### Checklist
- Test with GeneratePress theme
- Test with GenerateBlocks
- Test with different content
- Test responsive behavior
- Test performance
- Test accessibility
- Test with other plugins

## Common Patterns

### Pattern 1: Custom Header
```php
<?php
/**
 * Custom Header Content
 */
function custom_header_content() {
    echo '<div class="custom-header-content">Custom content</div>';
}
add_action( 'generate_before_header', 'custom_header_content' );
```

### Pattern 2: Custom Footer
```php
<?php
/**
 * Custom Footer Content
 */
function custom_footer_content() {
    echo '<div class="custom-footer-content">Custom content</div>';
}
add_action( 'generate_footer', 'custom_footer_content' );
```

### Pattern 3: Modify Navigation
```php
<?php
/**
 * Custom Navigation
 */
function custom_navigation( $nav ) {
    // Modify navigation
    return $nav;
}
add_filter( 'wp_nav_menu', 'custom_navigation' );
```

### Pattern 4: Custom Post Meta
```php
<?php
/**
 * Custom Post Meta
 */
function custom_post_meta() {
    echo '<div class="custom-post-meta">Custom meta</div>';
}
add_action( 'generate_after_entry_header', 'custom_post_meta' );
```

## Troubleshooting

### Issue: Styles not applying
**Solution**: Check CSS specificity, verify stylesheet is enqueued

### Issue: Hooks not working
**Solution**: Verify hook names, check priority, ensure code is active

### Issue: Layout issues
**Solution**: Check container width, verify sidebar settings, test responsive

### Issue: Performance issues
**Solution**: Minimize custom code, optimize images, use caching

## Resources

### Official Resources
- GeneratePress documentation
- GeneratePress support
- GeneratePress GitHub

### Community
- GeneratePress community
- WordPress forums
- Stack Overflow

