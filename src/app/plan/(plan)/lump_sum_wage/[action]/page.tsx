'use client'

import { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { removeDuplicates } from '@vise/kit'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { generateGridCurrent, generateGridPlan } from '@/components/aggrids/utilities'
import { FIELD_MONTHS, MONTH_FEILD, TEMPLATE_DOCTYPE } from '@/data'
import { useSavePlanning, useSubmitPlanning } from '@/lib/api/planning'
import { useGridActions } from '@/lib/hooks/useGridActions'
import { useGetPlanning } from '@/lib/api/planning'
import { getGridRowData, transformBudgetFromTemplate } from '@/utils/gridHelper'
import { convertParamsMaster } from '@/utils/helper'
import AddRowButton from '@/components/buttons/AddRowButton'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
import dynamic from 'next/dynamic'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const AgGridPlanning = dynamic(() => import('@/components/aggrids/Aggrid'), {
  ssr: false,
})
const DropdownMenu = dynamic(() => import('@/components/buttons/DropdownMenu'), {
  ssr: false,
})

export default function LumpSumWage() {
  const params = useParams()
  const action = params.action as string

  const t = useTranslations()
  const gridRef = useRef<AgGridReact<any>>(null)
  const {
    formHeader,
    rowData,
    submitting,
    setRowData,
    setGridRef,
    setSubmitting,
    setFormAction,
    id,
    setFormHeader,
    setId,
  } = usePlanFormStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const {
    handleActionRow,
    handleSubmitDialog,
    handleCloseDialog,
    handleOpenDialog,
    handleChangeFormDataGrid,
    isDialogOpen,
    editData,
  } = useGridActions({
    gridRef,
    docType: TEMPLATE_DOCTYPE.lump_sum_wage,
    setRowData,
  })

  // Fetch lump sum wage data using the reusable hook
  const { data: lumpSumWageData } = useGetPlanning(id)

  // Set form header when data changes
  useEffect(() => {
    if (lumpSumWageData && id !== 'new') {
      setFormHeader(lumpSumWageData)
      setRowData(lumpSumWageData.budget_items || [])
    }
  }, [lumpSumWageData, id, setFormHeader, setRowData])

  // Set initial form action based on route
  useEffect(() => {
    setFormAction(action as 'create' | 'update')
  }, [action, setFormAction])

  const { mutateAsync: savePlan } = useSavePlanning()
  const { mutateAsync: submitPlan } = useSubmitPlanning()

  const submitPlanning = async () => {
    setSubmitting(true)
    try {
      await submitPlan(id)
      setFormAction('update')
    } catch (error) {
      console.error('Failed to submit planning:', error)
    } finally {
      setSubmitting(false)
      handleClose()
    }
  }

  const submitForm = useCallback(async () => {
    setSubmitting(true)
    try {
      const gridData = getGridRowData(gridRef)

      const budgetPlans = gridData.map((row) => ({
        ...row,
        document_type: TEMPLATE_DOCTYPE.lump_sum_wage,
      }))

      const params = {
        ...formHeader,
        template_type: TEMPLATE_DOCTYPE.lump_sum_wage,

        budget_items: transformBudgetFromTemplate(budgetPlans),
      }
      const res = await savePlan(convertParamsMaster(params))
      // Set FormAction to update when save success
      setFormAction('update')
      if (res && res.name) {
        setId(res.name)
      }
    } catch (error) {
      console.error('Failed to save planning:', error)
    } finally {
      setSubmitting(false)
      handleClose()
    }
  }, [setSubmitting, formHeader, savePlan, setFormAction, setId])

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


  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: t('fields.no'),
        field: 'no', // เพิ่ม field เพื่อให้สามารถกำหนดค่าใน totals ได้
        valueGetter: (params) => {
          if (params.node?.rowPinned === 'bottom') {
            // สำหรับแถว footer ให้ใช้ค่าจาก totals
            return params.data?.no || 'ราคารวม'
          }
          // สำหรับแถวปกติ ให้คำนวณลำดับ
          return (params.node?.rowIndex ?? -1) + 1
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
        minWidth: 100,
        maxWidth: 120,
      },
      {
        headerName: t('fields.title'),
        field: 'template_link_detail.title',
        minWidth: 160,
        maxWidth: 160,
        editable: false,
      },
      ...generateGridCurrent(
        {
          monthValueSetter: monthValueSetter,
        },
        gridRef,
        false,
      ),
      ...generateGridPlan(gridRef),
      {
        headerName: t('header.configuration'),
        rowDrag: true, // เปิดใช้งานการลากแถวในคอลัมน์นี้
        minWidth: 90, // ความกว้างเล็กๆ สำหรับไอคอนลาก
        maxWidth: 90,
        suppressMenu: true, // ปิดเมนูบริบทในคอลัมน์นี้
        suppressAutoSize: true,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        },
      },
    ],
    [monthValueSetter, t],
  )

  return (
    <>
      <Box className="absolute top-[62px] right-[80px] ml-2 px-[8px] py-[7px]">
        <DropdownMenu
          menuItems={[
            { menu: 'save', handleClick: submitForm },
            { menu: 'submit', handleClick: submitPlanning },
          ]}
          handleClose={handleClose}
          open={open}
          anchorEl={anchorEl}
          buttonName="Action"
          docStatus={formHeader.docstatus}
          endIcon={
            <KeyboardArrowDownIcon
              sx={{
                color:
                  formHeader.docstatus === 1
                    ? 'var(--color-input-stroke)'
                    : 'var(--text-brand-default)',
                fontSize: '24px',
              }}
            />
          }
          handleClick={handleClick}
        />
      </Box>
      <AddRowButton
        docStatus={formHeader.docstatus}
        docType={TEMPLATE_DOCTYPE.lump_sum_wage}
        isDialogOpen={isDialogOpen}
        onOpenDialog={() => handleOpenDialog('add')}
        onCloseDialog={handleCloseDialog}
        onChangeFormDataGrid={handleChangeFormDataGrid}
        handleSubmitDialog={handleSubmitDialog}
        formData={editData}
      />
      <div className="h-full">
        <AgGridPlanning
          gridRef={gridRef}
          rowData={rowData}
          handleGridReady={(params) => {
            gridRef.current = params
            setGridRef(gridRef as React.RefObject<AgGridReact>)
            params.api.setColumnsVisible(MONTH_FEILD, false)
          }}
          onActionRow={handleActionRow}
          columnDefs={columnDefs}
        />
      </div>
    </>
  )
}
