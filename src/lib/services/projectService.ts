import { useFrappeAPI } from '@vise/kit/frappe-api'
import { Project } from '@/lib/interfaces/project.interface'

export const useProjectService = () => {
  const { frappe } = useFrappeAPI()

  return {
    getProject: async (id: string): Promise<Project | null> => {
      try {
        return await frappe.callMethod(
          `vise_budget_planning.api.v1.planning.get_project_planning?id=${id}`,
        )
      } catch (error) {
        console.error('Failed to fetch project:', error)
        return null
      }
    },

    getProjectByMutation: async (id: string): Promise<Project | null> => {
      try {
        return await frappe.callMethod(
          `vise_budget_planning.api.v1.planning.get_project_planning`,
          { project_id: id },
          'GET',
        )
      } catch (error) {
        console.error('Failed to fetch project:', error)
        return null
      }
    },

    saveProject: async (data: Partial<Project>): Promise<Project | null> => {
      try {
        return await frappe.callMethod(
          'vise_budget_planning.api.v1.planning.save_project',
          data,
          'PUT',
        )
      } catch (error) {
        console.error('Failed to save project:', error)
        return null
      }
    },
  }
}
