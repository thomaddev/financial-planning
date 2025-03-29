'use client'
import { ControlProps, or, rankWith, scopeEndsWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { InputAdornment, Skeleton, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useFrappeDocs } from '@vise/kit/frappe-api'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { StyleAutocomplete } from '@vise/kit/style'
import { Label } from '@vise/kit/form-elements'

interface Option {
  name: string
  title: string
}

const AutoCompleteControl = ({
  data: dataValue,
  handleChange,
  path,
  label,
  schema,
  required,
  uischema,
}: ControlProps) => {
  const isStandardDoctype = () => ['company', 'cost_center'].includes(path)
  const formAction = uischema?.options?.formAction
  const docType = (schema as any)?.params?.docType
  const [disableInput, setDisableInput] = React.useState(false)
  const [adornment, setAdornment] = React.useState(false)
  const [searchIcon, setSearchIcon] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isFinishInitialLoad, setIsFinishInitialLoad] = React.useState(formAction === 'create')

  useEffect(() => {
    if (formAction === 'update') {
      setIsFinishInitialLoad(true)
    }
  }, [])

  // Fetch list of documents, but only when `refetch()` is called (not on mount)
  const {
    data: dataGetDocs = [],
    refetch: refetchDocs,
    isFetching: isFetchingDocs,
  } = useFrappeDocs(
    docType,
    searchTerm ? [[isStandardDoctype() ? 'name' : 'title', 'like', `%%${searchTerm}%%`]] : [],
    isStandardDoctype() ? ['name'] : ['name', 'title'],
    { enabled: false },
  )

  // Fetch data when the user typing on AutoComplete
  useEffect(() => {
    const compareValue = typeof dataValue === 'string' ? dataValue : (dataValue?.title ?? undefined)
    // avoid load first time field render
    if (isFinishInitialLoad && searchTerm !== compareValue) {
      refetchDocs()
    }
  }, [searchTerm])

  const handleInputChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchTerm(newValue)
  }

  const handleValueChange = React.useCallback(
    (_event: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
      newValue = newValue as Option | string
      if (isStandardDoctype()) {
        handleChange(path, newValue)
        // setSelectedOption(newValue as Option)
      } else {
        const nameSelected = dataGetDocs.find((e: any) => e.title === newValue)
        handleChange(path, newValue)
        // setSelectedOption(newValue as Option)
      }
      setSearchTerm('')
    },
    [handleChange, path, dataGetDocs],
  )

  const standardEndAdornment = (): React.ReactNode => (
    <InputAdornment position="end" className="pr-2">
      {!searchIcon && (
        <KeyboardArrowDownOutlinedIcon
          fontSize="medium"
          color={disableInput ? 'disabled' : 'info'}
        />
      )}
      {searchIcon && (
        <SearchOutlinedIcon fontSize="medium" color={disableInput ? 'disabled' : 'info'} />
      )}
    </InputAdornment>
  )

  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      {!isFinishInitialLoad ? (
        <Skeleton height={65} />
      ) : (
        <StyleAutocomplete
          disabled={disableInput}
          value={(isStandardDoctype() ? dataValue : dataValue) || ''}
          onChange={handleValueChange}
          disableClearable
          options={dataGetDocs}
          getOptionLabel={(option: any) =>
            typeof option === 'string' ? option : option.title || option.name
          }
          onFocus={() => {
            refetchDocs()
          }}
          loading={isFetchingDocs}
          forcePopupIcon={false}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              {...params}
              placeholder={uischema?.options?.placeholder || ''}
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
                  startAdornment: adornment ? standardEndAdornment() : null,
                  endAdornment: !adornment ? standardEndAdornment() : null,
                },
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export const autoCompleteControlTester = rankWith(
  4,
  or(
    scopeEndsWith('fund_group'),
    scopeEndsWith('company'),
    scopeEndsWith('budget_strategy'),
    scopeEndsWith('fund_type'),
    scopeEndsWith('budget_strategie'),
    scopeEndsWith('cost_center'),
    scopeEndsWith('budget_plan'),
    scopeEndsWith('budget_output'),
    scopeEndsWith('fund_source'),
    scopeEndsWith('budget_activity'),
    scopeEndsWith('fund_account'),
  ),
)

export default withJsonFormsControlProps(AutoCompleteControl)
