'use client'
import BudgetPath from '@/components/BudgetPath'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
import LableStatus from '@/components/LableStatus'

type StatusType = 'success' | 'info' | 'secondary' | 'warning' | 'danger'

const LayoutPlan = ({ children }: { children: ReactNode }) => {
  const t = useTranslations()
  const pathname = usePathname()
  const { id, formHeader } = usePlanFormStore()

  // Extract the plan type from the pathname
  const planType = pathname.split('/')[2] // This will get 'revenue' from '/plan/revenue/update'

  // Get the correct menu topic based on plan type
  const getMenuTopic = () => {
    switch (planType) {
      case 'revenue':
        return t('menu.revenue.topic')
      case 'revenue_allowcate':
        return t('menu.revenue_allowcate.topic')
      case 'employee':
        return t('menu.employee.topic')
      case 'material_cost':
        return t('menu.material_cost.topic')
      case 'utilities_costs':
        return t('menu.utilities_costs.topic')
      case 'durable_goods':
        return t('menu.durable_goods.topic')
      case 'land_and_construction':
        return t('menu.land_and_construction.topic')
      case 'lump_sum_wage':
        return t('menu.lump_sum_wage.topic')
      case 'vehicle_repair':
        return t('menu.vehicle_repair.topic')
      default:
        return t('budget_plan')
    }
  }

  const getStatusProps = () => {
    const style = formHeader.docstatus

    let title: string
    let status: StatusType

    switch (style) {
      case 0:
        title = 'Save'
        status = 'success'
        break
      case 1:
        title = 'Submitted'
        status = 'info'
        break
      default:
        title = 'Draft'
        status = 'secondary'
        break
    }

    return { title, status }
  }

  const statusProps = getStatusProps()

  return (
    <Box className="flex flex-col h-full">
      <Box className="pl-[39px] pt-[33px] pb-[19px]">
        <Box className="flex flex-col gap-[20px]">
          <Box className="flex items-center gap-[5px]">
            <span className="text-(length:--size-scale04) text-(--text-default-tertiary)">
              {t('budget_plan')}
            </span>
            <span className="text-(length:--size-scale04) text-(--text-default-tertiary)">/</span>
            <span className="text-(length:--titleform-size) font-(family-name:titleform-fontfamily) font-(--titleform-fontweight)">
              {getMenuTopic()}
            </span>
            {id !== 'new' && (
              <>
                <span className="text-(length:--size-scale04) text-(--text-default-tertiary)">
                  /
                </span>
                <span className="text-(length:--titleform-size) font-(family-name:titleform-fontfamily) font-(--titleform-fontweight)">
                  {id}
                </span>
              </>
            )}
            <span className="text-(length:--size-scale04) text-(--text-default-tertiary)">/</span>
            <Box>
              <LableStatus title={statusProps.title} status={statusProps.status} />
            </Box>
          </Box>
          {formHeader && <BudgetPath formHeader={formHeader} />}
        </Box>
      </Box>
      {children}
    </Box>
  )
}

export default LayoutPlan
