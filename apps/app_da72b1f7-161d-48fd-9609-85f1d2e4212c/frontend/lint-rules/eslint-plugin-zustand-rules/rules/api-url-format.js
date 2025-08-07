/**
 * @fileoverview ESLint rule to enforce correct API URL patterns
 * @author Claude
 */

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce correct API URL patterns',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noApiV1Prefix:
        'Remove "/api/v1" prefix from API URL. The base URL is already configured.',
      useSlashInsteadOfDash:
        'Use forward slashes (/) instead of dashes (-) in API URLs for better REST conventions.',
    },
  },

  create(context) {
    /**
     * Check if a node is an API method call (api.get, api.post, etc.)
     */
    function isApiMethodCall(node) {
      return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'api' &&
        ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(
          node.callee.property.name
        )
      );
    }

    /**
     * Get the URL string from the first argument of the API call
     */
    function getUrlFromApiCall(node) {
      if (node.arguments.length === 0) return null;

      const firstArg = node.arguments[0];
      if (firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
        return { url: firstArg.value, type: 'literal' };
      }
      if (firstArg.type === 'TemplateLiteral') {
        if (firstArg.quasis.length === 1) {
          // Simple template literal without interpolation
          return {
            url: firstArg.quasis[0].value.cooked,
            type: 'template-simple',
          };
        } else {
          // Template literal with interpolation - check the first part
          const firstPart = firstArg.quasis[0].value.cooked;
          return { url: firstPart, type: 'template-complex', node: firstArg };
        }
      }
      return null;
    }

    /**
     * Check if URL has any forbidden prefixes
     */
    function hasForbiddenPrefix(url) {
      // Static prefixes
      const staticPrefixes = ['/api/', '/api', 'api/', 'api'];

      // Version pattern prefixes (v1, v2, v3, v10, etc.)
      const versionPrefixes = ['/api/v', 'api/v', '/v', 'v'];

      // Check static prefixes
      const hasStaticPrefix = staticPrefixes.some(prefix => {
        if (prefix.endsWith('/')) {
          return url.startsWith(prefix);
        } else {
          return (
            url === prefix ||
            url.startsWith(prefix + '/') ||
            url.startsWith(prefix + '?')
          );
        }
      });

      if (hasStaticPrefix) return true;

      // Check version prefixes (more flexible pattern matching)
      return versionPrefixes.some(prefix => {
        if (url.startsWith(prefix)) {
          const remaining = url.substring(prefix.length);
          // Check if it matches version pattern: v1, v2, v3, v10, etc.
          return /^(\d+)(\/.*|$|\?.*$)/.test(remaining);
        }
        return false;
      });
    }

    /**
     * Fix URL by removing all forbidden prefixes and converting dashes to slashes
     */
    function fixUrl(url) {
      let fixed = url;

      // Static prefixes to remove
      const staticPrefixes = ['/api/', '/api', 'api/', 'api'];

      // Version prefixes patterns with improved regex to capture a remaining path
      const versionPrefixes = [
        { pattern: '/api/v', regex: /^\/api\/v\d+(\/.*)?(\?.*)?$/ },
        { pattern: 'api/v', regex: /^api\/v\d+(\/.*)?(\?.*)?$/ },
        { pattern: '/v', regex: /^\/v\d+(\/.*)?(\?.*)?$/ },
        { pattern: 'v', regex: /^v\d+(\/.*)?(\?.*)?$/ },
      ];

      // Check and remove version prefixes first (more specific)
      for (const { pattern, regex } of versionPrefixes) {
        if (regex.test(fixed)) {
          // Use the regex to extract the remaining path directly
          const match = fixed.match(regex);
          if (match) {
            const pathPart = match[1] || ''; // Captured path part (e.g., '/users')
            const queryPart = match[2] || ''; // Captured query part (e.g., '?id=123')

            if (pathPart) {
              fixed = pathPart + queryPart;
            } else if (queryPart) {
              fixed = '/' + queryPart;
            } else {
              fixed = '/';
            }
            break;
          }
        }
      }

      // If no version prefix was found, check static prefixes
      if (fixed === url) {
        // Sort by length descending to handle longer prefixes first
        const sortedPrefixes = staticPrefixes.sort(
          (a, b) => b.length - a.length
        );

        for (const prefix of sortedPrefixes) {
          if (prefix.endsWith('/')) {
            if (fixed.startsWith(prefix)) {
              fixed = fixed.substring(prefix.length);
              break;
            }
          } else {
            if (fixed === prefix) {
              fixed = '';
              break;
            } else if (fixed.startsWith(prefix + '/')) {
              fixed = fixed.substring(prefix.length + 1);
              break;
            } else if (fixed.startsWith(prefix + '?')) {
              fixed = fixed.substring(prefix.length);
              break;
            }
          }
        }
      }

      // Ensure it starts with /
      if (!fixed.startsWith('/')) {
        fixed = '/' + fixed;
      }

      // Handle edge case where we end up with just '/'
      if (fixed === '/') {
        fixed = '/';
      }

      // Convert dashes to slashes (but not in query parameters or fragments)
      // Split on both query (?) and fragment (#) markers
      const [path, ...rest] = fixed.split(/([?#])/);
      const fixedPath = path.replace(/-/g, '/');
      fixed = fixedPath + rest.join('');

      return fixed;
    }

    return {
      CallExpression(node) {
        if (!isApiMethodCall(node)) return;

        const urlData = getUrlFromApiCall(node);
        if (!urlData) return;

        const { url, type } = urlData;
        const hasForbiddenPrefixFound = hasForbiddenPrefix(url);
        const hasDashInPath = url.split('?')[0].includes('-');

        if (hasForbiddenPrefixFound || hasDashInPath) {
          const fixedUrl = fixUrl(url);

          let messageId;
          if (hasForbiddenPrefixFound && hasDashInPath) {
            messageId = 'noApiV1Prefix'; // Primary issue
          } else if (hasForbiddenPrefixFound) {
            messageId = 'noApiV1Prefix';
          } else {
            messageId = 'useSlashInsteadOfDash';
          }

          context.report({
            node: node.arguments[0],
            messageId,
            fix(fixer) {
              const firstArg = node.arguments[0];

              if (type === 'literal') {
                return fixer.replaceText(firstArg, `'${fixedUrl}'`);
              }

              if (type === 'template-simple') {
                return fixer.replaceText(firstArg, `'${fixedUrl}'`);
              }

              if (type === 'template-complex') {
                // For template literals with interpolation, fix only the first quasi
                const templateLiteral = urlData.node;
                const firstQuasi = templateLiteral.quasis[0];
                const fixedFirstPart = fixUrl(firstQuasi.value.cooked);

                // Get the source text and use AST-based replacement to avoid duplicate matches
                const sourceCode = context.getSourceCode();
                const templateText = sourceCode.getText(templateLiteral);
                const originalFirstPart = firstQuasi.value.cooked;

                // Calculate exact positions within template literal to avoid wrong replacements
                const templateStart = templateLiteral.range[0];
                const firstQuasiStart = firstQuasi.range[0] - templateStart;
                const firstQuasiEnd =
                  firstQuasiStart + originalFirstPart.length;

                // Reconstruct template by replacing only the exact first quasi part
                const before = templateText.substring(0, firstQuasiStart + 1); // +1 for opening backtick
                const after = templateText.substring(firstQuasiEnd + 1); // Skip the quasi content
                const updatedTemplate = before + fixedFirstPart + after;

                return fixer.replaceText(templateLiteral, updatedTemplate);
              }

              return null;
            },
          });
        }
      },
    };
  },
};

export default rule;
