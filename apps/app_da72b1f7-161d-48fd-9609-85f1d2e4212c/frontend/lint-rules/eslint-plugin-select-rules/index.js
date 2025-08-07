/**
 * @fileoverview ESLint plugin for Select component rules
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const noEmptySelectItemValue = require('./rules/no-empty-select-item-value');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    name: 'eslint-plugin-select-rules',
    version: '1.0.0',
  },
  rules: {
    'no-empty-select-item-value': noEmptySelectItemValue,
  },
  configs: {
    recommended: {
      plugins: ['select-rules'],
      rules: {
        'select-rules/no-empty-select-item-value': 'error',
      },
    },
  },
};
