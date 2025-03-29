import { JsonSchema, UISchemaElement } from '@jsonforms/core'

export * from './FrappeAPI'
export * from './context'
export * from './useFrappeQuery'

export interface JsonFormProps {
  schema: JsonSchema // Required schema
  uischema: UISchemaElement // Required UI schema
  formData?: object // Initial data
  onChange?: (data: object) => void // Callback on change
}

export interface JsonFormFrappeProps {
  apiMethod: string // API method name (e.g., "vise_budget_planning.api.get_form_schema")
  formData?: object // Initial form data
  onChange?: (data: object) => void // Callback when form changes
}
