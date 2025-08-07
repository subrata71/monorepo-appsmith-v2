import noMultipleSelectors from './rules/no-multiple-selectors.js';
import apiUrlFormat from './rules/api-url-format.js';

export default {
  rules: {
    'no-multiple-selectors': noMultipleSelectors,
    'api-url-format': apiUrlFormat,
  },
};
