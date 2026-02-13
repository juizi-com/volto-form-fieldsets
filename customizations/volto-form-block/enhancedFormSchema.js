/**
 * Enhanced formSchema
 *
 * Wraps the original volto-form-block formSchema and adds a "Fieldsets"
 * tab in the sidebar where editors can define fieldset groups.
 *
 * Fieldsets are stored as `data.fieldsets` — an array of objects managed
 * by the Volto ObjectListWidget:
 *   [{ id: 'contact', title: 'Contact Details', show_border: true }, ...]
 *
 * The `id` is auto-generated from the title for convenience.
 */
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import OriginalFormSchema from 'volto-form-block/formSchema';

const messages = defineMessages({
  fieldsets_tab: {
    id: 'form_fieldsets_tab',
    defaultMessage: 'Fieldsets',
  },
  fieldsets_title: {
    id: 'form_fieldsets_title',
    defaultMessage: 'Fieldsets',
  },
  fieldsets_description: {
    id: 'form_fieldsets_description',
    defaultMessage:
      'Define fieldsets to organise and order your form fields. Drag to reorder. Every field must be assigned to a fieldset. Disable "Show border" for sections that should render without a visible group wrapper.',
  },
  fieldset_title: {
    id: 'form_fieldset_title',
    defaultMessage: 'Title',
  },
  fieldset_id: {
    id: 'form_fieldset_id',
    defaultMessage: 'ID',
  },
  fieldset_id_description: {
    id: 'form_fieldset_id_description',
    defaultMessage:
      'A unique identifier for this fieldset. Auto-generated from title if left empty.',
  },
  fieldset_show_border: {
    id: 'form_fieldset_show_border',
    defaultMessage: 'Show border and title',
  },
  fieldset_show_border_description: {
    id: 'form_fieldset_show_border_description',
    defaultMessage:
      'When enabled, fields are wrapped in a visible bordered group with the title as a legend. When disabled, fields render inline without any wrapper.',
  },
  fieldset_visibility: {
    id: 'form_fieldset_visibility',
    defaultMessage: 'Show fieldset when',
  },
});

const FieldsetItemSchema = (intl) => ({
  title: 'Fieldset',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'id', 'show_border', 'visibility_conditions'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.fieldset_title),
      type: 'string',
    },
    id: {
      title: intl.formatMessage(messages.fieldset_id),
      description: intl.formatMessage(messages.fieldset_id_description),
      type: 'string',
    },
    show_border: {
      title: intl.formatMessage(messages.fieldset_show_border),
      description: intl.formatMessage(messages.fieldset_show_border_description),
      type: 'boolean',
      default: true,
    },
    visibility_conditions: {
      title: intl.formatMessage(messages.fieldset_visibility),
      widget: 'visibility_conditions_widget',
    },
  },
  required: ['title'],
});

const EnhancedFormSchema = (data) => {
  var intl = useIntl();
  const originalSchema = OriginalFormSchema(data);

  return {
    ...originalSchema,
    fieldsets: [
      ...originalSchema.fieldsets,
      {
        id: 'fieldsets',
        title: intl.formatMessage(messages.fieldsets_tab),
        fields: ['fieldsets'],
      },
    ],
    properties: {
      ...originalSchema.properties,
      fieldsets: {
        title: intl.formatMessage(messages.fieldsets_title),
        description: intl.formatMessage(messages.fieldsets_description),
        widget: 'object_list',
        schema: FieldsetItemSchema(intl),
      },
    },
  };
};

export default EnhancedFormSchema;
