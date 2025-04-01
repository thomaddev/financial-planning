export type BudgetItem = object

export interface Planning {
  name: string
  budget_items: BudgetItem[]
  record_name: string
  category?: 'revenue' | 'expense' | 'project'
  docstatus?: number
  id?: number
  gridId?: number
  createdAt?: string
  updatedAt?: string
  template_type?: string
  strategy?: string
  // Add other planning properties
}

export interface BudgetPreparation {
  name: string
  isActive: boolean
  version: string
  year: string
} 