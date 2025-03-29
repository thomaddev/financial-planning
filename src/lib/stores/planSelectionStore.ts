import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { BudgetPreparation } from '@/lib/interfaces/planning.interface'

interface PlanSelectionState {
  currentPlan: BudgetPreparation | null
  setCurrentPlan: (plan: BudgetPreparation) => void
  version: string
  setVersion: (version: string) => void
  clearCurrentPlan: () => void
}

export const usePlanSelectionStore = create<PlanSelectionState>()(
  devtools(
    persist(
      (set) => ({
        currentPlan: null,
        setCurrentPlan: (plan) => set({ currentPlan: plan }),
        clearCurrentPlan: () => set({ currentPlan: null }),
        version: '',
        setVersion: (version) => set({ version }),
      }),
      {
        name: 'plan-selection-storage',
        partialize: (state) => ({
          // Only persist version
          version: state.version,
        }),
      },
    )
  ),
)
