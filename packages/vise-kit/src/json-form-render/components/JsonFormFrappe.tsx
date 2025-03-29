import React, { useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialCells } from '@jsonforms/material-renderers'
import { getFilteredFields, useFrappeMetaField } from '@vise/kit'
import { JsonSchema, UISchemaElement } from '@jsonforms/core'
import { customRenderers, mapToFrappeSchema, mapToFrappeUISchema } from '@vise/kit'
import { Skeleton } from '@mui/material'
import { FormAction } from '@vise/kit/types'
interface JsonFormFrappeProps {
  doctype: string // call by doctype name
  formData?: object // Initial form data
  onChange?: (data: object) => void // Callback when form changes
  specificSection?: string // Only Show field in this section
  excludeFields?: string[] // Exclude specific fields
  formAction?: FormAction // eg create || update ระบุ  ประเภท Form Action
}

const JsonFormFrappe: React.FC<JsonFormFrappeProps> = ({
  doctype,
  formData = {},
  onChange,
  specificSection,
  excludeFields,
  formAction,
}) => {
  const { data: metaFields, isLoading } = useFrappeMetaField(doctype)

  const filteredFields = metaFields
    ? getFilteredFields(metaFields, specificSection, excludeFields)
    : []

  const schema: JsonSchema | null = filteredFields.length ? mapToFrappeSchema(filteredFields) : null
  const uischema: UISchemaElement | null = filteredFields.length
    ? mapToFrappeUISchema(filteredFields, formAction!)
    : null

  return schema && uischema && !isLoading ? (
    <>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={customRenderers}
        cells={materialCells}
        onChange={({ data }) => {
          // setData(data)
          if (onChange) onChange(data)
        }}
      />
    </>
  ) : (
    <Skeleton />
  )
}

export default JsonFormFrappe
