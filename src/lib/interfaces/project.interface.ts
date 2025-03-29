export interface ProjectObjective {
  key: number
  objective: string
}

export interface ProcedureTask {
  name: string
  start_date: string
  end_date: string
}

export interface ProjectTarget {
  key: number
  target: string
}

export interface ProjectKPI {
  kpi_quantity_name: string
  kpi_quantity_uom: string
  year_1: number
  year_2: number
  year_3: number
  year_4: number
  year_5: number
  kpi_plan_period_1: number
  kpi_plan_period_2: number
  kpi_plan_period_3: number
  kpi_plan_period_4: number
  kpi_plan_period_5: number
  kpi_plan_period_6: number
  kpi_plan_period_7: number
  kpi_plan_period_8: number
  kpi_plan_period_9: number
  kpi_plan_period_10: number
  kpi_plan_period_11: number
  kpi_plan_period_12: number
}

export type BudgetItem = object

export interface Project {
  name: string
  project_name: string
  company: string
  cost_center: string
  budget_strategy: string
  budget_plan: string
  budget_output: string
  budget_activity: string
  fund_group: string
  sub_fund_group: string
  fund_source: string
  fund_account: string
  fund_type: string
  sub_fund_type: string
  project_owner_name: string
  project_owner_position: string
  project_owner_phone_number: string
  project_coordinator_phone_number: string
  project_coordinator_name: string
  project_reason: string
  project_objective_items: ProjectObjective[]
  procedure_task_items: ProcedureTask[]
  project_target_items: ProjectTarget[]
  project_start_date: string
  project_end_date: string
  project_location: string
  project_kpi_items: ProjectKPI[]
  budget_items: BudgetItem[]
} 