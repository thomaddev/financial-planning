'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { generateGridCurrent, generateGridPlan } from '@/components/aggrids/utilities'
import PlanningDetailBtn from '@/components/aggrids/PlanningDetailBtn'
import AgGridPlanning from '@/components/aggrids/Aggrid'
import { AgGridReact } from 'ag-grid-react'
import { StepProps } from '../page'
import { FIELD_MONTHS, MONTH_FEILD } from '@/data'
import { removeDuplicates } from '@vise/kit'
import { usePlanFormStore } from '@/lib/stores/planFormStore'

const Step5: React.FC<StepProps> = ({ formAction }) => {
  const [formSubData, _setFormSubData] = useState<any>({})
  const [openDialog, setOpenDialog] = useState(false)
  const gridRef = useRef<AgGridReact>(null)

  const { gridApiKpi, setGridApiKpi, kpiData } = usePlanFormStore()

  // รับข้อมูล KPI จาก projectData ที่ถูกแปลงใน ProjectPlanning
  const [rowData, setRowData] = useState<any[]>([])

  // Sync rowData กับ kpiData เมื่อ kpiData เปลี่ยน
  useEffect(() => {
    setRowData(kpiData)
  }, [kpiData])

  const monthValueSetter = useCallback((params: any, field: string) => {
    const { data, colDef, newValue } = params
    const sumOfM1ToM12 = Object.keys(data).filter((value) => FIELD_MONTHS.includes(value))
    const summary = removeDuplicates([...sumOfM1ToM12, field]).reduce((acc, fieldName) => {
      let fieldValue = data[fieldName] || 0
      if (colDef.field === fieldName) {
        fieldValue = newValue
      }
      return acc + Number(fieldValue)
    }, 0)

    const year1Value = data.year_1 || 0

    if (summary <= year1Value) {
      params.data[field] = newValue
      params.colDef.cellRendererParams['isValid'] = true
      params.colDef.cellRendererParams['isManualPlan'] = true
      return true
    }
    params.colDef.cellRendererParams['isValid'] = false
    params.data[field] = data[field] ?? 0
    return false
  }, [])

  const columnDefs = [
    {
      headerName: 'ตัวชี้วัดเชิงปริมาณ',
      field: 'kpi_quantity_name',
      minWidth: 150,
      maxWidth: 150,
      editable: false,
      valueGetter: (params) => {
        if (params.node?.rowPinned === 'bottom') {
          // สำหรับแถว footer ให้ใช้ค่าจาก totals
          return params.data?.no || 'ราคารวม'
        }
        return params.data?.kpi_quantity_name
      },
      colSpan: (params) => {
        // ถ้าเป็นแถว footer ให้กิน 2 คอลัมน์
        if (params.node?.rowPinned === 'bottom') {
          return 2
        }
        return 1 // แถวปกติกิน 1 คอลัมน์
      },
      cellStyle: (params) => {
        if (params.node?.rowPinned === 'bottom') {
          return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontWeight: 'bold', // ทำให้ตัวอักษรหนาขึ้น
            color: '#333', // เปลี่ยนสีตัวอักษร
          }
        }
      },
    },
    {
      headerName: 'หน่วยนับ',
      field: 'kpi_quantity_uom',
      minWidth: 150,
      maxWidth: 150,
      editable: false,
    },
    ...generateGridCurrent({ monthValueSetter: monthValueSetter }, gridRef, false),
    ...generateGridPlan(gridRef),
  ]

  const handleGridReady = (params: any) => {
    gridRef.current = params
    setGridApiKpi(params.api) // บันทึก API ลงใน store
    params.api.setGridOption('rowData', rowData)
    params.api.setColumnsVisible(MONTH_FEILD, false)
  }

  const onSubmitKPI = (formDialog: any) => {
    console.log('Form Dialog:', formDialog)
    const mappedData = {
      kpi_quantity_name: formDialog.kpi_quantity_name,
      kpi_quantity_uom: formDialog.kpi_quantity_uom,
      year_1: formDialog.kpi_plan_period_1,
      year_2: formDialog.kpi_plan_period_2,
      year_3: formDialog.kpi_plan_period_3,
      year_4: formDialog.kpi_plan_period_4,
      year_5: formDialog.kpi_plan_period_5,
      january: 0, // ค่าเริ่มต้นสำหรับเดือน
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    }
    if (gridApiKpi) {
      gridApiKpi.applyTransaction({ add: [mappedData] }) // เพิ่มแถวใหม่ลงในตาราง
    } else {
      alert('gridApiKpi is not initialized yet')
    }
    setOpenDialog(false)
  }

  const onActionRow = (params: any) => {
    console.log('Action row:', params)
    if (params.action === 'delete' && gridRef.current?.api) {
      gridRef.current.api.applyTransaction({ remove: [params.form] })
    }
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5">ตัวชี้วัดความสำเร็จของโครงการ</Typography>
          <Typography variant="body2" color="textSecondary">
            บอกสาเหตุหรือปัญหาที่ทำให้เกิดโครงการนี้ขึ้น และการแก้ไขปัญหาผ่านโครงการนี้
          </Typography>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <PlanningDetailBtn
          formAction={formAction}
          docType="Project KPI Item"
          toggleDialog={openDialog}
          initialData={formSubData}
          onSubmitDialog={onSubmitKPI}
          onCloseDialog={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Box>
      <div className="h-[500px]">
        <AgGridPlanning
          gridRef={gridRef}
          rowData={rowData}
          handleGridReady={handleGridReady}
          onActionRow={onActionRow}
          columnDefs={columnDefs}
        />
      </div>
    </>
  )
}

export default Step5
