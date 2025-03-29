import React from 'react'
import { FormLabel } from '@mui/material'
import { useSafeTranslations } from '@vise/kit/utils'

// 1) กำหนดประเภท (type หรือ enum) สำหรับ color
type LabelColor = 'black' | 'disable' | 'info'
export interface LabelProps {
  /**
   * field name เพื่อนำไป translate
   */
  path: string
  /**
   * ข้อความ label ที่ต้องการแสดง
   */
  label: string
  /**
   * กำหนดว่าเป็นตัวหนาหรือไม่
   */
  isBold?: boolean
  /**
   * สีของ label
   */
  color?: LabelColor
  /**
   * ถ้า true จะแสดงเครื่องหมาย * ต่อท้าย
   */
  required?: boolean
}

// 2) Map ค่าสีตามตัวเลือก
const colorMap: Record<LabelColor, string> = {
  black: '#000000',
  disable: '#9DA2AA',
  info: '#2463EB',
}

export const Label: React.FC<LabelProps> = ({
  path,
  label,
  isBold = false,
  color = 'black',
  required = false,
}) => {
  const t = useSafeTranslations()

  return (
    <div className="flex h-full gap-1">
      <FormLabel
        required={required}
        className="flex gap-1"
        sx={{
          '&.MuiFormLabel-root': {
            // ตั้งสีตามค่า colorMap
            color: colorMap[color],
            fontWeight: isBold ? 550 : 400,
          },
          '& .MuiFormLabel-asterisk': { color: '#2463EB', fontSize: '16px' },
        }}
      >
        {t.has(`fields.${path}`) ? t(`fields.${path}`) : label}
      </FormLabel>
    </div>
  )
}
