import {
  Box,
  Modal,
  Typography,
  IconButton,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useState, useCallback, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleInput } from '@vise/kit/style'
import { ApiResponseDataMapping } from '@vise/kit/interface'

/*
 * ฟังก์ชันช่วยดึงค่าจาก keyToAssign (รองรับ nested key เช่น "ต้องการค่า name")
 */
const getNestedValue = (obj: any, key: string) => {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj)
}

interface InputSearchProps extends ControlledInputProps {
  startAdornment?: boolean
  endAdornment?: boolean
  dataMapping: ApiResponseDataMapping
}

const InputSearch = ({
  value,
  setValue,
  label,
  path,
  startAdornment = false,
  endAdornment = false,
  placeholder = '',
  required = false,
  dataMapping,
}: InputSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRows, setFilteredRows] = useState(dataMapping.data)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRows(dataMapping.data)
    } else {
      setFilteredRows(
        dataMapping.data.filter((row) => {
          // ตรวจสอบทุก column
          return dataMapping.columns.some((col) => {
            const columnData = row[col]
            if (!columnData) return false

            // ตรวจสอบทั้ง name และ title ใน object
            return (
              (columnData.name &&
                columnData.name.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
              (columnData.title &&
                columnData.title.toString().toLowerCase().includes(searchTerm.toLowerCase()))
            )
          })
        }),
      )
    }
  }, [searchTerm, dataMapping.data, dataMapping.columns])

  const handleClose = () => setOpen(false)
  console.log(filteredRows, dataMapping)
  return (
    <div>
      <Label label={label} required={required} path={path} />
      <StyleInput
        inputProps={{ placeholder }}
        value={value}
        readOnly
        startAdornment={
          startAdornment ? (
            <IconButton sx={{ padding: '0px' }} disableRipple onClick={() => setOpen(!open)}>
              <SearchIcon color={'info'} />
            </IconButton>
          ) : null
        }
        endAdornment={
          endAdornment ? (
            <IconButton sx={{ padding: '0px' }} disableRipple onClick={() => setOpen(!open)}>
              <SearchIcon color={'info'} />
            </IconButton>
          ) : null
        }
      />
      <Modal open={open} onClose={handleClose}>
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 300, sm: 550, md: 800, xl: 800 },
              borderRadius: 'var(--size-scale-05, 20px)',
              background: 'var(--background-default-default, #FFF)',
              boxShadow: '0px 20px 24px -4px rgba(16, 24, 40, 0.10)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid var(--tokens-color-gray-border-base)',
                padding: '10px',
                paddingX: '30px',
                paddingY: '35px',
              }}
            >
              <Typography variant={'nav_menu_topic'}>{'เพิ่มงบประมาณ (Add Wallet)'}</Typography>
              <IconButton disableRipple onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ marginY: '30px', marginX: '30px' }}>
              <StyleInput
                placeholder={'Search'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={<SearchIcon color={'info'} />}
              />
              <TableContainer
                component={(props) => <Paper {...props} elevation={0} />}
                sx={{ maxHeight: 400, marginTop: 2 }}
              >
                <Table stickyHeader>
                  <TableHead
                    sx={{
                      '& th:first-of-type': {
                        borderRadius: '12px 0 0 0',
                      },
                      '& th:last-child': {
                        borderRadius: '0 12px 0 0',
                      },
                    }}
                  >
                    <TableRow>
                      {dataMapping?.headers?.map((header, idx) => (
                        <TableCell
                          sx={{
                            border: 'none',
                            background: 'var(--background-default-secondary)',
                            color: 'var(--grey-500)',
                          }}
                          key={idx}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => {
                          setValue(getNestedValue(row, dataMapping.keyToAssign))
                          setOpen(false)
                        }}
                        sx={{ cursor: 'pointer' }}
                      >
                        {dataMapping.columns.map((col, idx) => (
                          <TableCell
                            sx={{
                              color: 'var(--tokens-color-text-primary)',
                              borderBottom: 'none',
                            }}
                            key={idx}
                          >
                            {/* {row[col]?.[dataMapping.keyToAssign]} */}
                            <Typography variant={'body1'}>
                              {row[col]?.[dataMapping.keyToAssign]}
                            </Typography>
                            {row[col]?.title && (
                              <Typography variant={'body2'} color={'textSecondary'}>
                                {row[col]?.title}
                              </Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
  // return (<>ssdf</>)
}

export default InputSearch
