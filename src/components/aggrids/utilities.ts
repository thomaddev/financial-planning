import { getCurrentYear, currencyFormatterForAggrid } from '@vise/kit'
import { MONTH_FEILD, MONTHS } from '@/data'
import dynamic from 'next/dynamic'
import { AgGridReact } from 'ag-grid-react'
const HeaderExtend = dynamic(() => import('@/components/aggrids/HeaderExtend'), {
  ssr: false,
})

export const adornmentFormatter = (params: any): string => {
  if (params.value) {
    const colParams = params.colDef.cellRendererParams
    return `${colParams?.beginAdornment ?? ''} ${params.value} ${colParams?.endAdornment ?? ''}`
  }
  return ''
}

/**
 * Generates a grid for the current year with collapsed months.
 * @param gridSetUp - Optional setup for grid configuration.
 * @returns An array of column definitions for the grid.
 */
export function generateGridCurrent(gridSetUp: any, gridRef: any, isExpand?: boolean) {
  const currentYear = getCurrentYear()
  const monthsArray = _generateMonthForGrid(gridSetUp)

  return [
    {
      field: 'year_1',
      headerComponent: HeaderExtend,
      headerComponentParams: {
        title: `ปีปัจจุบัน ${currentYear}`,
        toggle: () => {
          toggleMonthColumns(gridRef, 'january', MONTH_FEILD)
        },
        initialExpanded: isExpand,
      },
      type: 'rightAligned',
      minWidth: 130,
      maxWidth: 140,
      editable: () => !gridSetUp?.autoCalculate,
      valueParser: (params: any) => Number(params.newValue),
      valueFormatter: currencyFormatterForAggrid,
      valueGetter: gridSetUp?.currentYearGetter,
      aggFunc: 'sum',
    },
    ...monthsArray, // เพิ่มคอลัมน์เดือนโดยตรง
  ]
}

/**
 * Generates an array of column definitions for months in the grid.
 * @param gridSetUp - Optional setup for grid configuration.
 * @returns An array of column definitions for the months.
 */
function _generateMonthForGrid(gridSetUp: any) {
  const monthArray: any[] = []

  Object.values(MONTHS).forEach((e) => {
    const field = e.field
    monthArray.push({
      field,
      headerName: e.thaiText,
      editable: true,
      valueFormatter: currencyFormatterForAggrid,
      type: 'rightAligned',
      cellEditor: 'agNumberCellEditor',
      minWidth: 130,
      maxWidth: 130,
      aggFunc: 'sum',
      valueSetter: (params: any) =>
        gridSetUp?.monthValueSetter ? gridSetUp?.monthValueSetter(params, field) : false,
      cellRendererParams: {
        isValid: true, // ค่าเริ่มต้นของ isValid
        isManualPlan: false, // ค่าเริ่มต้นของ isManualPlan
      },
    })
  })

  return monthArray
}

/**
 * Resets all month values starting with 'm' to a specified value or 0.
 * @param obj - The object containing month values.
 * @param newValue - The new value to set for the months (default is 0).
 * @returns The updated object.
 */
export function updateValuesForKeysStartingWithM(obj: any, newValue?: any) {
  const updatedObject = { ...obj }

  // Iterate over object keys and update month values
  Object.keys(updatedObject).forEach((key) => {
    if (key.startsWith('m')) {
      updatedObject[key] = newValue ?? 0
    }
  })

  return updatedObject
}

/**
 * Generates a grid for the next 4 years from the current year.
 * @param gridSetUp - Optional setup for grid configuration.
 * @returns An array of column definitions for the grid.
 */
export function generateGridPlan(gridRef: React.RefObject<AgGridReact<any> | null>, gridSetUp?: any, isExpand?: boolean) {
  const currentYear = getCurrentYear()
  const nextYears = [...Array(4)].map((_, index) => (Number(currentYear) + 1 + index).toString())
  const forecastColumns: any[] = []

  // คอลัมน์หลัก "ประมาณการ" พร้อมปุ่ม toggle
  forecastColumns.push({
    field: 'forecast_toggle', // ฟิลด์นี้ไม่มีข้อมูลจริง แค่ใช้เป็น placeholder
    headerName: 'ประมาณการ',
    headerComponent: HeaderExtend,
    headerComponentParams: {
      title: 'คาดการณ์ 5 ปี',
      toggle: () => {
        const yearFields = nextYears.map((_, index) => `year_${index + 2}`) // คอลัมน์ year_2 ถึง year_5
        toggleMonthColumns(gridRef, 'year_2', yearFields)
      },
      initialExpanded: isExpand,
    },
    minWidth: 130,
    maxWidth: 140,
    suppressMenu: true,
    editable: false, // ไม่ให้แก้ไขในคอลัมน์นี้
  })

  // คอลัมน์สำหรับแต่ละปีถัดไป (year_2 ถึง year_5)
  nextYears.forEach((year, index) => {
    forecastColumns.push({
      headerName: year,
      field: `year_${index + 2}`,
      minWidth: 130,
      maxWidth: 140,
      type: 'rightAligned',
      aggFunc: 'sum',
      editable: () => true,
      valueParser: (params: any) => Number(params.newValue),
      valueFormatter: currencyFormatterForAggrid,
      cellRendererParams: {
        isManualPlan: false,
      },
      valueGetter: (params: any) =>
        gridSetUp?.planValueGetter
          ? gridSetUp?.planValueGetter
          : _defaultPlanValueGetter(params, `year_${index + 2}`, `year_${index + 1}`, index + 1),
      valueSetter: (params: any) =>
        gridSetUp?.planValueSetter
          ? gridSetUp?.planValueSetter(params, `year_${index + 2}`)
          : _defaultPlanValueSetter(params, `year_${index + 2}`),
    })
  })

  return forecastColumns
}

/**
 * Default value getter function for plan years.
 * @param params - The parameters for value getter.
 * @param field - The field name.
 * @param fieldPrevious - The previous field name.
 * @param indexOfCell - The index of the cell.
 * @returns The value for the specified field.
 */
const _defaultPlanValueGetter = (
  params: any,
  field: any,
  _fieldPrevious: any,
  _indexOfCell: any,
) => {
  // กรณีเป็นแถวกลุ่มหรือแถวสรุป
  if (params.node.footer) {
    return undefined
  }
  // กรณีเป็นแถวข้อมูลปกติ
  if (params.data && params.data[field] !== undefined) {
    return params.data[field]
  }
}

/**
 * Default value setter function for plan years.
 * @param params - The parameters for value setter.
 * @param field - The field name.
 * @returns A boolean indicating whether the value was successfully set.
 */
const _defaultPlanValueSetter = (params: any, field: any) => {
  const { newValue } = params
  // Set a flag indicating manual plan editing
  params.colDef.cellRendererParams['isManualPlan'] = true
  // Set the new value for the field
  params.data[field] = newValue
  return true // Return true to indicate successful value setting
}

/**
 * Toggles the visibility of month columns in the grid.
 * @param gridRef - The ref object for the grid.
 * @param key - The key of the column to toggle.
 * @param columnsToVisible - The columns to toggle.
 */
export const toggleMonthColumns = (gridRef: React.RefObject<AgGridReact<any> | null>, key: string, columnsToVisible: string[]) => {
  const currentVisibility = gridRef.current?.api?.getColumn(key)?.isVisible() ?? true // ตรวจสอบสถานะจากคอลัมน์แรก
  gridRef.current?.api?.setColumnsVisible(columnsToVisible, !currentVisibility)
}
