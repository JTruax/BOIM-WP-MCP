/**
 * WordPress Coding Standards
 * 
 * Provides validation and formatting utilities for WordPress code
 * following WordPress Coding Standards.
 */

export interface CodeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * WordPress PHP Coding Standards
 */
export class WordPressStandards {
  /**
   * Validate PHP code against WordPress coding standards
   */
  static validatePHP(code: string): CodeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for proper opening PHP tag
    if (!code.trim().startsWith('<?php')) {
      warnings.push('Code should start with <?php tag (not <?)');
    }

    // Check for closing PHP tag (should be omitted in plugin/theme files)
    if (code.trim().endsWith('?>')) {
      warnings.push('Closing PHP tag ?> should be omitted at end of file');
    }

    // Check for proper indentation (tabs, not spaces)
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith(' ') && line.trim().length > 0) {
        warnings.push(`Line ${index + 1}: Use tabs for indentation, not spaces`);
      }
    });

    // Check for WordPress function naming conventions
    const functionRegex = /function\s+([a-z_][a-z0-9_]*)\s*\(/gi;
    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      const funcName = match[1];
      if (!funcName.match(/^[a-z_][a-z0-9_]*$/)) {
        errors.push(`Function name "${funcName}" should be lowercase with underscores`);
      }
    }

    // Check for proper sanitization
    if (code.includes('$_GET') || code.includes('$_POST') || code.includes('$_REQUEST')) {
      if (!code.includes('sanitize_') && !code.includes('wp_unslash')) {
        errors.push('User input should be sanitized using sanitize_* functions');
      }
    }

    // Check for proper escaping
    if (code.includes('echo') || code.includes('print')) {
      if (!code.includes('esc_html') && !code.includes('esc_attr') && 
          !code.includes('esc_url') && !code.includes('esc_textarea') &&
          !code.includes('wp_kses')) {
        warnings.push('Output should be escaped using esc_* functions');
      }
    }

    // Check for nonces
    if (code.includes('wp_insert_post') || code.includes('wp_update_post') || 
        code.includes('delete_post') || code.includes('update_option')) {
      if (!code.includes('wp_verify_nonce') && !code.includes('check_admin_referer')) {
        warnings.push('Form submissions should include nonce verification');
      }
    }

    // Check for capability checks
    if (code.includes('wp_insert_post') || code.includes('wp_update_post') || 
        code.includes('delete_post') || code.includes('update_option')) {
      if (!code.includes('current_user_can')) {
        warnings.push('Operations should check user capabilities');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate JavaScript code against WordPress coding standards
   */
  static validateJavaScript(code: string): CodeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for jQuery usage (should use vanilla JS or modern frameworks)
    if (code.includes('jQuery') && !code.includes('wp_enqueue_script')) {
      warnings.push('jQuery should be properly enqueued via wp_enqueue_script');
    }

    // Check for proper variable naming (camelCase)
    const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      const varName = match[1];
      if (varName.includes('_') && varName === varName.toUpperCase()) {
        // Constants are OK
        continue;
      }
      if (varName.includes('_') && varName[0] === varName[0].toLowerCase()) {
        suggestions.push(`Variable "${varName}" should use camelCase instead of snake_case`);
      }
    }

    // Check for console.log (should be removed in production)
    if (code.includes('console.log')) {
      warnings.push('console.log should be removed in production code');
    }

    // Check for proper localization
    if (code.includes('alert(') || code.includes('confirm(')) {
      warnings.push('User-facing strings should be localized using wp.i18n');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate CSS code against WordPress coding standards
   */
  static validateCSS(code: string): CodeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for !important (should be avoided)
    if (code.includes('!important')) {
      warnings.push('Avoid using !important unless absolutely necessary');
    }

    // Check for vendor prefixes (should use autoprefixer)
    const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
    vendorPrefixes.forEach(prefix => {
      if (code.includes(prefix)) {
        suggestions.push(`Consider using autoprefixer instead of manual vendor prefixes`);
      }
    });

    // Check for proper selector naming (BEM or similar)
    const classRegex = /\.([a-z][a-z0-9-_]*)/g;
    let match;
    while ((match = classRegex.exec(code)) !== null) {
      const className = match[1];
      if (className.includes('__') || className.includes('--')) {
        // BEM notation is good
        continue;
      }
      if (className.includes('-') && className.split('-').length > 2) {
        suggestions.push(`Consider using BEM notation for class "${className}"`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Format PHP code according to WordPress standards
   */
  static formatPHP(code: string): string {
    // Basic formatting - convert spaces to tabs for indentation
    const lines = code.split('\n');
    const formatted = lines.map(line => {
      if (line.trim().length === 0) {
        return '';
      }
      
      // Count leading spaces
      const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length || 0;
      if (leadingSpaces > 0) {
        // Convert 4 spaces to 1 tab (WordPress standard)
        const tabs = Math.floor(leadingSpaces / 4);
        const remainingSpaces = leadingSpaces % 4;
        return '\t'.repeat(tabs) + ' '.repeat(remainingSpaces) + line.trimStart();
      }
      
      return line;
    });

    // Remove closing PHP tag if present
    let result = formatted.join('\n');
    if (result.trim().endsWith('?>')) {
      result = result.trim().slice(0, -2).trimEnd();
    }

    return result;
  }

  /**
   * Add proper sanitization to user input
   */
  static addSanitization(code: string, inputVar: string, type: 'text' | 'url' | 'email' | 'int' | 'float' = 'text'): string {
    const sanitizeFunctions = {
      text: 'sanitize_text_field',
      url: 'sanitize_url',
      email: 'sanitize_email',
      int: 'sanitize_text_field',
      float: 'sanitize_text_field',
    };

    const func = sanitizeFunctions[type];
    return code.replace(
      new RegExp(`\\$${inputVar}(?!\\s*=.*sanitize)`, 'g'),
      `${func}($${inputVar})`
    );
  }

  /**
   * Add proper escaping to output
   */
  static addEscaping(code: string, outputVar: string, type: 'html' | 'attr' | 'url' | 'textarea' = 'html'): string {
    const escapeFunctions = {
      html: 'esc_html',
      attr: 'esc_attr',
      url: 'esc_url',
      textarea: 'esc_textarea',
    };

    const func = escapeFunctions[type];
    return code.replace(
      new RegExp(`echo\\s+\\$${outputVar}`, 'g'),
      `echo ${func}($${outputVar})`
    );
  }
}

