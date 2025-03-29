'use client'
import {
  Autocomplete,
  FormControl,
  FormLabel,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  styled,
  TextField,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React from 'react'
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import buddhistEra from 'dayjs/plugin/buddhistEra'
import dayjs from 'dayjs'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { InputSearch } from '@vise/kit'

dayjs.extend(buddhistEra)

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
]

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

const MySelect = styled(Select)(({ theme }) => ({
  padding: '0px 10px',
  width: '100%',
  maxHeight: '40px',
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

const MyAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  height: '40px',
  // border: `1px solid ${theme.palette.input.main}`,
  borderRadius: '8px',
  fontFamily: 'Sarabun-Regular',
  // position: "relative",
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
    height: '28px',
    // ":hover": {
    //   border: `1px solid ${theme.palette.primary.main}`,
    // },
    // borderRadius: "4px",
  },
  '& .MuiInputAdornment-root p': {
    color: theme.palette.primary.main,
  },
  // "&.Mui-focused": {
  //   border: `1px solid ${theme.palette.primary.main}`,
  //   backgroundColor: "white",
  // },
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

const MyDatePicker = styled(DatePicker)(() => ({
  '.MuiInput-root, .MuiInputBase-root': {
    padding: '3px 10px',
    width: '100%',
    borderRadius: '8px',
  },
}))

const options = [
  { value: 'one', label: 'one' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
]

const case1 = {
  columns: ['col1', 'col2', 'col3', 'col4', 'col5'],
  headers: ['สถานะการใช้งาน', 'หมายเลขบัตร', 'ชื่อ-สกุล', 'หมายเลขโทรศัพท์', 'วันที่สมัคร'],
  data: [
    {
      col1: {
        name: '21003140002002000000',
        title: 'งบดำเนินxxxx',
      },
      col2: {
        name: '661200',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '5000',
        title: 'รายจ่าย',
      },
      col4: {
        name: '5000',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '5000',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003250003003000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661201',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '6000',
        title: 'รายจ่าย',
      },
      col4: {
        name: '6000',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '6000',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003360004004000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661202',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '7000',
        title: 'รายจ่าย',
      },
      col4: {
        name: '7000',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '7000',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003470005005000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661203',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '8000',
        title: 'รายจ่าย',
      },
      col4: {
        name: '8000',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '8000',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003580006006000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661204',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '9000',
        title: 'รายจ่าย',
      },
      col4: {
        name: '9000',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '9000',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003690007007000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661205',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '5500',
        title: 'รายจ่าย',
      },
      col4: {
        name: '5500',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '5500',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003710008008000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661206',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '6500',
        title: 'รายจ่าย',
      },
      col4: {
        name: '6500',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '6500',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003820009009000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661207',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '7500',
        title: 'รายจ่าย',
      },
      col4: {
        name: '7500',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '7500',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21003930001001000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661208',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '8500',
        title: 'รายจ่าย',
      },
      col4: {
        name: '8500',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '8500',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004040002002000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661209',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '9500',
        title: 'รายจ่าย',
      },
      col4: {
        name: '9500',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '9500',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004150003003000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661210',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '5200',
        title: 'รายจ่าย',
      },
      col4: {
        name: '5200',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '5200',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004260004004000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661211',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '6200',
        title: 'รายจ่าย',
      },
      col4: {
        name: '6200',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '6200',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004370005005000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661212',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '7200',
        title: 'รายจ่าย',
      },
      col4: {
        name: '7200',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '7200',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004480006006000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661213',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '8200',
        title: 'รายจ่าย',
      },
      col4: {
        name: '8200',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '8200',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004590007007000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661214',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '9200',
        title: 'รายจ่าย',
      },
      col4: {
        name: '9200',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '9200',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004610008008000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661215',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '5300',
        title: 'รายจ่าย',
      },
      col4: {
        name: '5300',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '5300',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004720009009000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661216',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '6300',
        title: 'รายจ่าย',
      },
      col4: {
        name: '6300',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '6300',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004830001001000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661217',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '7300',
        title: 'รายจ่าย',
      },
      col4: {
        name: '7300',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '7300',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21004940002002000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661218',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '8300',
        title: 'รายจ่าย',
      },
      col4: {
        name: '8300',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '8300',
        title: 'การพัฒนาการดูแลผู้สูงอายุ',
      },
    },
    {
      col1: {
        name: '21005050003003000000',
        title: 'งบดำเนินงาน',
      },
      col2: {
        name: '661219',
        title: 'งบดำเนินงาน',
      },
      col3: {
        name: '9300',
        title: 'รายจ่าย',
      },
      col4: {
        name: '9300',
        title: 'กรมการแพทย์',
      },
      col5: {
        name: '9300',
        title: 'ddddd',
      },
    },
  ],
  keyToAssign: 'name',
}

const Page = () => {
  const [cleared, setCleared] = React.useState<boolean>(false)
  const [answer, setAnswer] = React.useState<string>('')

  const [value, setValue] = React.useState<string | null>('')

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false)
      }, 1500)

      return () => clearTimeout(timeout)
    }
    return () => {}
  }, [cleared])
  return (
    <div>
      <div className="flex flex-col gap-4">
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: 'black',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ
        </FormLabel>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: 'black',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ <span className="text-xl text-[#2463EB] font-medium">{'*'}</span>
        </FormLabel>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: '#9DA2AA',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ
        </FormLabel>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: '#2463EB',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ
        </FormLabel>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: 'black',
              fontWeight: '550',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ
        </FormLabel>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: '#2463EB',
              fontWeight: '550',
              fontFamily: 'Sarabun-Regular',
            },
          }}
        >
          ประเภทการขออนุมัติ
        </FormLabel>
      </div>
      <MyInput
        inputProps={
          // minlength : 0 to 10
          { minLength: 0, maxLength: 10 }
        }
        // value={""}
        // onChange={(event) => handleChange(path, event.target.value)}
        // placeholder={uischema?.options?.placeholder || ""}
      />
      <FormLabel>Number</FormLabel>
      <MyInput />
      <MyInput
        type="number"
        inputProps={{
          step: 0.01,
          min: 0,
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MyDatePicker
          format="MM/DD/YYYY"
          slots={{
            openPickerIcon: (props) => (
              <CalendarMonthOutlinedIcon {...props} sx={{ color: '#2463EB' }} />
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
              placeholder: 'mm/dd/yyyy',
            },
            field: { clearable: true, onClear: () => setCleared(true) },
          }}
        />
      </LocalizationProvider>
      <FormLabel>Select Components</FormLabel>
      <FormControl fullWidth>
        <MySelect
          disabled
          IconComponent={() => (
            <InputAdornment position="end" className="pr-2">
              <KeyboardArrowDownOutlinedIcon fontSize="medium" color="info" />
            </InputAdornment>
          )}
          displayEmpty
          onChange={(event) => setAnswer(event.target.value as string)}
          renderValue={answer ? undefined : () => <div>Answer</div>}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
            </MenuItem>
          ))}
        </MySelect>
      </FormControl>

      <FormLabel>Autocomplete Components</FormLabel>
      <MyAutocomplete
        options={top100Films.map((option) => option.title)}
        disabled
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            sx={{
              fontFamily: 'Sarabun-Regular',
              height: '40px',
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                // endAdornment: <KeyboardArrowDownOutlinedIcon />,
              },
            }}
          />
        )}
      />
      <InputSearch
        value={value}
        setValue={setValue}
        label={'test search'}
        path={''}
        endAdornment={true}
        placeholder={'test search'}
        required={true}
        dataMapping={case1}
      />
    </div>
  )
}

export default Page
