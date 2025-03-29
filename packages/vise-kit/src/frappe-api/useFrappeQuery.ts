import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { useFrappeAPI } from '@vise/kit/frappe-api'

/** Fetch Documents (with caching & auto-refetching) */
export function useFrappeDocs(
  doctype: string,
  filters?: Array<[string, string, string]>,
  params?: string[],
  options?: { enabled?: boolean },
) {
  const { frappe } = useFrappeAPI()

  return useQuery({
    queryKey: ['frappe', 'docs', doctype],
    queryFn: () => frappe.getDocs(doctype, params, JSON.stringify(filters)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled,
  })
}

export function useFrappeDocsMutation(doctype: string, params?: string[]) {
  const { frappe } = useFrappeAPI()

  return useMutation({
    mutationFn: () => frappe.getDocs(doctype, params),
  })
}

/** Fetch a Single Document */
export function useFrappeDoc(
  doctype: string,
  name: string,
  options?: { enabled?: boolean }, // ✅ Accept enabled as an optional parameter
) {
  const { frappe } = useFrappeAPI()

  return useQuery({
    queryKey: ['frappe', 'doc', doctype, name],
    queryFn: () => frappe.getDoc(doctype, name),
    enabled: options?.enabled ?? !!name, // ✅ Use provided 'enabled' option or default to `!!name`
  })
}

/** Create a New Document */
export function useCreateFrappeDoc(doctype: string) {
  const { frappe } = useFrappeAPI()

  return useMutation({
    mutationFn: (data: object) => frappe.createDoc(doctype, data),
  })
}

/** Update an Existing Document */
export function useUpdateFrappeDoc(doctype: string, name: string) {
  const { frappe } = useFrappeAPI()

  return useMutation({
    mutationFn: (data: object) => frappe.updateDoc(doctype, name, data),
  })
}

/** Delete a Document */
export function useDeleteFrappeDoc(doctype: string, name: string) {
  const { frappe } = useFrappeAPI()

  return useMutation({
    mutationFn: () => frappe.deleteDoc(doctype, name),
  })
}

/**
 * Hook for fetching data from a Frappe method.
 *
 * Automatically fetches data when the component mounts and caches results for better performance.
 * Ideal for `GET` requests that need to be fetched automatically on page load.
 *
 * @param {string} methodPath - The Frappe API method path (e.g., "vise_budget_planning.api.get_budget_plans").
 * @param {"GET" | "POST"} method - The HTTP method to use (default: "GET").
 * @param {object} params - The parameters to send with the request (default: `{}`).
 *
 * @returns {object} React Query's `useQuery` result containing:
 *  - `data` - The fetched data from the Frappe API.
 *  - `isLoading` - Boolean indicating if the request is in progress.
 *  - `error` - Contains error details if the request fails.
 */
export function useFrappeQuery(
  methodPath: string,
  method: 'GET' | 'POST' = 'GET',
  params: object = {},
) {
  const { frappe } = useFrappeAPI()

  return useQuery({
    queryKey: ['frappe-method', methodPath, params],
    queryFn: async () => {
      return frappe.callMethod(methodPath, params, method)
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
  })
}

/**
 * Hook for manually calling a Frappe method.
 *
 * Best for `POST`, `PUT`, `DELETE`, or other **user-triggered** actions (e.g., button clicks).
 * Unlike `useFrappeQuery`, this does **not** run automatically and must be called via `mutate()`.
 *
 * @param {string} methodPath - The Frappe API method path (e.g., "vise_budget_planning.api.create_budget").
 * @param {"GET" | "POST"} method - The HTTP method to use (default: "GET").
 *
 * @returns {object} React Query's `useMutation` result containing:
 *  - `mutate` - Function to trigger the API call manually.
 *  - `isPending` - Boolean indicating if the request is in progress.
 *  - `error` - Contains error details if the request fails.
 */
export function useFrappeMethod(methodPath: string, method: 'GET' | 'POST' = 'GET') {
  const { frappe } = useFrappeAPI()
  return useMutation({
    mutationFn: async (params: object = {}) => {
      return frappe.callMethod(methodPath, params, method)
    },
  })
}

/**
 * Hook to fetch meta fields of a specific Frappe DocType.
 *
 * @param {string} doctype - The Frappe DocType to fetch meta information for.
 *
 * @returns {object} React Query's `useQuery` result containing:
 *  - `data` - The fetched meta field data.
 *  - `isLoading` - Boolean indicating if the request is in progress.
 *  - `error` - Contains error details if the request fails.
 */
export function useFrappeMetaField(doctype: string) {
  const { frappe } = useFrappeAPI()
  return useQuery({
    queryKey: ['frappe-meta-field', doctype], // Unique cache key
    queryFn: async () => {
      return frappe.getMetaField(doctype)
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  })
}
