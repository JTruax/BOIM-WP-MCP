# Gutenberg Block Development Patterns

## Overview
This guide covers common patterns and best practices for developing Gutenberg blocks in WordPress.

## Block Structure

### Basic Block Structure
```
my-block/
├── block.json          # Block metadata
├── src/
│   ├── index.js       # Block registration and edit component
│   ├── edit.js        # Edit component (optional)
│   ├── save.js        # Save component (optional)
│   ├── style.scss     # Frontend styles
│   └── editor.scss    # Editor styles
├── build/             # Compiled files (generated)
└── package.json       # Dependencies
```

### block.json Structure
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "custom/my-block",
  "version": "1.0.0",
  "title": "My Block",
  "category": "text",
  "icon": "admin-generic",
  "description": "Block description",
  "keywords": ["keyword1", "keyword2"],
  "textdomain": "textdomain",
  "supports": {
    "align": true,
    "html": false
  },
  "attributes": {
    "content": {
      "type": "string",
      "default": ""
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

## Common Patterns

### Pattern 1: Simple Text Block

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

registerBlockType( 'custom/simple-text', {
  edit: ( { attributes, setAttributes } ) => {
    const blockProps = useBlockProps();
    
    return (
      <div { ...blockProps }>
        <RichText
          tagName="p"
          value={ attributes.content }
          onChange={ ( value ) => setAttributes( { content: value } ) }
          placeholder={ __( 'Enter text...', 'textdomain' ) }
        />
      </div>
    );
  },
  
  save: ( { attributes } ) => {
    const blockProps = useBlockProps.save();
    
    return (
      <div { ...blockProps }>
        <RichText.Content tagName="p" value={ attributes.content } />
      </div>
    );
  },
} );
```

### Pattern 2: Block with Attributes

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

registerBlockType( 'custom/block-with-attributes', {
  attributes: {
    title: {
      type: 'string',
      default: '',
    },
    description: {
      type: 'string',
      default: '',
    },
  },
  
  edit: ( { attributes, setAttributes } ) => {
    const blockProps = useBlockProps();
    
    return (
      <>
        <InspectorControls>
          <PanelBody title="Settings">
            <TextControl
              label="Title"
              value={ attributes.title }
              onChange={ ( value ) => setAttributes( { title: value } ) }
            />
            <TextControl
              label="Description"
              value={ attributes.description }
              onChange={ ( value ) => setAttributes( { description: value } ) }
            />
          </PanelBody>
        </InspectorControls>
        
        <div { ...blockProps }>
          <h2>{ attributes.title || 'Enter title' }</h2>
          <p>{ attributes.description || 'Enter description' }</p>
        </div>
      </>
    );
  },
  
  save: ( { attributes } ) => {
    const blockProps = useBlockProps.save();
    
    return (
      <div { ...blockProps }>
        <h2>{ attributes.title }</h2>
        <p>{ attributes.description }</p>
      </div>
    );
  },
} );
```

### Pattern 3: Block with InnerBlocks

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

registerBlockType( 'custom/container-block', {
  edit: ( { attributes } ) => {
    const blockProps = useBlockProps( {
      className: 'custom-container',
    } );
    
    return (
      <div { ...blockProps }>
        <InnerBlocks />
      </div>
    );
  },
  
  save: ( { attributes } ) => {
    const blockProps = useBlockProps.save( {
      className: 'custom-container',
    } );
    
    return (
      <div { ...blockProps }>
        <InnerBlocks.Content />
      </div>
    );
  },
} );
```

### Pattern 4: Server-Side Render Block

```php
<?php
function register_server_side_block() {
    register_block_type( __DIR__ . '/build', array(
        'render_callback' => 'render_server_side_block',
    ) );
}
add_action( 'init', 'register_server_side_block' );

function render_server_side_block( $attributes, $content ) {
    $title = isset( $attributes['title'] ) ? esc_html( $attributes['title'] ) : '';
    $wrapper_attributes = get_block_wrapper_attributes();
    
    ob_start();
    ?>
    <div <?php echo $wrapper_attributes; ?>>
        <h2><?php echo $title; ?></h2>
        <?php echo wp_kses_post( $content ); ?>
    </div>
    <?php
    return ob_get_clean();
}
```

### Pattern 5: Block with Media Upload

```javascript
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

edit: ( { attributes, setAttributes } ) => {
    const blockProps = useBlockProps();
    
    return (
      <div { ...blockProps }>
        <MediaUploadCheck>
          <MediaUpload
            onSelect={ ( media ) => setAttributes( { 
              mediaId: media.id,
              mediaUrl: media.url 
            } ) }
            allowedTypes={ ['image'] }
            value={ attributes.mediaId }
            render={ ( { open } ) => (
              <Button onClick={ open }>
                { attributes.mediaUrl ? 'Change Image' : 'Select Image' }
              </Button>
            ) }
          />
        </MediaUploadCheck>
        { attributes.mediaUrl && (
          <img src={ attributes.mediaUrl } alt="" />
        ) }
      </div>
    );
}
```

## Best Practices

### Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Lazy load heavy components
- Minimize re-renders

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Test with screen readers

### Internationalization
- Use `@wordpress/i18n` for translations
- Use `__()`, `_e()`, `_n()`, etc.
- Provide textdomain

### Security
- Sanitize attributes in PHP
- Escape output properly
- Validate user input
- Use nonces for forms

### Styling
- Use block wrapper attributes
- Support alignment options
- Use CSS variables
- Follow WordPress styling patterns

## GenerateBlocks Compatibility

### Block Structure
- Follow GenerateBlocks block patterns
- Use GenerateBlocks spacing system
- Support GenerateBlocks styling

### Hooks
- Use GenerateBlocks hooks when available
- Extend GenerateBlocks functionality
- Test with GenerateBlocks active

### Performance
- Keep blocks lightweight
- Minimize CSS/JS output
- Use GenerateBlocks optimization

## Common Issues and Solutions

### Issue: Block not appearing in inserter
**Solution**: Check block.json name format, ensure proper registration

### Issue: Styles not loading
**Solution**: Verify editorScript and style paths in block.json

### Issue: Attributes not saving
**Solution**: Ensure attributes are defined in block.json and used correctly

### Issue: Server-side render not working
**Solution**: Check render_callback function, verify block registration

### Issue: InnerBlocks not working
**Solution**: Ensure InnerBlocks component is imported and used correctly

