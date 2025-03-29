import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Button } from '@mui/material'

const CustomPagination = (props) => {
  // ใช้ state เก็บค่าต่าง ๆ ของ pagination
  const { currentPage, pageSize, rowCount, onPageChange } = props

  // Calculate total pages based on server-side data
  const totalPages = Math.ceil(rowCount / pageSize) || 1

  // Calculate row indices for display
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(startIndex + pageSize - 1, rowCount)

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center gap-2 h-12">
      {/* แสดงผลในรูปแบบ "1 - 10 of 52" */}
      <span className="text-gray-500">{`${startIndex} - ${endIndex} of ${rowCount}`}</span>

      {/* ปุ่มเลื่อนหน้า */}
      <Button
        onClick={goToPreviousPage}
        variant="text"
        sx={{
          border: 'none',
          ':hover': {
            background: 'inherit',
          },
          background: 'inherit',
          minWidth: 0,
        }}
        disableRipple
        disabled={currentPage === 1}
      >
        <KeyboardArrowLeftIcon fontSize="small" />
      </Button>
      <Button
        onClick={goToNextPage}
        variant="text"
        sx={{
          border: 'none',
          ':hover': {
            background: 'inherit',
          },
          background: 'inherit',
          minWidth: 0,
        }}
        disableRipple
        disabled={endIndex === rowCount}
      >
        <KeyboardArrowRightIcon fontSize="small" />
      </Button>
    </div>
  )
}

export default CustomPagination
