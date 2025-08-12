export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using multiple selectors with object destructuring in Zustand store calls',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noMultipleSelectors:
        'Never use object destructuring with multiple selectors in a single store call. Use separate calls for each piece of state instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        // Check if this is a call that ends with "Store" (e.g., useStore, useTodoStore, etc.)
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name.match(/use\w*Store$/)
        ) {
          // Check if the argument is a function that returns an object literal with multiple properties
          if (
            node.arguments.length === 1 &&
            node.arguments[0].type === 'ArrowFunctionExpression'
          ) {
            const returnValue = node.arguments[0].body;

            // Check for implicit return with object expression
            if (
              returnValue.type === 'ObjectExpression' &&
              returnValue.properties.length > 1
            ) {
              context.report({
                node,
                messageId: 'noMultipleSelectors',
              });
            }

            // Check for explicit return with object expression
            if (
              returnValue.type === 'BlockStatement' &&
              returnValue.body.length > 0 &&
              returnValue.body[returnValue.body.length - 1].type ===
                'ReturnStatement' &&
              returnValue.body[returnValue.body.length - 1].argument &&
              returnValue.body[returnValue.body.length - 1].argument.type ===
                'ObjectExpression' &&
              returnValue.body[returnValue.body.length - 1].argument.properties
                .length > 1
            ) {
              context.report({
                node,
                messageId: 'noMultipleSelectors',
              });
            }
          }
        }
      },
    };
  },
};
