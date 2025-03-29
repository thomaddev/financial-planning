'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { CALCULATOR_TYPE } from '@/data'
import { useTranslations } from 'next-intl'
import { themeQuartz, type ColDef } from 'ag-grid-community'
import { getRandomId } from '@/utils/helper'
import CalculatorGridDialog from './CalculatorGridDialog'
import dynamic from 'next/dynamic'

const CustomNoRowsOverlay = dynamic(() => import('@/components/aggrids/CustomNoRowsOverlay'), {
  ssr: false,
})

const myTheme = themeQuartz.withParams({})

interface AgGridPlanningProps {
  handleGridReady: (params: any) => void
  onActionRow: (params: any) => void
  rowData: any[]
  gridRef: React.RefObject<AgGridReact<any> | null>
  columnDefs: ColDef[] // Accept column definitions as a prop
}

const AgGridPlanning: React.FC<AgGridPlanningProps> = ({
  handleGridReady,
  onActionRow,
  rowData,
  gridRef,
  columnDefs,
}) => {
  const t = useTranslations()
  const [showDialogCalculator, setShowDialogCalculator] = useState(false)
  const [initialYearValue, setInitialYearValue] = useState(0)
  const [pinnedBottomRows, setPinnedBottomRows] = useState<any[]>([])

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 0
  }

  const recalcPinnedBottomRow = useCallback(() => {
    if (gridRef?.current?.api) {
      const api: any = gridRef.current.api
      const newTotals: any = {
        gridId: 'total',
        no: 'ราคารวม',
        template_link_detail: {
          quantity: 0,
          per_price: 0,
          quantity_request: 0,
          rate: 0,
          duration: 0,
        },
        year_1: 0,
        year_2: 0,
        year_3: 0,
        year_4: 0,
        year_5: 0,
      }

      api.forEachNode((node: any) => {
        if (node.group) return
        columnDefs.forEach((col: any) => {
          if (col.aggFunc === 'sum' && col.field) {
            const value = getNestedValue(node.data, col.field)
            if (col.field === 'template_link_detail.quantity') {
              newTotals.template_link_detail.quantity += Number(value) || 0
            } else if (col.field === 'template_link_detail.per_price') {
              newTotals.template_link_detail.per_price += Number(value) || 0
            } else if (col.field === 'template_link_detail.quantity_request') {
              newTotals.template_link_detail.quantity_request += Number(value) || 0
            } else if (col.field === 'template_link_detail.rate') {
              newTotals.template_link_detail.rate += Number(value) || 0
            } else if (col.field === 'template_link_detail.duration') {
              newTotals.template_link_detail.duration += Number(value) || 0
            } else {
              newTotals[col.field] = (newTotals[col.field] || 0) + (Number(value) || 0)
            }
          }
        })
      })

      console.log('Calculated totals:', newTotals)
      setPinnedBottomRows([newTotals])
    }
  }, [gridRef, columnDefs])

  // เรียกใช้ recalcPinnedBottomRow เมื่อ cell value เปลี่ยนแปลง
  const onCellValueChanged = useCallback(() => {
    recalcPinnedBottomRow()
  }, [recalcPinnedBottomRow])

  // เรียก recalcPinnedBottomRow ครั้งแรกเมื่อ grid พร้อมใช้งาน
  useEffect(() => {
    recalcPinnedBottomRow()
  }, [recalcPinnedBottomRow])

  // getRowId function (Converted from Vue)
  const getRowId = useCallback((params: any) => params.data.gridId, [])

  // Context Menu Options
  const getContextMenuItems = useCallback(
    (params: any) => {
      return [
        {
          name: t('tool.calculation_options'),
          action: () => {
            setShowDialogCalculator(true)
            params.node.setSelected(true)
            setInitialYearValue(params.node.data.year_1)
          },
        },
        {
          name: `${t('aggrid.copy_row')}`,
          action: () => {
            const newRow = {
              ...params?.node?.data,
              name: getRandomId(),
            }
            onActionRow({ action: 'copy', form: newRow })
            recalcPinnedBottomRow()
          },
        },
        {
          name: `${t('aggrid.edit_row')}`,
          action: () => {
            onActionRow({ action: 'edit', form: params?.node?.data })
            if (gridRef?.current?.api) {
              gridRef?.current?.api.deselectAll()
            }
            recalcPinnedBottomRow()
          },
        },
        {
          name: `${t('aggrid.delete_row')}`,
          action: () => {
            if (gridRef?.current?.api) {
              onActionRow({ action: 'delete', form: params?.node?.data })
              // gridRef?.current?.api.applyTransaction({ remove: [params.node.data] })
              gridRef?.current?.api.deselectAll()
              recalcPinnedBottomRow()
            }
          },
        },
        'separator',
        'export',
      ]
    },
    [gridRef, onActionRow, recalcPinnedBottomRow, t],
  )

  const onSubmitCalculatorDialog = (formDialog: any) => {
    setShowDialogCalculator(false)

    const current = Number(formDialog.current)
    const additionValueForAdjust = Number(formDialog.additionValueForAdjust)
    const additionValueForReplace = Number(formDialog.additionValueForReplace)

    if (!gridRef) return // Ensure gridApi is available

    const selectedNodes = gridRef.current?.api?.getSelectedNodes() // Get selected rows
    if (selectedNodes?.length === 0) return

    const selectedRow = selectedNodes?.[0].data

    // Set current year to first year
    selectedRow['year_1'] = current

    if (formDialog.type === CALCULATOR_TYPE.replace) {
      for (let i = 2; i <= 5; i++) {
        const currentYearKey = `year_${i}`
        if (formDialog.typeForAdjust === 'bath') {
          selectedRow[currentYearKey] = current + additionValueForReplace
        } else if (formDialog.typeForAdjust === 'percent') {
          selectedRow[currentYearKey] = current * (1 + additionValueForReplace / 100)
        }
      }
    } else {
      for (let i = 2; i <= 5; i++) {
        const prevYearKey = `year_${i - 1}`
        const currentYearKey = `year_${i}`
        if (formDialog.typeForAdjust === 'bath') {
          selectedRow[currentYearKey] = (selectedRow[prevYearKey] || 0) + additionValueForAdjust
        } else if (formDialog.typeForAdjust === 'percent') {
          selectedRow[currentYearKey] =
            (selectedRow[prevYearKey] || 0) * (1 + additionValueForAdjust / 100)
        }
      }
    }

    gridRef.current?.api?.applyTransaction({ update: [selectedRow] })
    recalcPinnedBottomRow()
    // Deselect all rows after processing
    gridRef.current?.api?.deselectAll()
  }

  const gridOptions = useMemo(
    () => ({
      pagination: false,
      // suppressPaginationPanel: true, // Hide default AG Grid pagination
      suppressAggFuncInHeader: true,
      suppressColumnVirtualisation: true, // ปิดการใข้งานการ lazy loading ของ column
      // paginationPageSize: pageSize,
      // groupIncludeFooter: true, // เพิ่มแถว footer สำหรับแต่ละกลุ่ม
      // groupIncludeTotals: false, // รวมผลรวมใน footer
    }),
    [],
  )

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      suppressMenu: true,
    }
  }, [])

  const onRowDragEnd = useCallback(() => {
    if (!gridRef?.current?.api) return // ตรวจสอบว่า gridRef และ api มีค่าหรือไม่

    const newRowData: any[] = []
    gridRef.current?.api?.forEachNode((node) => {
      newRowData.push(node.data)
    })
    // setRowData(newRowData); // ลบออกถ้า AgGridPlanning ไม่ได้จัดการ state เอง
    gridRef.current?.api?.redrawRows() // รีเฟรชแถวทั้งหมดเพื่ออัปเดตลำดับ
  }, [gridRef]) // ลบ setRowData ออกจาก dependency ถ้าไม่ใช้

  const onFirstDataRendered = useCallback(() => {
    recalcPinnedBottomRow()
  }, [recalcPinnedBottomRow])

  return (
    <>
      <AgGridReact
        className="ag-my-plan"
        ref={gridRef}
        theme={myTheme}
        getContextMenuItems={getContextMenuItems}
        getRowId={getRowId}
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={handleGridReady}
        onRowClicked={onActionRow}
        gridOptions={gridOptions}
        defaultColDef={defaultColDef}
        rowDragManaged={true}
        animateRows={true}
        onRowDragEnd={onRowDragEnd}
        pinnedBottomRowData={pinnedBottomRows}
        onCellValueChanged={onCellValueChanged}
        onFirstDataRendered={onFirstDataRendered}
        noRowsOverlayComponent={CustomNoRowsOverlay}
        noRowsOverlayComponentParams={{
          isImage: true,
          title: 'ไม่มีข้อมูล',
          description: 'ไม่พบข้อมูลที่ต้องการ',
        }}
      />
      {/* Calculator Dialog */}
      <CalculatorGridDialog
        toggleDialog={showDialogCalculator}
        currentYear={initialYearValue}
        onSubmitDialog={onSubmitCalculatorDialog}
        onCancelDialog={() => setShowDialogCalculator(false)}
      />{' '}
    </>
  )
}

export default AgGridPlanning
