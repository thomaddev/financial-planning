import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleDatePicker } from '@vise/kit/style'

interface DateInputProps extends ControlledInputProps {
  colorIcon?: string
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  setValue,
  label,
  required = false,
  disabled = false,
  placeholder = '',
  path,
  colorIcon = 'black',
}) => {
  const [internalDate, setInternalDate] = React.useState<Dayjs | null>(value ? dayjs(value) : null)
  const [cleared, setCleared] = React.useState<boolean>(false)

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
    const formatted = newValue ? newValue.format('YYYY-MM-DD') : null
    setValue(formatted)
  }

  React.useEffect(() => {
    setInternalDate(value ? dayjs(value) : null)
  }, [value])

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
              placeholder: placeholder,
            },
            field: { clearable: true, onClear: () => setCleared(true) },
          }}
          value={internalDate}
          onChange={handleDateChange}
          disabled={disabled}
        />
      </LocalizationProvider>
    </div>
  )
}

export default DateInput
