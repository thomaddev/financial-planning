import { useFrappeAPI } from '@vise/kit/frappe-api'
import { BudgetPrepSetting } from '@/lib/interfaces/budget-preparation.interface'
import { Planning } from '@/lib/interfaces/planning.interface'

export const usePlanningService = () => {
  const { frappe } = useFrappeAPI()

  return {
    getPlanning: async (id: string): Promise<Planning> => {
      return frappe.callMethod(`vise_budget_planning.api.v1.planning.get_planning?id=${id}`)
    },

    savePlanning: async (data: Partial<Planning>): Promise<Planning> => {
      // Get existing data from localStorage
      const existingData = localStorage.getItem('planningData')
      const planningData = existingData ? JSON.parse(existingData) : []
      
      // Create new entry with timestamp
      const newEntry = {
        ...data,
        id: Date.now(), // Use timestamp as unique ID
        gridId: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add new entry to the array
      planningData.push(newEntry)
      
      // Save back to localStorage
      localStorage.setItem('planningData', JSON.stringify(planningData))
      
      // Return the new entry as if it was saved to the API
      return newEntry as Planning
    },

    submitPlanning: async (id: string): Promise<Planning> => {
      return frappe.callMethod(
        `vise_budget_planning.api.v1.planning.submitted_planning`,
        { id: id },
        'PUT',
      )
    },

    submitMultiPlanning: async (planning_list_id: string[]): Promise<Planning> => {
      return frappe.callMethod(
        `vise_budget_planning.api.v1.planning.submitted_muti_planning`,
        { planning_list_id: planning_list_id },
        'PUT',
      )
    },

    getBudgetPreparations: async () => {
      return frappe.callMethod('vise_budget_planning.api.v1.planning.get_budget_preparations')
    },

    getBudgetPlans: async (category: string, page: number, pageSize: number) => {
      return frappe.callMethod(
        'vise_budget_planning.api.v1.planning.get_budget_plans',
        {
          category,
          page,
          page_size: pageSize,
        },
        'GET',
      )
    },

    getBudgetPrepSetting: async (): Promise<BudgetPrepSetting | null> => {
      try {
        return await frappe.callMethod(
          'vise_budget_planning.api.v1.planning.get_budget_preparation_setting',
        )
      } catch (error) {
        console.error('Failed to fetch BudgetPrepSetting:', error)
        return null
      }
    },
  }
}
