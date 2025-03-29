import { InputBase } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'

type Props = {
  onFilterTextBoxChanged: () => void
}

const InputFilter = ({ onFilterTextBoxChanged }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    onFilterTextBoxChanged()
  }

  return (
    <div className="w-full">
      <InputBase
        id="filter-text-box"
        size="small"
        placeholder="Type here to search..."
        startAdornment={
          <SearchIcon
            sx={{
              width: '16px',
              height: '16px',
              marginRight: '50px',
            }}
          />
        }
        value={inputValue}
        onChange={handleChange}
        sx={{
          marginBottom: '0px',
        }}
      />
    </div>
  )
}

export default InputFilter
