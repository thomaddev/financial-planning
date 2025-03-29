import { useCallback, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { generateInitialMontly, getRandomId } from '@/utils/helper'
import { FormAction } from '@vise/kit'
import React from 'react'

type ActionType = 'add' | 'edit'

interface UseGridActionsProps {
  gridRef: React.RefObject<AgGridReact<any> | null>
  docType: string
  setRowData: (data: any[]) => void
}

export const useGridActions = ({ gridRef, setRowData }: UseGridActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [editData, setEditData] = useState<any>(null)
  const [formAction, setFormAction] = useState<ActionType>('add')

  const handleOpenDialog = (action: ActionType, data?: any) => {
    if (action === 'edit') {
      setFormAction(action)
      setEditData(data || null)
      setIsDialogOpen(true)
    } else {
      setFormAction(action)
      setIsDialogOpen(true)
    }
  }

  const handleAddRow = useCallback(
    (formData: any) => {
      if (!gridRef.current?.api) return
      const newRow = {
        ...generateInitialMontly(),
        name: getRandomId(),
        gridId: getRandomId(),
        fund_account: formData.fund_account,
        template_link_detail: {
          ...formData,
          name: getRandomId(),
          gridId: getRandomId(),
        },
      }
      gridRef.current.api.applyTransaction({ add: [newRow] })
      const currentRowData: any[] = []
      gridRef.current.api.forEachNode((node: any) => {
        currentRowData.push(node.data)
      })
      setRowData(currentRowData)
      setIsDialogOpen(false)
      setEditData(null)
    },
    [gridRef, setRowData],
  )

  const handleActionRow = useCallback(
    (params: { action: string; form: any }) => {
      if (!gridRef.current?.api) return

      const { action, form } = params
      switch (action) {
        case 'edit':
          handleOpenDialog('edit', { ...form.template_link_detail, gridId: form.gridId })
          break
        case 'copy':
          const newRow = {
            ...form,
            name: getRandomId(),
            gridId: getRandomId(),
            template_link_detail: {
              ...form.template_link_detail,
              name: getRandomId(),
            },
          }
          gridRef.current.api.applyTransaction({ add: [newRow] })
          break
        case 'delete':
          if (form.gridId) {
            gridRef.current.api.applyTransaction({ remove: [form] })
          }
          break
        default:
          console.warn('Unknown action:', action)
      }
    },
    [gridRef],
  )

  const handleSubmitDialog = (data?: any) => {
    console.log(formAction)
    if (formAction === 'edit') {
      handleEditSubmit(data)
      const currentRowData: any[] = []
      gridRef.current?.api?.forEachNode((node: any) => {
        currentRowData.push(node.data)
      })
      setRowData(currentRowData)
    } else {
      handleAddRow(data)
    }
  }

  const handleEditSubmit = useCallback(
    (formData: any) => {
      if (!gridRef.current?.api || !editData?.gridId) return

      const rowNode = gridRef.current.api.getRowNode(editData.gridId)
      if (rowNode) {
        const updatedData = {
          ...rowNode.data,
          template_link_detail: {
            ...rowNode.data.template_link_detail,
            ...formData,
          },
        }
        gridRef.current.api.applyTransaction({ update: [updatedData] })
      }
      gridRef.current?.api?.deselectAll()
      setIsDialogOpen(false)
      setEditData(null)
    },
    [gridRef, editData],
  )

  const handleChangeFormDataGrid = useCallback((formData: any) => {
    setEditData(formData)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setEditData(null)
  }, [])

  return {
    handleOpenDialog,
    handleActionRow,
    handleCloseDialog,
    handleSubmitDialog,
    handleChangeFormDataGrid,
    isDialogOpen,
    editData,
    formAction: formAction === 'add' ? 'Add' : ('Edit' as FormAction),
  }
}
