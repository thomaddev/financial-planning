import { InputAdornment, TextField } from '@mui/material'
import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleAutocomplete } from '@vise/kit/style'
import { useFrappeDocsMutation } from '@vise/kit/frappe-api'

// Define props interface for the pure component
interface AutoCompleteProps extends ControlledInputProps {
  docType: string
  showSearchIcon?: boolean
  adornmentPosition?: 'start' | 'end'
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  setValue,
  label,
  docType,
  required = false,
  disabled = false,
  placeholder = '',
  showSearchIcon = false,
  adornmentPosition = 'end',
}) => {
  const [disableInput] = React.useState(disabled)
  const { mutateAsync: mutateAsyncGetDocsMutation, isPending: isPendingGetDocsMutation } =
    useFrappeDocsMutation(docType)
  const [dataGetDocs, setDataGetDocs] = React.useState([])

  const fetchData = async () => {
    const response = await mutateAsyncGetDocsMutation()
    setDataGetDocs(response)
  }

  const handleValueChange = React.useCallback(
    (_event: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
      setValue(typeof newValue === 'string' ? newValue : '')
    },
    [setValue],
  )

  const standardEndAdornment = (): React.ReactNode => (
    <InputAdornment position="end" className="pr-2">
      {!showSearchIcon && (
        <KeyboardArrowDownOutlinedIcon
          fontSize="medium"
          color={disableInput ? 'disabled' : 'info'}
        />
      )}
      {showSearchIcon && (
        <SearchOutlinedIcon fontSize="medium" color={disableInput ? 'disabled' : 'info'} />
      )}
    </InputAdornment>
  )

  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={label} />
      <StyleAutocomplete
        disabled={disableInput}
        value={value || ''}
        onChange={handleValueChange}
        disableClearable
        options={dataGetDocs.map((option: any) => option.name)}
        onFocus={() => {
          fetchData()
        }}
        loading={isPendingGetDocsMutation}
        forcePopupIcon={false}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            placeholder={placeholder}
            sx={{
              height: '40px',
              backgroundColor: 'white',
              '.MuiInputBase-root': {
                backgroundColor: 'white',
              },
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: adornmentPosition === 'start' ? standardEndAdornment() : null,
                endAdornment: adornmentPosition === 'end' ? standardEndAdornment() : null,
              },
            }}
          />
        )}
      />
    </div>
  )
}

export default AutoComplete
