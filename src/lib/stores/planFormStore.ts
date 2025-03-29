import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import { AgGridReact } from 'ag-grid-react'
import { ProcedureTask } from '@/types/procedureTask'
import dayjs from 'dayjs'

export type PlanType = 'revenue' | 'revenue_allowcate' | 'expense' | 'project'

interface PlanFormState {
  // Form state
  formHeader: Record<string, any>
  formAction: 'create' | 'update'
  id: string // for id update

  // Grid state
  rowData: any[]
  gridRef: React.RefObject<AgGridReact> | null
  formChildData: Record<string, any>
  submitting: boolean

  //Project planning state
  projectName: string
  formDataDetail: Record<string, any>
  formDataRelation: Record<string, any>
  formDataResponsible: Record<string, any>
  formDataImportant: Record<string, any>
  objectives: { key: number; objective: string }[]
  procedureTask: ProcedureTask
  targets: { key: number; target: string }[]
  formDataPeriod: Record<string, any>
  formDataLocation: [number, number]
  rowDataBudget: any[]
  gridApiKpi: any
  kpiData: any[]

  // Actions
  setId: (id: string) => void // for set id update
  setFormHeader: (data: Record<string, any>) => void
  setFormAction: (action: 'create' | 'update') => void
  setRowData: (data: any[]) => void
  setGridRef: (ref: React.RefObject<AgGridReact>) => void
  setFormChildData: (data: Record<string, any>) => void
  setSubmitting: (status: boolean) => void
  resetPlan: () => void

  //Project planning action
  setProjectName: (name: string) => void
  setFormDataDetail: (data: Record<string, any>) => void
  setFormDataRelation: (data: Record<string, any>) => void
  setFormDataResponsible: (data: Record<string, any>) => void
  setFormDataImportant: (data: Record<string, any>) => void
  setObjectives: (objectives: { key: number; objective: string }[]) => void
  setProcedureTask: (procedureTask: ProcedureTask) => void
  setTargets: (targets: { key: number; target: string }[]) => void
  setFormDataPeriod: (data: Record<string, any>) => void
  setFormDataLocation: (data: [number, number]) => void
  setRowDataBudget: (data: any[]) => void
  setGridApiKpi: (val: any) => void
  setKpiData: (data: any[]) => void
}

type PersistedState = {
  id: string
  formAction: 'create' | 'update'
}

export const usePlanFormStore = create<PlanFormState>()(
  persist(
    (set) => ({
      // Form state
      formHeader: {},
      formAction: 'create',
      id: 'new',

      // Grid state
      rowData: [],
      gridRef: null,
      formChildData: {},
      submitting: false,

      //Project planning state
      projectName: '',
      formDataDetail: {},
      formDataRelation: {},
      formDataResponsible: {},
      formDataImportant: {},
      objectives: [{ key: dayjs().valueOf(), objective: '' }],
      procedureTask: { tasks: [], links: [] },
      targets: [{ key: dayjs().valueOf(), target: '' }],
      formDataPeriod: {},
      formDataLocation: [13.7780523, 100.5352406],
      rowDataBudget: [],
      gridApiKpi: null,
      kpiData: [],

      // Actions
      setId: (id) => set({ id }),
      setFormHeader: (data) => set({ formHeader: data }),
      setFormAction: (action) => set({ formAction: action }),
      setRowData: (data) => set({ rowData: data }),
      setGridRef: (ref) => set({ gridRef: ref }),
      setFormChildData: (data) => set({ formChildData: data }),
      setSubmitting: (status) => set({ submitting: status }),
      resetPlan: () =>
        set({
          formHeader: {},
          formAction: 'create',
          id: 'new',
          rowData: [],
          gridRef: null,
          formChildData: {},
          submitting: false,
          projectName: '',
          formDataDetail: {},
          formDataRelation: {},
          formDataResponsible: {},
          formDataImportant: {},
          objectives: [{ key: dayjs().valueOf(), objective: '' }],
          procedureTask: { tasks: [], links: [] },
          targets: [{ key: dayjs().valueOf(), target: '' }],
          formDataPeriod: {},
          formDataLocation: [13.7780523, 100.5352406],
          rowDataBudget: [],
          gridApiKpi: null,
          kpiData: [],
        }),

      //Project planning action
      setProjectName: (name) => set({ projectName: name }),
      setFormDataDetail: (data) => set({ formDataDetail: data }),
      setFormDataRelation: (data) => set({ formDataRelation: data }),
      setFormDataResponsible: (data) => set({ formDataResponsible: data }),
      setFormDataImportant: (data) => set({ formDataImportant: data }),
      setObjectives: (objectives) => set({ objectives }),
      setProcedureTask: (procedureTask) => set({ procedureTask }),
      setTargets: (targets) => set({ targets }),
      setFormDataPeriod: (data) => set({ formDataPeriod: data }),
      setFormDataLocation: (data) => set({ formDataLocation: data }),
      setRowDataBudget: (data) => set({ rowDataBudget: data }),
      setGridApiKpi: (val) => set({ gridApiKpi: val }),
      setKpiData: (data) => set({ kpiData: data }),
    }),
    {
      name: 'plan-form-storage',
      storage: {
        getItem: (name): StorageValue<PersistedState> | null => {
          const str = sessionStorage.getItem(name)
          if (!str) return null
          return JSON.parse(str)
        },
        setItem: (name, value: StorageValue<PersistedState>): void => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name): void => {
          sessionStorage.removeItem(name)
        },
      },
      partialize: (state): PersistedState => ({
        // Only persist these specific fields in sessionStorage
        id: state.id,
        formAction: state.formAction,
      }),
    },
  ),
)
