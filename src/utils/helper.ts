import { TEMPLATE_DOCTYPE } from '@/data'
import { v4 as uuidv4 } from 'uuid'

export function generateInitialMontly(initialData?: any) {
  return {
    october: 0,
    november: 0,
    december: 0,
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0,
    year_5: 0,
    ...initialData,
  }
}

export function getRandomId() {
  const uniqueId = uuidv4()
  return uniqueId
}

export function findRoutePathFromTemplateDoctype(value: string) {
  return Object.keys(TEMPLATE_DOCTYPE).find((key) => TEMPLATE_DOCTYPE[key] === value)
}

export function getCoordinates(geoJson) {
  if (!geoJson || typeof geoJson !== 'object') {
    return []
  }

  if (
    geoJson.type === 'FeatureCollection' &&
    Array.isArray(geoJson.features) &&
    geoJson.features.length > 0
  ) {
    const feature = geoJson.features[0]

    if (
      feature.geometry &&
      feature.geometry.type === 'Point' &&
      Array.isArray(feature.geometry.coordinates) &&
      feature.geometry.coordinates.length === 2
    ) {
      const [lng, lat] = feature.geometry.coordinates
      return [lat, lng]
    }
  }

  return []
}

export function convertParamsMaster(params) {
  // Define standard keys that should not be transformed
  const standardKeys = new Set(['company', 'cost_center'])
  function transform(obj: any, keyName: string = ''): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => transform(item, keyName)) // Recursively process array elements
    } else if (typeof obj === 'object' && obj !== null) {
      // Handle 'template_link_detail' specially
      if (keyName === 'template_link_detail') {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => {
            if (
              key === 'fund_account' &&
              typeof value === 'object' &&
              value !== null &&
              'name' in value &&
              'title' in value
            ) {
              return [key, (value as { name: string }).name] // Type assertion for fund_account
            }
            return [key, value] // Keep other fields as is
          }),
        )
      }
      // Skip transformation for standard keys
      if (standardKeys.has(keyName)) {
        return obj.name // คงค่าเดิมของ 'company' และ 'cost_center'
      }
      // Check if the object contains 'name' and 'title' keys
      if ('name' in obj && 'title' in obj) {
        return obj.name // Type assertion for name
      }
      // Otherwise, recursively process all keys
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, transform(value, key)]),
      )
    }
    return obj // Return primitive values as they are
  }

  return transform(params)
}

/**
 * Generates a reusable test attribute for Playwright or other testing frameworks.
 *
 * This function helps standardize `data-test-id` or any other test attributes across components,
 * making it easier to update the attribute name in one place.
 *
 * @param {string} name - The unique identifier for the test attribute.
 * @param {string} [attr='data-test-id'] - The attribute name (default is 'data-test-id').
 * @returns {object} - An object containing the test attribute `{ data-test-id: name }`
 *
 * @example
 * // Default usage with 'data-test-id'
 * <button {...getDataTestAttr('submit-button')}>Submit</button>
 * // Output: <button data-test-id="submit-button">Submit</button>
 *
 * @example
 * // Custom test attribute
 * <button {...getDataTestAttr('submit-button', 'data-cy')}>Submit</button>
 * // Output: <button data-cy="submit-button">Submit</button>
 */
export function getDataTestAttr(name: string, attr: string = 'data-testid') {
  return { [attr]: `${name}` }
}

export const convertProcedureTaskToGantt = (tasks) => {
  return tasks.map((task) => {
    return {
      id: task.name,
      text: task.text,
      start_date: task.start_date,
      duration: task.duration,
      progress: task.progress,
    }
  })
}
