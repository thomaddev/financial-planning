'use client'
import {
  Box,
  FormLabel,
  InputBase,
  styled,
  Modal,
  Typography,
  IconButton,
  Fade,
} from '@mui/material'
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  themeQuartz,
} from 'ag-grid-community'
import './styles.css'
import RenderMenuItem from '@/components/RenderMenuItem'

const MyInput = styled(InputBase)(({ theme }) => ({
  padding: '0px 10px',
  width: '100%',
  border: `1px solid ${theme.palette.input.main}`,
  borderRadius: '8px',
  fontFamily: 'Sarabun-Regular',
  position: 'relative',
  '&::placeholder': {
    fontFamily: 'Sarabun-Regular',
    color: theme.palette.input.main,
    opacity: 1,
    fontSize: theme.typography.label.fontSize,
  },
  'input, textarea': {
    fontFamily: 'Sarabun-Regular',
    padding: '10px',
    fontSize: theme.typography.input.fontSize,
  },
  '& .MuiInputAdornment-root p': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focused': {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'white',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.input.main,
    zIndex: 10,
    '& .MuiInputAdornment-root p': {
      color: theme.palette.input.main,
    },
  },
  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
    '&:hover': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
  },
  '.select-caret': {
    right: '10px',
    svg: {
      color: theme.palette.primary.main,
      fontSize: '18px',
    },
  },
}))

const myTheme = themeQuartz.withParams({})

interface ApiResponse {
  columns: string[] // เช่น ["col1", "col2", "col3"] หรือ ["athlete","age",...]
  headers?: string[] // ถ้าอยากให้ headerName ในตารางเป็นชื่อที่สวยงาม
  data: any[] // array ของ object ข้อมูล row
}

// สร้าง columnDefs
const createColumnDefs = (res: ApiResponse) => {
  return res.columns.map((colKey, idx) => ({
    headerName: res.headers ? res.headers[idx] : colKey,
    field: colKey,
    // valueGetter สำหรับการกรองเท่านั้น
    valueGetter: (params) => {
      const value = params.data[colKey] // ดึงข้อมูลดั้งเดิมจาก params.data
      if (value && typeof value === 'object' && 'id' in value && 'desc' in value) {
        return `${value.id} ${value.desc}` // ส่ง string ไปให้ quickFilterText
      }
      return String(value ?? '')
    },
    // cellRenderer ใช้ข้อมูลดั้งเดิมจาก params.data
    cellRenderer: (params: ICellRendererParams) => {
      const value = params.data[colKey] // ดึง object ดั้งเดิมจาก params.data แทน params.value
      if (value && typeof value === 'object' && 'id' in value && 'desc' in value) {
        return (
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-family-Kanit-Regular)',
                fontSize: '14px',
                color: '#000',
              }}
            >
              {value.id}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-family-Kanit-Regular)',
                fontSize: '14px',
                color: '#677489',
              }}
            >
              {value.desc}
            </Typography>
          </Box>
        )
      }
      return (
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-family-Kanit-Regular)',
              fontSize: '14px',
              color: '#000',
            }}
          >
            {String(value ?? '')}
          </Typography>
        </Box>
      )
    },
  }))
}

// const headerNames = [
//   'สถานะการใช้งาน', // "Usage Status"
//   'หมายเลขบัตร', // "Card Number"
//   'ชื่อ-สกุล', // "Name-Surname"
//   'หมายเลขโทรศัพท์', // "Phone Number"
//   'วันที่สมัคร', // "Registration Date"
// ]

// const mockData = [
//   {
//     col1: { id: '21003140002002000000', desc: 'งบดำเนินxxxx' },
//     col2: { id: '661200', desc: 'งบดำเนินงาน' },
//     col3: { id: '5000', desc: 'รายจ่าย' },
//     col4: {id: '5000', desc: 'กรมการแพทย์' },
//     col5: { id: '5000', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003250003003000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661201', desc: 'งบดำเนินงาน' },
//     col3: { id: '6000', desc: 'รายจ่าย' },
//     col4: {id: '6000', desc: 'กรมการแพทย์' },
//     col5: { id: '6000', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003360004004000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661202', desc: 'งบดำเนินงาน' },
//     col3: { id: '7000', desc: 'รายจ่าย' },
//     col4: {id: '7000', desc: 'กรมการแพทย์' },
//     col5: { id: '7000', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003470005005000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661203', desc: 'งบดำเนินงาน' },
//     col3: { id: '8000', desc: 'รายจ่าย' },
//     col4: {id: '8000', desc: 'กรมการแพทย์' },
//     col5: { id: '8000', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003580006006000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661204', desc: 'งบดำเนินงาน' },
//     col3: { id: '9000', desc: 'รายจ่าย' },
//     col4: {id: '9000', desc: 'กรมการแพทย์' },
//     col5: { id: '9000', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003690007007000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661205', desc: 'งบดำเนินงาน' },
//     col3: { id: '5500', desc: 'รายจ่าย' },
//     col4: {id: '5500', desc: 'กรมการแพทย์' },
//     col5: { id: '5500', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003710008008000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661206', desc: 'งบดำเนินงาน' },
//     col3: { id: '6500', desc: 'รายจ่าย' },
//     col4: {id: '6500', desc: 'กรมการแพทย์' },
//     col5: { id: '6500', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003820009009000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661207', desc: 'งบดำเนินงาน' },
//     col3: { id: '7500', desc: 'รายจ่าย' },
//     col4: {id: '7500', desc: 'กรมการแพทย์' },
//     col5: { id: '7500', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21003930001001000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661208', desc: 'งบดำเนินงาน' },
//     col3: { id: '8500', desc: 'รายจ่าย' },
//     col4: {id: '8500', desc: 'กรมการแพทย์' },
//     col5: { id: '8500', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004040002002000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661209', desc: 'งบดำเนินงาน' },
//     col3: { id: '9500', desc: 'รายจ่าย' },
//     col4: {id: '9500', desc: 'กรมการแพทย์' },
//     col5: { id: '9500', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004150003003000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661210', desc: 'งบดำเนินงาน' },
//     col3: { id: '5200', desc: 'รายจ่าย' },
//     col4: {id: '5200', desc: 'กรมการแพทย์' },
//     col5: { id: '5200', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004260004004000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661211', desc: 'งบดำเนินงาน' },
//     col3: { id: '6200', desc: 'รายจ่าย' },
//     col4: {id: '6200', desc: 'กรมการแพทย์' },
//     col5: { id: '6200', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004370005005000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661212', desc: 'งบดำเนินงาน' },
//     col3: { id: '7200', desc: 'รายจ่าย' },
//     col4: {id: '7200', desc: 'กรมการแพทย์' },
//     col5: { id: '7200', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004480006006000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661213', desc: 'งบดำเนินงาน' },
//     col3: { id: '8200', desc: 'รายจ่าย' },
//     col4: {id: '8200', desc: 'กรมการแพทย์' },
//     col5: { id: '8200', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004590007007000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661214', desc: 'งบดำเนินงาน' },
//     col3: { id: '9200', desc: 'รายจ่าย' },
//     col4: {id: '9200', desc: 'กรมการแพทย์' },
//     col5: { id: '9200', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004610008008000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661215', desc: 'งบดำเนินงาน' },
//     col3: { id: '5300', desc: 'รายจ่าย' },
//     col4: {id: '5300', desc: 'กรมการแพทย์' },
//     col5: { id: '5300', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004720009009000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661216', desc: 'งบดำเนินงาน' },
//     col3: { id: '6300', desc: 'รายจ่าย' },
//     col4: {id: '6300', desc: 'กรมการแพทย์' },
//     col5: { id: '6300', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004830001001000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661217', desc: 'งบดำเนินงาน' },
//     col3: { id: '7300', desc: 'รายจ่าย' },
//     col4: {id: '7300', desc: 'กรมการแพทย์' },
//     col5: { id: '7300', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21004940002002000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661218', desc: 'งบดำเนินงาน' },
//     col3: { id: '8300', desc: 'รายจ่าย' },
//     col4: {id: '8300', desc: 'กรมการแพทย์' },
//     col5: { id: '8300', desc: 'การพัฒนาการดูแลผู้สูงอายุ' },
//   },
//   {
//     col1: { id: '21005050003003000000', desc: 'งบดำเนินงาน' },
//     col2: { id: '661219', desc: 'งบดำเนินงาน' },
//     col3: { id: '9300', desc: 'รายจ่าย' },
//     col4: {id: '9300', desc: 'กรมการแพทย์' },
//     col5: { id: '9300', desc: 'ddddd' },
//   },
// ]

// const headerNames2 = [
//   { field: 'athlete', width: 150, suppressSizeToFit: true },
//   {
//     field: 'age',
//     headerName: 'Age of Athlete',
//     width: 90,
//     minWidth: 50,
//     maxWidth: 150,
//   },
//   { field: 'country', width: 120 },
//   { field: 'year', width: 90 },
//   { field: 'date', width: 110 },
//   { field: 'sport', width: 110 },
//   { field: 'gold', width: 100 },
//   { field: 'silver', width: 100 },
//   { field: 'bronze', width: 100 },
//   { field: 'total', width: 100 },
// ]

// const mockData2 = [
//   {
//     athlete: 'Michael Phelps',
//     age: 23,
//     country: 'United States',
//     year: 2008,
//     date: '24/08/2008',
//     sport: 'Swimming',
//     gold: 8,
//     silver: 0,
//     bronze: 0,
//     total: 8,
//   },
//   {
//     athlete: 'Michael Phelps',
//     age: 19,
//     country: 'United States',
//     year: 2004,
//     date: '29/08/2004',
//     sport: 'Swimming',
//     gold: 6,
//     silver: 0,
//     bronze: 2,
//     total: 8,
//   },
//   {
//     athlete: 'Michael Phelps',
//     age: 27,
//     country: 'United States',
//     year: 2012,
//     date: '12/08/2012',
//     sport: 'Swimming',
//     gold: 4,
//     silver: 2,
//     bronze: 0,
//     total: 6,
//   },
//   {
//     athlete: 'Natalie Coughlin',
//     age: 25,
//     country: 'United States',
//     year: 2008,
//     date: '24/08/2008',
//     sport: 'Swimming',
//     gold: 1,
//     silver: 2,
//     bronze: 3,
//     total: 6,
//   },
//   {
//     athlete: 'Aleksey Nemov',
//     age: 24,
//     country: 'Russia',
//     year: 2000,
//     date: '01/10/2000',
//     sport: 'Gymnastics',
//     gold: 2,
//     silver: 1,
//     bronze: 3,
//     total: 6,
//   },
//   {
//     athlete: 'Alicia Coutts',
//     age: 24,
//     country: 'Australia',
//     year: 2012,
//     date: '12/08/2012',
//     sport: 'Swimming',
//     gold: 1,
//     silver: 3,
//     bronze: 1,
//     total: 5,
//   },
// ]

// const columnDefs: ColDef[] = [
//   {
//     headerName: headerNames[0],
//     field: 'col1',
//     valueGetter: (params) => `${params.data.col1.id} ${params.data.col1.desc}`,
//     cellRenderer: (params) => (
//       <Box
//         sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
//       >
//         <Typography
//           sx={{ fontFamily: 'var(--font-family-Kanit-Regular)', fontSize: '14px', color: '#000' }}
//         >
//           {params.data.col1.id}
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: 'var(--font-family-Kanit-Regular)',
//             fontSize: '14px',
//             color: '#677489',
//           }}
//         >
//           {params.data.col1.desc}
//         </Typography>
//       </Box>
//     ),
//   },
//   {
//     headerName: headerNames[1],
//     field: 'col2',
//     valueGetter: (params) => `${params.data.col2.code} ${params.data.col2.desc}`,
//     cellRenderer: (params) => (
//       <Box
//         sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
//       >
//         <Typography
//           sx={{ fontFamily: 'var(--font-family-Kanit-Regular)', fontSize: '14px', color: '#000' }}
//         >
//           {params.data.col2.code}
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: 'var(--font-family-Kanit-Regular)',
//             fontSize: '14px',
//             color: '#677489',
//           }}
//         >
//           {params.data.col2.desc}
//         </Typography>
//       </Box>
//     ),
//   },
//   {
//     headerName: headerNames[2],
//     field: 'col3',
//     valueGetter: (params) => `${params.data.col3.amount} ${params.data.col3.desc}`,
//     cellRenderer: (params) => (
//       <Box
//         sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
//       >
//         <Typography
//           sx={{ fontFamily: 'var(--font-family-Kanit-Regular)', fontSize: '14px', color: '#000' }}
//         >
//           {params.data.col3.amount}
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: 'var(--font-family-Kanit-Regular)',
//             fontSize: '14px',
//             color: '#677489',
//           }}
//         >
//           {params.data.col3.desc}
//         </Typography>
//       </Box>
//     ),
//   },
//   {
//     headerName: headerNames[3],
//     field: 'col4',
//     valueGetter: (params) => `${params.data.col4.policy1} ${params.data.col4.desc}`,
//     cellRenderer: (params) => (
//       <Box
//         sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
//       >
//         <Typography
//           sx={{ fontFamily: 'var(--font-family-Kanit-Regular)', fontSize: '14px', color: '#000' }}
//         >
//           {params.data.col4.policy1}
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: 'var(--font-family-Kanit-Regular)',
//             fontSize: '14px',
//             color: '#677489',
//           }}
//         >
//           {params.data.col4.desc}
//         </Typography>
//       </Box>
//     ),
//   },
//   {
//     headerName: headerNames[4],
//     field: 'col5',
//     valueGetter: (params) => `${params.data.col5.policy2} ${params.data.col5.desc}`,
//     cellRenderer: (params) => (
//       <Box
//         sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
//       >
//         <Typography
//           sx={{ fontFamily: 'var(--font-family-Kanit-Regular)', fontSize: '14px', color: '#000' }}
//         >
//           {params.data.col5.policy2}
//         </Typography>
//         <Typography
//           sx={{
//             fontFamily: 'var(--font-family-Kanit-Regular)',
//             fontSize: '14px',
//             color: '#677489',
//           }}
//         >
//           {params.data.col5.desc}
//         </Typography>
//       </Box>
//     ),
//   },
// ]

const case1 = {
  columns: ['col1', 'col2', 'col3', 'col4', 'col5'],
  headers: ['สถานะการใช้งาน', 'หมายเลขบัตร', 'ชื่อ-สกุล', 'หมายเลขโทรศัพท์', 'วันที่สมัคร'],
  data: [
    {
      col1: {
        id: '21003140002002000000',
        desc: 'งบดำเนินxxxx',
      },
      col2: {
        id: '661200',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '5000',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '5000',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '5000',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003250003003000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661201',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '6000',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '6000',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '6000',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003360004004000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661202',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '7000',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '7000',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '7000',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003470005005000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661203',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '8000',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '8000',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '8000',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003580006006000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661204',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '9000',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '9000',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '9000',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003690007007000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661205',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '5500',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '5500',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '5500',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003710008008000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661206',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '6500',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '6500',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '6500',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003820009009000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661207',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '7500',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '7500',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '7500',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21003930001001000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661208',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '8500',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '8500',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '8500',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004040002002000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661209',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '9500',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '9500',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '9500',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004150003003000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661210',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '5200',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '5200',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '5200',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004260004004000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661211',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '6200',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '6200',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '6200',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004370005005000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661212',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '7200',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '7200',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '7200',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004480006006000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661213',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '8200',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '8200',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '8200',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004590007007000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661214',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '9200',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '9200',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '9200',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004610008008000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661215',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '5300',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '5300',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '5300',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004720009009000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661216',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '6300',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '6300',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '6300',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004830001001000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661217',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '7300',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '7300',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '7300',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21004940002002000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661218',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '8300',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '8300',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '8300',
        desc: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        id: '21005050003003000000',
        desc: 'งบดำเนินงาน',
      },
      col2: {
        id: '661219',
        desc: 'งบดำเนินงาน',
      },
      col3: {
        id: '9300',
        desc: 'รายจ่าย',
      },
      col4: {
        id: '9300',
        desc: 'กรมการแพทย์',
      },
      col5: {
        id: '9300',
        desc: 'ddddd',
      },
    },
  ],
  keyToAssign: 'col1.id',
}

const Page = () => {
  // for search modal
  const [text, setText] = React.useState<string>('')
  // const filteredItems = mockData.filter((item) =>
  //   item.col1.desc.toLowerCase().includes(text.toLowerCase()),
  // )
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)

  const gridRef = useRef<AgGridReact>(null)
  const [rowData, setRowData] = useState<any[]>([])
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      suppressMenu: true,
      editable: false,
      // filter: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: false,
      suppressContextMenu: true,
      suppressSizeToFit: true,
    }
  }, [])

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: 'fitCellContents',
    }
  }, [])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
    setRowData(case1.data)
  }, [])

  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = (
      document.getElementById('filter-text-box') as HTMLInputElement
    ).value.toLowerCase()
    gridRef.current!.api.setGridOption('quickFilterText', filterText)
  }, [])

  useEffect(() => {
    setRowData(case1.data)
    setColumnDefs(createColumnDefs(case1)) // สร้าง columnDefs ตาม function ด้านบน
  }, [])

  // ฟังก์ชันช่วยดึงค่าจาก keyToAssign (รองรับ nested key เช่น "col1.id")
  const getNestedValue = (obj: any, key: string) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  return (
    <div>
      <FormLabel>Modal Search Components</FormLabel>
      <MyInput
        inputProps={{
          placeholder: 'Search',
        }}
        value={text}
        readOnly
        endAdornment={
          <IconButton
            sx={{
              padding: '0px',
            }}
            disableRipple
            onClick={() => setOpen(!open)}
          >
            <SearchIcon color={'info'} />
          </IconButton>
        }
      />
      <Modal
        keepMounted // Keep the modal in the DOM; improve the rendering performance
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 300, sm: 550, md: 800, xl: 800 }, // Adjusts width based on screen size
              height: { xs: 300, sm: 300, md: 500, xl: 800 }, // Adjusts height based on screen size
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
              <Grid
                container
                columns={10}
                display={'flex'}
                alignItems={'start'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Grid size={8}>
                  <RenderMenuItem
                    topic={'เพิ่มงบประมาณ (Add Wallet)'}
                    desc={'กรุณาเลือกงบประมาณที่ต้องการ'}
                  />
                </Grid>
                <Grid size={2} display={'flex'} justifyContent={'flex-end'}>
                  <IconButton disableRipple onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                marginY: '30px',
                marginX: '30px',
              }}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              gap={1}
            >
              <MyInput
                id="filter-text-box"
                placeholder={'Search'}
                onInput={onFilterTextBoxChanged}
              />
              <Box
                className="ag-theme-alpine" // Apply AG-Grid theme
                sx={{
                  height: { xs: 250, sm: 250, md: 250, xl: 540 }, // Match your previous maxHeight
                  width: '100%',
                }}
              >
                <AgGridReact
                  theme={myTheme}
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  onRowClicked={(event) => {
                    setText(getNestedValue(event.data, case1.keyToAssign))
                    setOpen(false)
                  }}
                  autoSizeStrategy={autoSizeStrategy}
                  suppressContextMenu={true}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default Page
