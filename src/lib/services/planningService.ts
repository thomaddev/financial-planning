import { useFrappeAPI } from '@vise/kit/frappe-api'
import { BudgetPrepSetting } from '@/lib/interfaces/budget-preparation.interface'
import { Planning } from '@/lib/interfaces/planning.interface'
import mockData from '@/data/mock_board.json'

export const usePlanningService = () => {
  const { frappe } = useFrappeAPI()

  return {
    getPlanning: async (id: string): Promise<Planning> => {
      // First check localStorage
      if (typeof window !== 'undefined') {
        try {
          const storedData = localStorage.getItem('planningData')
          if (storedData) {
            const parsedData = JSON.parse(storedData)
            const planningItem = parsedData.data.find((item: any) => item.record_name === id)
            if (planningItem) {
              return planningItem as Planning
            }
          }
        } catch (error) {
          console.error('Error reading from localStorage:', error)
        }
      }

      return {} as Planning
    },

    savePlanning: async (data: Partial<Planning>): Promise<Planning> => {
      // Get existing merged data from getPlanningData
      const currentData = getPlanningData()
      
      // Create new entry with timestamp
      const newEntry = {
        ...data,
        id: Date.now(), // Use timestamp as unique ID
        gridId: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        record_name: data.strategy,
        docstatus: 0,
        category: data.template_type === 'Revenue Planning' || data.template_type === 'Revenue Allocate Planning' ? 'revenue' : data.template_type ,
        template_type: data.template_type === 'Revenue Planning' || data.template_type === 'Revenue Allocate Planning' ? 'revenue' : data.template_type ,
      }
      
      // Add or update entry in the data array
      const updatedData = {
        ...currentData,
        data: currentData.data.map(item => 
          item.record_name === newEntry.record_name ? newEntry : item
        )
      }
      
      // If item wasn't found in map (new item), add it to the array
      if (!updatedData.data.some(item => item.record_name === newEntry.record_name)) {
        updatedData.data.push(newEntry)
      }
      
      // Recalculate category counts
      const categoryCounts = updatedData.data.reduce(
        (acc: any, item: any) => {
          if (item.category === 'revenue') acc.revenue_count++
          else if (item.category === 'expense') acc.expense_count++
          else if (item.category === 'project') acc.project_count++
          return acc
        },
        { revenue_count: 0, expense_count: 0, project_count: 0 }
      )
      
      // Update the final data structure
      const finalData = {
        ...updatedData,
        ...categoryCounts,
        total: updatedData.data.length
      }
      
      // Save to localStorage
      localStorage.setItem('planningData', JSON.stringify(finalData))
      
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

export const getPlanningData = (mockData?: any) => {
  if (typeof window === 'undefined') return mockData

  try {
    // if localStorage.getItem('planningData') is null, set it to mockData
    if (!localStorage.getItem('planningData')) {
      localStorage.setItem('planningData', JSON.stringify(mockData))
    }
    // Get stored planning data from localStorage
    const storedData = localStorage.getItem('planningData')
    const parsedStoredData = storedData ? JSON.parse(storedData) : { data: [] }
    // Create a map of existing items by their unique identifier
    const existingItemsMap = new Map(
      parsedStoredData.data.map((item: any) => [item.record_name, item])
    )

    // Merge mock data with stored data, preferring stored data when available
    const mergedData = mockData.data.map((item: any) => {
      const storedItem = existingItemsMap.get(item.record_name)
      return storedItem || item
    })

    // Add any new items from localStorage that aren't in mock data
    parsedStoredData.data.forEach((storedItem: any) => {
      const exists = mergedData.some(
        (item: any) => item.record_name === storedItem.record_name
      )
      if (!exists) {
        mergedData.push(storedItem)
      }
    })

    // Calculate counts for different categories
    const categoryCounts = mergedData.reduce(
      (acc: any, item: any) => {
        if (item.category === 'revenue') acc.revenue_count++
        else if (item.category === 'expense') acc.expense_count++
        else if (item.category === 'project') acc.project_count++
        return acc
      },
      { revenue_count: 0, expense_count: 0, project_count: 0 }
    )

    // Return data in the same structure as mockData
    return {
      data: mergedData,
      total: mergedData.length,
      ...categoryCounts,
      page: mockData.page,
      page_size: mockData.page_size
    }
  } catch (error) {
    console.error('Error merging planning data:', error)
    return mockData
  }
}
