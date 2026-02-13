# volto-form-fieldsets

Fieldset grouping, ordering, and conditional visibility for [volto-form-block](https://github.com/collective/volto-form-block).

## What it does

This addon extends volto-form-block (v3.14.0+) with the ability to visually group form fields into fieldsets. Editors can define fieldsets in the block sidebar, assign fields to them, drag fieldsets to control the page order, and optionally show or hide entire fieldsets based on the value of another field.

**Key features:**

- **Fieldset grouping** -- define named groups and assign fields to them
- **Drag-to-reorder** -- fieldset order in the sidebar controls render order on the page
- **Show/hide border** -- fieldsets can render as bordered groups with a legend, or as invisible wrappers (useful for standalone fields that need to sit between bordered groups)
- **Conditional fieldsets** -- show or hide an entire fieldset based on another field's value, using the same visibility conditions system that volto-form-block uses for individual fields
- **Visibility-aware validation** -- required fields inside hidden fieldsets are skipped during validation
- **Pure frontend** -- no backend changes required; fieldset data is stored as part of the block's JSON

## How it works

The addon makes four changes to the form block's configuration:

1. **Enhanced formSchema** -- adds a "Fieldsets" tab in the form block sidebar where editors manage fieldsets using Volto's ObjectListWidget (which supports drag-to-reorder out of the box)
2. **Enhanced fieldSchema** -- adds a "Fieldset" dropdown to each field's settings panel
3. **Custom FormView** (via Volto component shadowing) -- renders fields grouped by fieldset in the defined order, with optional `<fieldset>` wrapper and conditional visibility
4. **Custom Sidebar** (via Volto component shadowing) -- passes the current fieldset definitions to the field schema so the dropdown stays in sync
5. **Custom View** (via Volto component shadowing) -- skips validation for fields hidden by visibility conditions

### Data model

Fieldset definitions are stored on the block data:

```json
{
  "fieldsets": [
    { "id": "details", "title": "Your details", "show_border": true },
    { "id": "study-question", "title": "Study question", "show_border": false },
    {
      "id": "education",
      "title": "Education",
      "show_border": true,
      "visibility_conditions": [
        { "field_id": "have_you_studied", "condition": "is_equal_to", "value_condition": true }
      ]
    }
  ]
}
```

Each field (subblock) gets a `fieldset_id` property:

```json
{ "label": "Full name", "field_type": "text", "fieldset_id": "details" }
```

## Installation

### Requirements

- Plone 6 with Volto 18+
- volto-form-block 3.14.0+
- collective.volto.formsupport 3.0+ (backend)

### Frontend setup

#### 1. Install volto-form-block

In your project's `package.json`:

```json
{
  "dependencies": {
    "volto-form-block": "3.14.0"
  }
}
```

#### 2. Copy the fieldset files into your site addon

Copy the following files into your project's site addon (e.g. `volto-my-site`):

```
src/
├── customizations/
│   └── volto-form-block/
│       ├── enhancedFormSchema.js
│       ├── enhancedFieldSchema.js
│       ├── fieldset.css
│       └── components/
│           ├── FormView.jsx
│           ├── Sidebar.jsx
│           └── View.jsx
```

All fieldset-related code lives under `customizations/volto-form-block/`. The `components/` subfolder contains Volto component shadows that replace the originals. The schema files and CSS sit alongside them as part of the same customisation.

#### 3. Make volto-form-block a dependency of your site addon

In your site addon's `package.json`, add `volto-form-block` to both `addons` and `dependencies`. This ensures it loads before your addon's config runs:

```json
{
  "addons": [
    "volto-form-block"
  ],
  "dependencies": {
    "volto-form-block": "*"
  }
}
```

If you previously had `volto-form-block` in your project's `volto.config.js`, you can remove it from there.

#### 4. Update your site addon's index.js

Add the schema replacements and CSS import:

```javascript
import EnhancedFormSchema from './customizations/volto-form-block/enhancedFormSchema';
import EnhancedFieldSchema from './customizations/volto-form-block/enhancedFieldSchema';

import './customizations/volto-form-block/fieldset.css';

const applyConfig = (config) => {
  // ... your existing config ...

  // Fieldset support
  if (config.blocks.blocksConfig.form) {
    config.blocks.blocksConfig.form.formSchema = EnhancedFormSchema;
    config.blocks.blocksConfig.form.fieldSchema = EnhancedFieldSchema;
    config.blocks.blocksConfig.form._currentFieldsets = [];
  }

  return config;
};

export default applyConfig;
```

Note the `if` guard: it prevents errors if the form block hasn't loaded yet. With the `addons` dependency approach from step 3, this shouldn't happen, but it's a safe fallback.

#### 5. Install and start

```bash
yarn install
yarn start
```

### Backend setup

Install `collective.volto.formsupport` if you haven't already. No additional backend changes are needed for fieldsets -- all fieldset data is stored in the block's JSON, which Plone handles automatically.

```bash
pip install "collective.volto.formsupport[honeypot]==3.3.0"
```

Add to your `instance.yaml`:

```yaml
zcml_package_includes:
    - collective.volto.formsupport
    - collective.honeypot
```

## Usage walkthrough

### Basic fieldset grouping

1. Add a Form block to a page
2. Add your fields as usual (text, email, select, etc.)
3. In the form block sidebar, click the **Fieldsets** tab
4. Click **Add item** to create fieldsets (e.g. "Personal details", "Contact info")
5. Give each fieldset a **Title** and optionally an **ID** (auto-generated from title if left empty)
6. Click on each field in the sidebar accordion and select the appropriate **Fieldset** from the dropdown at the bottom of its settings
7. Save the page

Fields will render grouped inside bordered `<fieldset>` elements with the fieldset title as a legend.

### Controlling render order

The order of fieldsets in the sidebar list controls the order they appear on the page. Use the **drag handles** on the ObjectListWidget items to reorder fieldsets.

### Inline (borderless) fieldsets

Not every section needs a visible border. For example, a standalone checkbox between two bordered groups:

1. Create a fieldset for the checkbox (e.g. "Study question")
2. Set **Show border and title** to off
3. Assign the checkbox to this fieldset
4. Drag it between the other fieldsets in the list

The checkbox will render inline, without any wrapper, exactly where you placed the fieldset in the order.

### Conditional fieldsets

Show or hide an entire fieldset based on another field's value:

1. Create a checkbox field (e.g. "I have studied")
2. Create an "Education" fieldset
3. On the Education fieldset, click the **Show fieldset when** config icon
4. Set the condition: If "I have studied" → Is equal to → Checked
5. Assign your education-related fields to the Education fieldset

The entire Education section will appear only when the checkbox is ticked.

### Example: application form

Fieldset order:

| # | Fieldset | Show border | Condition |
|---|----------|-------------|-----------|
| 1 | Personal details | Yes | -- |
| 2 | Study question | No | -- |
| 3 | Education | Yes | "Have you studied?" is checked |
| 4 | Additional info | Yes | -- |

This renders as:

1. A bordered "Personal details" group with name and email fields
2. A standalone "Have you studied?" checkbox (no border)
3. A bordered "Education" group that appears when the checkbox is ticked
4. A bordered "Additional info" group

## Visibility-aware validation

volto-form-block's built-in validation checks all required fields regardless of whether they're currently visible. This addon fixes that with a custom `View.jsx` that skips validation for fields that are hidden due to:

- The field's own visibility conditions not being met
- The field's parent fieldset's visibility conditions not being met

This means you can safely mark fields inside a conditional fieldset as required. They'll only be validated when the fieldset is visible.

## Compatibility

| Package | Version |
|---------|---------|
| Plone | 6.0+ |
| Volto | 18.x |
| volto-form-block | 3.14.0+ |
| collective.volto.formsupport | 3.0+ |

## Technical notes

- The addon uses Volto's **component shadowing** (customizations folder) to replace `FormView`, `Sidebar`, and `View` from volto-form-block. If you're already shadowing these components, you'll need to merge the changes.
- Fieldset definitions are passed from the Sidebar to the fieldSchema via `config.blocks.blocksConfig.form._currentFieldsets`. This is set on every render of the Sidebar component.
- The existing `enableConditionalFields` config flag (default: `true`) must be enabled for both field-level and fieldset-level visibility conditions to work.
- Submitted form data is unaffected by fieldsets. The backend receives the same flat field list regardless of grouping.

## File reference

| File | Purpose |
|------|---------|
| `customizations/volto-form-block/enhancedFormSchema.js` | Adds "Fieldsets" tab to the form sidebar |
| `customizations/volto-form-block/enhancedFieldSchema.js` | Adds "Fieldset" dropdown to each field's settings |
| `customizations/volto-form-block/fieldset.css` | Minimal styling for the `<fieldset>` wrapper |
| `customizations/volto-form-block/components/FormView.jsx` | Renders fields grouped by fieldset with ordering, borders, and conditional visibility |
| `customizations/volto-form-block/components/Sidebar.jsx` | Passes fieldset definitions to the field schema |
| `customizations/volto-form-block/components/View.jsx` | Visibility-aware validation: skips required-field checks for hidden fields and fieldsets |

