# GenerateBlocks Development Guide

## Overview
GenerateBlocks is a lightweight, versatile block collection for WordPress Gutenberg. This guide covers best practices for working with GenerateBlocks in your WordPress development.

## Core Blocks

### Container Block
The Container block is a flexible container with extensive styling options.

**Common Use Cases:**
- Page sections
- Content wrappers
- Layout containers
- Background sections

**Key Features:**
- Padding and margin controls
- Background colors and images
- Border options
- Responsive controls
- Flexbox support

**Example:**
```html
<!-- wp:generateblocks/gb-container {"containerWidth":"1200px","paddingTop":"60px","paddingBottom":"60px","backgroundColor":"#ffffff"} -->
<div class="gb-container">
    <!-- Content -->
</div>
<!-- /wp:generateblocks/gb-container -->
```

### Grid Block
The Grid block provides CSS Grid-based layouts.

**Common Use Cases:**
- Multi-column layouts
- Card grids
- Product listings
- Feature sections

**Key Features:**
- Column controls
- Gap controls
- Responsive columns
- Alignment options

**Example:**
```html
<!-- wp:generateblocks/gb-grid {"columns":3,"columnGap":"30px","rowGap":"30px"} -->
<div class="gb-grid">
    <!-- Grid items -->
</div>
<!-- /wp:generateblocks/gb-grid -->
```

### Headline Block
The Headline block provides typography controls.

**Common Use Cases:**
- Page headings
- Section titles
- Call-out text
- Emphasis text

**Key Features:**
- Multiple HTML elements (h1-h6, p, span)
- Typography controls
- Responsive font sizes
- Color options

**Example:**
```html
<!-- wp:generateblocks/gb-headline {"element":"h2","fontSize":32,"textAlign":"center"} -->
<h2 class="gb-headline">Heading Text</h2>
<!-- /wp:generateblocks/gb-headline -->
```

### Button Block
The Button block provides call-to-action buttons.

**Common Use Cases:**
- CTA buttons
- Link buttons
- Form buttons
- Navigation buttons

**Key Features:**
- Link controls
- Styling options
- Icon support
- Responsive padding

**Example:**
```html
<!-- wp:generateblocks/gb-button {"url":"https://example.com","backgroundColor":"#0073aa","textColor":"#ffffff","borderRadius":"5px"} -->
<a class="gb-button" href="https://example.com">Button Text</a>
<!-- /wp:generateblocks/gb-button -->
```

### Image Block
The Image block is a lightweight image block.

**Common Use Cases:**
- Content images
- Featured images
- Logo display
- Decorative images

**Key Features:**
- Lightweight
- Lazy loading
- Responsive controls
- Alignment options

### Query Loop Block
The Query Loop block displays posts dynamically.

**Common Use Cases:**
- Blog listings
- Custom post type listings
- Related posts
- Archive pages

**Key Features:**
- Custom post type support
- Template builder
- Pagination
- Filtering options

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

#### CSS Customization
```php
<?php
function custom_gb_styles() {
    $css = '
        .gb-container {
            /* Custom styles */
        }
    ';
    wp_add_inline_style( 'generateblocks-style', $css );
}
add_action( 'wp_enqueue_scripts', 'custom_gb_styles', 100 );
```

#### Attribute Filtering
```php
<?php
function custom_gb_container_attributes( $attributes, $block ) {
    // Modify attributes
    return $attributes;
}
add_filter( 'generateblocks_attr_container', 'custom_gb_container_attributes', 10, 2 );
```

#### CSS Generation Filter
```php
<?php
function custom_gb_css( $css, $attributes, $block ) {
    if ( 'generateblocks/gb-container' === $block['blockName'] ) {
        // Add custom CSS
        $css .= '.gb-container { /* styles */ }';
    }
    return $css;
}
add_filter( 'generateblocks_css', 'custom_gb_css', 10, 3 );
```

### Spacing System
GenerateBlocks uses a spacing scale:
- 0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100

Use these values for consistent spacing:
```php
$attributes = array(
    'paddingTop' => '60px',
    'paddingBottom' => '60px',
    'marginTop' => '40px',
);
```

### Color System
- Use GenerateBlocks color palette
- Support dark mode when applicable
- Use CSS variables for colors
- Test color contrast

### Responsive Design
- Use device-specific controls
- Test on mobile, tablet, desktop
- Use GenerateBlocks responsive utilities
- Follow mobile-first approach

## Hooks and Filters

### CSS Generation
- `generateblocks_css` - Filter generated CSS
- `generateblocks_attr_{block}` - Filter block attributes

### Container Block
- `generateblocks_do_container_open` - Container opening
- `generateblocks_do_container_close` - Container closing

### Query Loop
- `generateblocks_query_loop_args` - Modify query arguments
- `generateblocks_query_loop_post_data` - Modify post data

### Button Block
- `generateblocks_button_atts` - Filter button attributes

### Headline Block
- `generateblocks_headline_atts` - Filter headline attributes

## Common Patterns

### Pattern 1: Hero Section
```html
<!-- wp:generateblocks/gb-container {"containerWidth":"1200px","paddingTop":"100px","paddingBottom":"100px","backgroundColor":"#f0f0f0"} -->
<div class="gb-container">
    <!-- wp:generateblocks/gb-headline {"element":"h1","fontSize":48,"textAlign":"center"} -->
    <h1 class="gb-headline">Hero Title</h1>
    <!-- /wp:generateblocks/gb-headline -->
    
    <!-- wp:generateblocks/gb-button {"url":"#","textAlign":"center"} -->
    <a class="gb-button" href="#">Call to Action</a>
    <!-- /wp:generateblocks/gb-button -->
</div>
<!-- /wp:generateblocks/gb-container -->
```

### Pattern 2: Feature Grid
```html
<!-- wp:generateblocks/gb-container {"containerWidth":"1200px","paddingTop":"60px","paddingBottom":"60px"} -->
<div class="gb-container">
    <!-- wp:generateblocks/gb-grid {"columns":3,"columnGap":"30px"} -->
    <div class="gb-grid">
        <!-- Grid items -->
    </div>
    <!-- /wp:generateblocks/gb-grid -->
</div>
<!-- /wp:generateblocks/gb-container -->
```

### Pattern 3: Content Section
```html
<!-- wp:generateblocks/gb-container {"containerWidth":"800px","paddingTop":"40px","paddingBottom":"40px"} -->
<div class="gb-container">
    <!-- wp:generateblocks/gb-headline {"element":"h2","fontSize":32} -->
    <h2 class="gb-headline">Section Title</h2>
    <!-- /wp:generateblocks/gb-headline -->
    
    <!-- Content -->
</div>
<!-- /wp:generateblocks/gb-container -->
```

## Testing

### Checklist
- Test with GeneratePress theme
- Test with different content
- Test responsive behavior
- Test with GenerateBlocks Pro features
- Test performance impact
- Test accessibility

### Common Issues

#### Issue: Styles not applying
**Solution**: Check if GenerateBlocks styles are enqueued, verify CSS specificity

#### Issue: Blocks not appearing
**Solution**: Ensure GenerateBlocks plugin is active, check block registration

#### Issue: Responsive not working
**Solution**: Verify responsive controls are set, test on different devices

#### Issue: Custom styles conflicting
**Solution**: Increase CSS specificity, use GenerateBlocks classes

## Accessibility

### Requirements
- Use semantic HTML
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Best Practices
- Test with screen readers
- Test keyboard navigation
- Verify color contrast
- Use proper ARIA labels
- Follow WCAG guidelines

## Performance Optimization

### Tips
- Minimize custom CSS
- Use GenerateBlocks spacing system
- Optimize images
- Use lazy loading
- Minimize JavaScript
- Cache when possible

### Monitoring
- Test page load times
- Monitor CSS/JS file sizes
- Check render-blocking resources
- Use performance testing tools

