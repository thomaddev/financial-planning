import { FormAction } from "@vise/kit/types"

export function mapToFrappeSchema(fields: any[]) {
  const required: string[] = []
  const excludeFieldTypes = ['Column Break', 'Section Break', 'END FORM']
  const newFields = fields.filter((field) => !excludeFieldTypes.includes(field.fieldtype))
  const properties: Record<string, any> = {}

  newFields.forEach((field) => {
    let type: any = field.fieldtype
    let options: string[] = []

    if (type === 'Link') {
      type = field.reqd === 0 ? ['string', 'null'] : 'string'
    } else if (['Data', 'Small Text', 'Long Text'].includes(type)) {
      type = field.fieldname.endsWith('_phone_number')
        ? 'string'
        : field.reqd === 0
          ? ['string', 'null']
          : 'string'
    } else if (type === 'Currency') {
      type = 'number'
    } else if (type === 'Int') {
      type = 'integer'
    } else if (type === 'Date') {
      type = 'string'
    } else if (type === 'Select') {
      type = 'string'
      options = field?.options?.split('\n') || []
    } else {
      type = 'string'
    }

    const property: Record<string, any> = { type }
    if (type === 'string' && options.length > 0) {
      property.enum = options
    } else if (field.fieldtype === 'Link') {
      property.params = { docType: field?.options }
    } else if (field.fieldtype === 'Long Text') {
      property.params = { renderType: 'textarea' }
    }

    properties[field.fieldname] = property
    if (field.reqd > 0) required.push(field.fieldname)
  })

  return { properties, required }
}

/**
 * Converts Frappe field metadata to JSON Forms UI schema.
 */
export function mapToFrappeUISchema(fields: any[], formAction: FormAction) {
  const elements: any[] = []
  let currentVerticalLayout: any = null
  let currentHorizontalLayout: any = null
  let currentSectionElements: any = null
  
  fields.forEach((field) => {
    if (field.fieldtype === 'Section Break') {
      if (currentVerticalLayout) elements.push(currentVerticalLayout)
      currentVerticalLayout = { type: 'VerticalLayout', elements: [] }
      currentHorizontalLayout = null
      currentSectionElements = currentVerticalLayout.elements
    } else if (field.fieldtype === 'Column Break') {
      if (!currentHorizontalLayout) {
        currentHorizontalLayout = { type: 'HorizontalLayout', elements: [] }
        currentSectionElements.push(currentHorizontalLayout)
      }
      currentHorizontalLayout.elements.push({ type: 'VerticalLayout', elements: [] })
    } else if (field.fieldtype !== 'END FORM') {
      const label = field.label || field.fieldname

      const options: Record<string, any> = {}
      if (field.fieldtype === 'Date') options.format = 'date'

      // ✅ set Form Action to option in uiSChema
      options.formAction = formAction

      const control = { type: 'Control', label, scope: `#/properties/${field.fieldname}`, options }

      if (currentHorizontalLayout) {
        const lastColumn =
          currentHorizontalLayout.elements[currentHorizontalLayout.elements.length - 1]
        lastColumn.elements.push(control)
      } else {
        if (!currentVerticalLayout) {
          currentVerticalLayout = { type: 'VerticalLayout', elements: [] }
          elements.push(currentVerticalLayout)
        }
        currentVerticalLayout.elements.push(control)
      }
    }
  })

  if (currentVerticalLayout && currentVerticalLayout.elements.length > 0)
    elements.push(currentVerticalLayout)
  return { type: 'VerticalLayout', elements }
}

export function getFilteredFields(
  fields: any[],
  specificSection?: string,
  excludeFields: string[] = [],
) {
  let filteredFields: any[] = []

  if (specificSection) {
    let isInSection = false

    fields.forEach((field) => {
      if (field.fieldtype === 'Section Break' && field.fieldname === specificSection) {
        isInSection = true
      } else if (field.fieldtype === 'Section Break' && isInSection) {
        isInSection = false
      }

      if (isInSection) filteredFields.push(field)
    })
  } else {
    filteredFields = fields
  }

  return filteredFields.filter((field) => !excludeFields.includes(field.fieldname))
}
