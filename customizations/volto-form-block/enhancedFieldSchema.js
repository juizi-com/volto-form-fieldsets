/**
 * Enhanced fieldSchema
 *
 * Wraps the original volto-form-block fieldSchema and adds a
 * "Fieldset" dropdown to each field's settings. This lets editors
 * assign individual fields to a fieldset defined in the form settings.
 *
 * The fieldset choices are read from the block data stored in the
 * Volto registry at runtime via a custom widget.
 */
import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import OriginalFieldSchema from 'volto-form-block/fieldSchema';

const messages = defineMessages({
  fieldset_assignment: {
    id: 'form_field_fieldset',
    defaultMessage: 'Fieldset',
  },
  fieldset_assignment_description: {
    id: 'form_field_fieldset_description',
    defaultMessage:
      'Assign this field to a fieldset.',
  },
});

const EnhancedFieldSchema = (props) => {
  var intl = useIntl();
  const originalSchema = OriginalFieldSchema(props);

  // Build choices from the fieldsets defined in the form block data.
  const fieldsetChoices =
    (config.blocks.blocksConfig.form._currentFieldsets || []).map((fs) => [
      fs.id,
      fs.title,
    ]);

  return {
    ...originalSchema,
    fieldsets: [
      {
        ...originalSchema.fieldsets[0],
        fields: [...originalSchema.fieldsets[0].fields, 'fieldset_id'],
      },
      ...originalSchema.fieldsets.slice(1),
    ],
    properties: {
      ...originalSchema.properties,
      fieldset_id: {
        title: intl.formatMessage(messages.fieldset_assignment),
        description: intl.formatMessage(
          messages.fieldset_assignment_description,
        ),
        type: 'string',
        choices: fieldsetChoices,
      },
    },
  };
};

export default EnhancedFieldSchema;
