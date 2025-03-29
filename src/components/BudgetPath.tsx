import { Box } from '@mui/material'
import { EXCLUDE_FIELDS_PATCH } from '@/data/excludeFields'
import { useTranslations } from 'next-intl'

interface BudgetPathProps {
  formHeader: Record<string, any>
}

const BudgetPath = ({ formHeader }: BudgetPathProps) => {
  const t = useTranslations()

  // Filter out excluded fields and empty values
  const displayFields = Object.entries(formHeader || {}).filter(
    ([key, value]) =>
      !EXCLUDE_FIELDS_PATCH.includes(key) && value !== null && value !== undefined && value !== '',
  )

  if (displayFields.length === 0) return null

  const getDisplayValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return value.title || value.name || ''
    }
    return value
  }

  return (
    <>
      <Box className="h-[40px] w-[100em] overflow-x-auto">
        <Box className="flex gap-[10px] text-[14px] whitespace-nowrap">
          {displayFields.map(([key, value]) => (
            <Box
              key={key}
              className="flex items-center flex-shrink-0 bg-[#EFF3F8] px-[5px] py-[2px] rounded-[3px] border border-(--border-default-default)"
            >
              <span className="text-(--text-default-tertiary) text-(length:--size-scale01)">
                {t(`fields.${key}`)}
              </span>
              <span className="text-(--text-default-default) text-(length:--size-scale01) font-(--weight-weightregular) pl-[5px]">
                {getDisplayValue(value)}
              </span>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default BudgetPath
