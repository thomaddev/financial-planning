'use client'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Typography from '@mui/material/Typography'
import {
  RowSelectedEvent,
  RowSelectionOptions,
  SelectionColumnDef,
  StatusPanelDef,
  themeQuartz,
  type ColDef,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useTranslations } from 'next-intl'
import { findRoutePathFromTemplateDoctype } from '@/utils/helper'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomPagination from '@/components/aggrids/CustomPagination'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import dynamic from 'next/dynamic'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
import { removeDuplicates } from '@vise/kit/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/th' // นำเข้า locale ภาษาไทย
import { Switch } from '@mui/material'
import { generateGridCurrent, generateGridPlan } from '@/components/aggrids/utilities'
import { getPlanningData } from '@/lib/services/planningService'
import mockData from '@/data/mock_board.json'
const InputFilter = dynamic(() => import('@/components/aggrids/InputFilter'), {
  ssr: false,
})
const LableStatus = dynamic(() => import('@/components/LableStatus'), {
  ssr: false,
})
const CustomGroupCellRenderer = dynamic(
  () => import('@/components/aggrids/CustomGroupCellRenderer'),
  {
    ssr: false,
  },
)
const ActionButton = dynamic(() => import('@/components/buttons/ActionButton'), {
  ssr: false,
})

// ตั้งค่า locale เป็นภาษาไทย
dayjs.locale('th')

const CustomNoRowsOverlay = dynamic(() => import('@/components/aggrids/CustomNoRowsOverlay'), {
  ssr: false,
})

const myTheme = themeQuartz.withParams({
  columnBorder: { style: 'solid', color: '#DADBE2' },
})

export default function Home() {
  const gridRef = useRef<AgGridReact>(null)
  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = (document.getElementById('filter-text-box') as HTMLInputElement).value
    const filtered = {
      record_name: {
        type: 'contains',
        filter: filterText,
      },
    }
    gridRef.current!.api.setFilterModel(filtered)
  }, [])

  const t = useTranslations()
  const router = useRouter()
  const categoryQuery = useSearchParams().get('cate')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { setId } = usePlanFormStore()
  const [activeTab, setActiveTab] = useState('all')
  const [rowSelect, setRowSelect] = useState<string[]>([])
  const [isVerify, setIsVerify] = useState(false)

  const monthValueSetter = useCallback((params: any, field: string) => {
    const { data, colDef, newValue } = params
    const sumOfMonths = Object.keys(data).filter((value) =>
      [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ].includes(value),
    )
    const summary = removeDuplicates([...sumOfMonths, field]).reduce((acc, fieldName) => {
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

  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'submit',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        hide: true,
      },
      {
        headerName: 'Groups custom',
        showRowGroup: 'category',
        filter: 'agTextColumnFilter',
        headerComponent: InputFilter,
        headerComponentParams: {
          onFilterTextBoxChanged: onFilterTextBoxChanged,
        },
        cellRenderer: CustomGroupCellRenderer,
        pinned: 'left',
        minWidth: 300,
        colSpan: (params) => {
          if (params.node && params.node.footer) {
            return 2
          }
          return 1
        },
      },
      {
        field: 'category',
        rowGroup: true,
        hide: true,
        minWidth: 300,
        maxWidth: 300,
      },
      {
        field: 'docstatus',
        headerName: 'Status',
        pinned: 'left',
        minWidth: 130,
        maxWidth: 130,
        headerClass: 'docstatus',
        cellStyle: {
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        cellClass: 'docstatus',
        cellRenderer: LableStatus,
        cellRendererParams: (props) => {
          // ตรวจสอบว่า props.value มีค่าเป็น undefined หรือ null หรือไม่
          if (props.value === undefined || props.value === null) return null

          // กำหนด title และ status ตาม docstatus
          const title = props.value === 0 ? 'Save' : 'Submitted'
          const status = props.value === 0 ? 'success' : 'info'
          return {
            title: title,
            status: status,
          }
        },
      },
      {
        field: 'template_type',
        hide: true,
        minWidth: 130,
        maxWidth: 130,
      },
      {
        field: 'record_name',
        headerName: 'record_name',
        hide: true,
        filter: 'agTextColumnFilter',
      },
      ...generateGridCurrent(
        {
          monthValueSetter: monthValueSetter,
        },
        gridRef,
        true,
      ),
      ...generateGridPlan(gridRef, true),
    ],
    [monthValueSetter, onFilterTextBoxChanged],
  )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Replace mockData with getPlanningData()
  const listPlanning = getPlanningData(mockData)
  const isLoadingListPlanning = false

  // Column Definitions: Defines the columns to be displayed.
  const defaultColDef: ColDef = {
    flex: 1,
    suppressMenu: true,
  }

  const onRowClicked = useCallback(
    (event: any) => {
      if (!event.node.group && !event.node.footer && event.data?.record_name) {
        const routePath = findRoutePathFromTemplateDoctype(event.data?.template_type)
        setId(event.data.record_name)
        router.push(`/plan/${routePath}/update`)
      }
    },
    [router, setId],
  )

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery as string)
    } else {
      setSelectedCategory('all')
    }
  }, [categoryQuery, router])

  // Grid Options
  const gridOptions = useMemo(
    () => ({
      pagination: true,
      // suppressPaginationPanel: true, // Hide default AG Grid pagination
      suppressColumnVirtualisation: true, // ปิดการใข้งานการ lazy loading ของ column
      suppressAggFuncInHeader: true,
      paginationPageSize: pageSize,
      groupIncludeFooter: true, // เพิ่มแถว footer สำหรับแต่ละกลุ่ม
      groupIncludeTotals: false, // รวมผลรวมใน footer
    }),
    [pageSize],
  )

  const rowSelection = useMemo<RowSelectionOptions | 'single' | 'multiple' | undefined>(() => {
    if (isVerify) {
      return {
        mode: 'multiRow',
        isRowSelectable: (rowNode) => {
          // ถ้าเป็น group node
          if (rowNode.group) {
            console.log('rowNode.group', rowNode.group)
            const children = rowNode.childrenAfterGroup || []
            // ตรวจสอบว่า child nodes ทั้งหมดมี docstatus เป็น 1 หรือไม่
            const allChildrenAreDraft = children.every(
              (childNode) => childNode.data?.docstatus === 1,
            )
            // ถ้า child ทั้งหมดเป็น docstatus 0 ให้ซ่อน checkbox (ไม่สามารถเลือกได้)
            return !allChildrenAreDraft
          }
          // สำหรับ row ปกติ (ไม่ใช่ group) ตรวจสอบ docstatus
          return rowNode.data ? rowNode.data.docstatus === 0 : true
        },
        hideDisabledCheckboxes: true, // ซ่อน checkbox ที่ถูกปิดใช้งาน
      }
    } else {
      return undefined
    }
  }, [isVerify])

  const selectionColumnDef = useMemo<SelectionColumnDef>(() => {
    return {
      sortable: true,
      resizable: true,
      width: 120,
      suppressHeaderMenuButton: false,
      pinned: 'left',
      cellRenderer: 'agCheckboxCellRenderer',
      cellEditor: 'agCheckboxCellEditor',
    }
  }, [])

  // Status Bar with CustomPagination
  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[]
  }>(() => {
    // กำหนด rowCount ตาม tab ที่เลือก
    const getRowCount = () => {
      switch (selectedCategory) {
        case 'revenue':
          return listPlanning?.revenue_count || 0
        case 'expense':
          return listPlanning?.expense_count || 0
        case 'project':
          return listPlanning?.project_count || 0
        case 'all':
        default:
          return listPlanning?.total || 0
      }
    }

    return {
      statusPanels: [
        {
          statusPanel: CustomPagination,
          statusPanelParams: {
            pageSize: listPlanning?.page_size || pageSize, // จาก API
            currentPage: listPlanning?.page || 1, // จาก API
            rowCount: getRowCount(), // Dynamic ตาม tab
            onPageChange: (newPage: number) => setPage(newPage), // อัปเดตหน้า
          },
        },
      ],
    }
  }, [pageSize, listPlanning, selectedCategory])

  const tabs = [
    { value: 'all', label: 'ทั้งหมด', count: listPlanning?.total || 0 },
    // { value: 'revenue', label: 'รายได้', count: listPlanning?.revenue_count || 0 },
    // { value: 'expense', label: 'รายจ่าย', count: listPlanning?.expense_count || 0 },
    // { value: 'project', label: 'โครงการ', count: listPlanning?.project_count || 0 },
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    setSelectedCategory(newValue)
    setPage(1)
  }

  const onRowSelected = useCallback((event: RowSelectedEvent) => {
    const api = gridRef.current?.api
    if (!api) return

    // ตรวจสอบว่าเป็น group row หรือไม่
    if (event.node.group) {
      const isSelected = event.node.isSelected()
      const groupChildren = event.node.childrenAfterGroup || []

      // อัปเดตการเลือกของ row ลูกใน group
      groupChildren.forEach((childNode: any) => {
        childNode.setSelected(isSelected)
      })

      // ดึง record_name ของ row ลูกทั้งหมดใน group
      const childRecordNames = groupChildren
        .filter((childNode: any) => childNode.data?.record_name) // กรองเฉพาะ row ที่มี record_name
        .map((childNode: any) => childNode.data.record_name)

      // อัปเดต rowSelect
      setRowSelect((prev) => {
        if (isSelected) {
          // เพิ่ม record_name ของ row ลูกทั้งหมด ถ้ายังไม่มีใน array
          return [...new Set([...prev, ...childRecordNames])]
        } else {
          // ลบ record_name ของ row ลูกทั้งหมดออก
          return prev.filter((name) => !childRecordNames.includes(name))
        }
      })
    } else {
      // ถ้าเป็น row ปกติ (ไม่ใช่ group)
      const recordName = event.node.data?.record_name
      if (recordName) {
        setRowSelect((prev) => {
          if (event.node.isSelected()) {
            // เพิ่ม record_name ถ้ายังไม่มี
            return prev.includes(recordName) ? prev : [...prev, recordName]
          } else {
            // ลบ record_name ออก
            return prev.filter((name) => name !== recordName)
          }
        })
      }
    }
  }, [])

  const submitMultiPlanning = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get current data
      const currentData = getPlanningData()

      // Update the data
      const updatedData = {
        ...currentData,
        data: currentData.data.map((item) => {
          if (rowSelect.includes(item.record_name)) {
            return { ...item, docstatus: 1 }
          }
          return item
        }),
      }

      // Save to localStorage
      localStorage.setItem('planningData', JSON.stringify(updatedData))

      // deselect all rows
      gridRef.current?.api.deselectAll()
      setRowSelect([])

      // Close any open dialogs
      handleClose()
    } catch (error) {
      console.error('Failed to submit planning:', error)
    }
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <Box className="flex flex-col h-full ">
        <Grid container className="px-[39px] py-[33px] flex justify-between">
          <Box>
            <Typography variant="h6" className="font-medium text-[var(--text-default-default)]">
              {t('my_budget_plan')}
            </Typography>
          </Box>
          <Box className="hidden">
            <Box className="flex items-center gap-4">
              <Switch checked={isVerify} onChange={() => setIsVerify(!isVerify)} />
              {isVerify && (
                <>
                  <ActionButton
                    name={'บันทึก'}
                    disabled={rowSelect.length === 0}
                    onClick={submitMultiPlanning}
                  />
                  <ActionButton name={'ยกเลิก'} variant="error" disabled={rowSelect.length === 0} />
                </>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Tab filters */}
        <Box className="px-[39px] flex justify-between">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="min-h-[39px]"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--background-brand-default)',
              },
              '&.MuiTabs-root': {
                marginBottom: 0,
              },
              '& .MuiTab-root': {
                minHeight: '39px',
                textTransform: 'none',
                color: 'var(--text-default-secondary)',
                '&.Mui-selected': {
                  color: 'var(--text-default-default)',
                },
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box className="flex items-center gap-2">
                    <span>{tab.label}</span>
                    <span
                      className={
                        activeTab === tab.value
                          ? `px-1.5 py-0.5 text-xs rounded-[3px] bg-[var(--background-brand-default)] text-[var(--text-default-white)]`
                          : `px-1.5 py-0.5 text-xs rounded-[3px] bg-[var(--background-default-secondary)] text-[var(--text-default-secondary)]`
                      }
                    >
                      {tab.count}
                    </span>
                  </Box>
                }
              />
            ))}
          </Tabs>
          <Box className="flex items-center gap-4">
            <Typography className="text-sm text-[var(--text-default-secondary)]">เเสดง</Typography>
            <Typography
              className="text-sm text-[var(--text-default-default)]"
              sx={{ textDecoration: 'dotted underline' }}
            >
              เดือน
            </Typography>
            {/* <Box className="h-4 w-[1px] bg-[var(--border-default-default)]" /> */}
            <Typography className="text-sm text-[var(--text-default-secondary)]">
              เริ่มจาก
            </Typography>
            <Box
              component="span"
              sx={{ textDecoration: 'dotted underline', display: 'inline-flex', gap: '4px' }}
            >
              <Typography className="text-sm text-[var(--text-default-default)]">
                {dayjs().format('MMMM')}
              </Typography>
              <Typography className="text-sm text-[var(--text-default-default)]">
                {dayjs().year() + 543}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="h-full">
          <AgGridReact
            className="ag-my-board"
            ref={gridRef}
            statusBar={statusBar}
            theme={myTheme}
            rowData={listPlanning?.data ?? []}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            onRowDoubleClicked={onRowClicked}
            loading={isLoadingListPlanning}
            groupDisplayType={'custom'}
            noRowsOverlayComponent={CustomNoRowsOverlay}
            gridOptions={gridOptions}
            rowSelection={rowSelection}
            selectionColumnDef={selectionColumnDef}
            groupDefaultExpanded={1}
            onRowSelected={onRowSelected}
            pagination={false}
            noRowsOverlayComponentParams={{
              isImage: true,
              title: 'ไม่มีข้อมูล',
              description: 'ไม่พบข้อมูลที่ต้องการ',
            }}
          />
        </Box>
      </Box>
    </Suspense>
  )
}
