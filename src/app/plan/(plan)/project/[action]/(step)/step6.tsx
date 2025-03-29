'use client'
import { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { currencyFormatterForAggrid } from '@vise/kit'
import PlanningDetailBtn from '@/components/aggrids/PlanningDetailBtn'
import AgGridPlanning from '@/components/aggrids/Aggrid'
import { AgGridReact } from 'ag-grid-react'
import { useTranslations } from 'next-intl'
import { StepProps } from '../page'

const Step6: React.FC<StepProps> = ({ formAction }) => {
  const [showDialogAddTemplate, setShowDialogAddTemplate] = useState(false)
  const [rowDataBudgetGroup, setRowDataBudgetGroup] = useState<any[]>([])
  const [rowDataBudget, setRowDataBudget] = useState<any[]>([])
  const [rowDataTemplate, setRowDataTemplate] = useState<any[]>([])
  const [templateDocType, _setTemplateDocType] = useState('')
  const [gridApiParent, _setGridApiParent] = useState<any>(null)

  const gridRef = useRef<AgGridReact>(null)

  const t = useTranslations()

  const parentColumnDefs = [
    { field: 'budget_activity_name', rowGroup: true, hide: true },
    { field: 'fund_group_category', rowGroup: true, hide: true },
    { field: 'fund_group_desc', headerName: 'ประเภทงบประมาณ', flex: 1 },
    { field: 'count', headerName: 'จำนวนรายการ' },
    {
      field: 'sum',
      headerName: 'งบประมาณรวม',
      valueFormatter: currencyFormatterForAggrid,
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'จัดการ',
      //   cellRenderer: ButtonAddBudget,
      //   cellRendererParams: { onClick: handleActionTemplate },
      minWidth: 150,
    },
  ]

  // const templateColumnDefs = [
  //   { field: 'template_link_detail.name', headerName: 'ชื่อ', minWidth: 200 },
  //   { field: 'template_link_detail.value', headerName: 'มูลค่า', minWidth: 150, editable: true },
  //   ...generateGridCurrent({}),
  //   ...generateGridPlan({}),
  // ]

  const updateRowDataParent = () => {
    const newMapRow = mapBudgetItemsToRows(rowDataBudget, [])
    setRowDataBudgetGroup(newMapRow)
    if (gridApiParent) {
      gridApiParent.setGridOption('rowData', newMapRow)
    }
  }

  function mapBudgetItemsToRows(budgetItems: any[], rows: any[]) {
    let preparedRows: any[] = []

    const groupedByActivity = budgetItems.reduce((acc, item) => {
      const activityName = item.budget_activity_name
      if (!acc[activityName]) acc[activityName] = []
      acc[activityName].push(item)
      return acc
    }, {})

    Object.keys(groupedByActivity).forEach((activityName) => {
      const activityItems = groupedByActivity[activityName]

      const sumAndCountByFundGroup = activityItems.reduce((acc, item) => {
        const fundGroup = item.fund_group
        if (!acc[fundGroup]) acc[fundGroup] = { count: 0, sum: 0 }
        acc[fundGroup].count += 1
        acc[fundGroup].sum += item.year_1 || 0
        return acc
      }, {})

      const duplicatedRows = rows.map((row) => {
        const fundGroupData = sumAndCountByFundGroup[row.fund_group] || { count: 0, sum: 0 }
        return {
          ...row,
          id: `${row.name}_${row?.fund_group}_${activityItems?.[0]?.name}`,
          budget_activity_name: activityName,
          count: fundGroupData.count,
          sum: fundGroupData.sum,
        }
      })

      preparedRows = preparedRows.concat(duplicatedRows)
    })

    return preparedRows
  }

  // const handleActionTemplate = (gridRow: any) => {
  //   setFormDataTemplate({})
  //   setTemplateDocType(gridRow?.data?.document_type)
  //   setShowDialogAddTemplate(true)
  // }

  const onSubmitDialogTemplate = (formDialog: any) => {
    setRowDataTemplate((prev) => [...prev, formDialog])
    setShowDialogAddTemplate(false)
  }

  const handleOkDialogTemplate = () => {
    const rowsTemplateChild = rowDataTemplate

    rowsTemplateChild.forEach((childRow) => {
      const existingIndex = rowDataBudget.findIndex((budgetRow) => budgetRow.id === childRow.id)
      if (existingIndex !== -1) {
        rowDataBudget[existingIndex] = childRow
      } else {
        rowDataBudget.push(childRow)
      }
    })

    setRowDataBudget([...removeDuplicates(rowDataBudget)])
    updateRowDataParent()
    setShowDialogAddTemplate(false)
  }

  function removeDuplicates(arr: any[]) {
    const seen = new Set()
    return arr.filter((obj) => {
      if (seen.has(obj.id)) return false
      seen.add(obj.id)
      return true
    })
  }

  const onActionRow = (params: any) => {
    console.log('Action row:', params)
  }

  return (
    <Box py={4}>
      <Grid container spacing={4}>
        {/* Section Title */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5">ประเภทงบประมาณ</Typography>
          <Typography variant="body2" color="textSecondary">
            ระบุข้อมูลบุคคลที่เกี่ยวข้องกับโครงการ
            ผู้รับผิดชอบโครงการและผู้ประสานงานที่สามารถติดต่อและตัดสินใจได้
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {/* <PlanningDetailBtn
            formAction={formAction}
            docType="Budget Planning Item"
            onSubmitDialog={onSubmitDialogTemplate}
            toggleDialog={false}
            onCloseDialog={() => console.log()}
          /> */}
        </Box>

        {/* <AgGridPlanning
          gridRef={gridRef.current}
          rowData={rowDataBudgetGroup}
          handleGridReady={(params) => (gridRef.current = params)}
          onActionRow={onActionRow}
          columnDefs={parentColumnDefs}
          gridRefConstant={gridRef}
        /> */}

        <Dialog
          open={showDialogAddTemplate}
          onClose={() => setShowDialogAddTemplate(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>{t('addItem')}</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <PlanningDetailBtn
                formAction={formAction}
                docType={templateDocType}
                onSubmitDialog={onSubmitDialogTemplate}
                toggleDialog={false}
                onCloseDialog={function (): void {
                  throw new Error('Function not implemented.')
                }}
              />
            </Box>
            {/* <AgGridPlanning
              columnDefs={templateColumnDefs}
              rowData={rowDataTemplate}
              onGridReady={setGridApiTemplate}
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialogAddTemplate(false)}>{t('cancel')}</Button>
            <Button variant="contained" color="primary" onClick={handleOkDialogTemplate}>
              {t('save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Step6
