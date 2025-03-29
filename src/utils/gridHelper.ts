
/**
 * Transforms budget data from template by moving specified keys from template_link_detail to the root level
 * @param budgetPlans - Array of budget plan items
 * @param keysToTransform - Array of keys to move from template_link_detail to root level
 * @returns Transformed budget plans array
 */
export const transformBudgetFromTemplate = (budgetPlans: any[], keysToTransform: string[] = ['fund_account']) => {
  if (!budgetPlans) return []

  return budgetPlans.map(item => {
    const newItem = { ...item }
    
    keysToTransform.forEach((key: string) => {
      if (newItem.template_link_detail?.[key]) {
        newItem[key] = newItem.template_link_detail[key]
        delete newItem.template_link_detail[key]
      }
    })
    
    return newItem
  })
}

/**
 * Retrieves all row data from an AG Grid instance
 * @param gridRef - Reference to the AgGridReact component
 * @returns Array containing all row data from the grid
 */
export const getGridRowData = (gridRef: any) => {
  const rowData: any[] = []

  if (!gridRef?.current?.api) return rowData

  gridRef.current.api.forEachNode((node: any) => {
    if (node.data) {
      rowData.push(node.data)
    }
  })

  return rowData
} 