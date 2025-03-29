export type BudgetItem = object

export interface Planning {
  name: string
  budget_items: BudgetItem[]
  // Add other planning properties
}

export interface BudgetPreparation {
  name: string
  isActive: boolean
  version: string
  year: string
} 