import { useFrappeAPI } from '@vise/kit/frappe-api'
import { User } from '@/lib/interfaces/user.interface'

export const useUserService = () => {
  const { frappe } = useFrappeAPI()

  return {
    getCurrentUser: async (): Promise<User | null> => {
      try {
        return await frappe.callMethod('vise_budget_planning.api.v1.user.get_current_user_info')
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        return null
      }
    },
  }
} 