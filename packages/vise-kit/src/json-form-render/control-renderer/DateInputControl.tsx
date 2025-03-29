import React from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { ControlProps, isDateControl, rankWith } from '@jsonforms/core'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Label } from '@vise/kit/form-elements'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { StyleDatePicker } from '@vise/kit/style'

const DateInputControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  uischema,
}: ControlProps) => {
  const [internalDate, setInternalDate] = React.useState(data ? dayjs(data) : null)
  const [cleared, setCleared] = React.useState<boolean>(false)
  const [colorIcon, setColorIcon] = React.useState<string>('black')

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false)
      }, 1500)

      return () => clearTimeout(timeout)
    }
    return () => {}
  }, [cleared])
  const handleDateChange = (newValue: Dayjs | null) => {
    setInternalDate(newValue ?? null)
    // แปลงเป็น format "YYYY-MM-DD" (เหมือนใน Vue code)
    const formatted = newValue ? newValue.format('YYYY-MM-DD') : null
    // เรียก callback ส่งค่าออกไป
    handleChange?.(path, formatted)
  }

  React.useEffect(() => {
    setInternalDate(data ? dayjs(data) : null)
  }, [data])
  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyleDatePicker
          format="MM/DD/YYYY"
          slots={{
            openPickerIcon: (props) => (
              <CalendarMonthOutlinedIcon {...props} sx={{ color: colorIcon }} />
            ),
          }}
          sx={{
            '.MuiInput-root, .MuiInputBase-root': {
              padding: '3px 10px',
              width: '100%',
              borderRadius: '8px',
            },
          }}
          slotProps={{
            textField: {
              placeholder: uischema?.options?.placeholder || '',
            },
            field: { clearable: true, onClear: () => setCleared(true) },
          }}
          value={internalDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </div>
  )
}

export const dateInputControlTester = rankWith(
  5,
  (uischema, schema, context) =>
    isDateControl(uischema, schema, context) && uischema?.options?.format === 'date',
)

export default withJsonFormsControlProps(DateInputControl)
