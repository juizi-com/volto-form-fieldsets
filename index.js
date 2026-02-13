/**
 * volto-test-site addon config
 *
 * Extends volto-form-block with fieldset grouping support.
 * See src/customizations/volto-form-block/ for the schema extensions
 * and component overrides.
 */
import EnhancedFormSchema from './customizations/volto-form-block/enhancedFormSchema';
import EnhancedFieldSchema from './customizations/volto-form-block/enhancedFieldSchema';

import './customizations/volto-form-block/fieldset.css';

const applyConfig = (config) => {
  config.settings = {
    ...config.settings,
    isMultilingual: false,
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
  };

  // Fieldset support: replace form and field schemas
  if (config.blocks.blocksConfig.form) {
    config.blocks.blocksConfig.form.formSchema = EnhancedFormSchema;
    config.blocks.blocksConfig.form.fieldSchema = EnhancedFieldSchema;
    config.blocks.blocksConfig.form._currentFieldsets = [];
  }

  return config;
};

export default applyConfig;
