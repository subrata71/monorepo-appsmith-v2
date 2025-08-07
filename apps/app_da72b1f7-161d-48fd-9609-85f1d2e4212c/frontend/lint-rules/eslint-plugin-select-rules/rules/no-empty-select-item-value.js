/**
 * @fileoverview Rule to prevent empty string values in SelectItem components
 * @author ESLint Plugin Select Rules
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow empty string values in SelectItem components',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      emptySelectItemValue:
        'SelectItem value prop cannot be an empty string. Use undefined for no selection or provide a meaningful value.',
    },
  },

  create(context) {
    return {
      JSXElement(node) {
        // Check if this is a SelectItem component
        if (
          node.openingElement.name &&
          node.openingElement.name.type === 'JSXIdentifier' &&
          node.openingElement.name.name === 'SelectItem'
        ) {
          // Find the value prop
          const valueProp = node.openingElement.attributes.find(
            attr =>
              attr.type === 'JSXAttribute' &&
              attr.name &&
              attr.name.name === 'value'
          );

          if (valueProp && valueProp.value) {
            // Check if value is an empty string literal
            if (
              valueProp.value.type === 'Literal' &&
              valueProp.value.value === ''
            ) {
              context.report({
                node: valueProp,
                messageId: 'emptySelectItemValue',
                fix(fixer) {
                  return fixer.replaceText(
                    valueProp.value,
                    '{undefined as unknown as string}'
                  );
                },
              });
            }

            // Check if value is an empty string in JSX expression
            if (
              valueProp.value.type === 'JSXExpressionContainer' &&
              valueProp.value.expression.type === 'Literal' &&
              valueProp.value.expression.value === ''
            ) {
              context.report({
                node: valueProp,
                messageId: 'emptySelectItemValue',
                fix(fixer) {
                  return fixer.replaceText(
                    valueProp.value,
                    '{undefined as unknown as string}'
                  );
                },
              });
            }

            // Check if value is a template literal that evaluates to empty string
            if (
              valueProp.value.type === 'JSXExpressionContainer' &&
              valueProp.value.expression.type === 'TemplateLiteral' &&
              valueProp.value.expression.quasis.length === 1 &&
              valueProp.value.expression.quasis[0].value.raw === ''
            ) {
              context.report({
                node: valueProp,
                messageId: 'emptySelectItemValue',
                fix(fixer) {
                  return fixer.replaceText(
                    valueProp.value,
                    '{undefined as unknown as string}'
                  );
                },
              });
            }
          }
        }
      },
    };
  },
};
