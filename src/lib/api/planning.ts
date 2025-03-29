import { usePlanSelectionStore } from '@/lib/stores/planSelectionStore'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { usePlanningService } from '@/lib/services/planningService'
import { BudgetPrepSetting } from '@/lib/interfaces/budget-preparation.interface'

export const useBudgetPrepSetting = () => {
  const planningService = usePlanningService()

  return useQuery<BudgetPrepSetting | null>({
    queryKey: ['budgetPrepSetting'],
    queryFn: () => planningService.getBudgetPrepSetting(),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  })
}

export const useGetBudgetPlans = (category: string, page: number, pageSize: number) => {
  const planningService = usePlanningService()

  return useQuery({
    queryKey: ['budget-plans-list', category, page, pageSize],
    queryFn: () => planningService.getBudgetPlans(category, page, pageSize),
    // for previous data to be available while fetching new data
    placeholderData: keepPreviousData,
  })
}

const transformBudgetItems = (items: any[]) => {
  return items.map((item) => ({
    ...item,
    gridId: item.name,
    template_link_detail: {
      ...item.template_link_detail,
      fund_account: item.fund_account,
      can_allocate: true,
    },
  }))
}

export const useGetPlanning = (id: string) => {
  const planningService = usePlanningService()

  return useQuery({
    queryKey: ['budget-plans', id],
    queryFn: async () => {
      const data = await planningService.getPlanning(id)
      if (data.budget_items) {
        return {
          ...data,
          budget_items: transformBudgetItems(data.budget_items),
        }
      }
      return data
    },
    enabled: id !== 'new',
  })
}

export const useSavePlanning = () => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const planningService = usePlanningService()

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const { version } = usePlanSelectionStore.getState()
        data = { ...data, preparation_document: version }
        return await planningService.savePlanning(data)
      } catch (error) {
        console.error('Failed to save planning:', error)
        return null
      }
    },
    onSuccess: (_response, _variables) => {
      console.log('save planning success')
      toast.success(
        t('success.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
      queryClient.invalidateQueries({
        queryKey: ['budget-plans'],
      })
      queryClient.invalidateQueries({
        queryKey: ['budget-plans-list'],
      })
    },
    onError: (error) => {
      console.error('Failed to save planning:', error)
      toast.error(
        t('error.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
    },
  })
}

export const useSubmitPlanning = () => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const planningService = usePlanningService()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await planningService.submitPlanning(id)
      } catch (error) {
        console.error('Failed to save planning:', error)
        return null
      }
    },
    onSuccess: (_response, _variables) => {
      console.log('save planning success')
      toast.success(
        t('success.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
      queryClient.invalidateQueries({
        queryKey: ['budget-plans'],
      })
      queryClient.invalidateQueries({
        queryKey: ['budget-plans-list'],
      })
    },
    onError: (error) => {
      console.error('Failed to save planning:', error)
      toast.error(
        t('error.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
    },
  })
}

export const useSubmitMultiPlanning = () => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const planningService = usePlanningService()

  return useMutation({
    mutationFn: async (planning_list_id: string[]) => {
      try {
        return await planningService.submitMultiPlanning(planning_list_id)
      } catch (error) {
        console.error('Failed to save planning:', error)
        return null
      }
    },
    onSuccess: (_response, _variables) => {
      console.log('save planning success')
      toast.success(
        t('success.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
      queryClient.invalidateQueries({
        queryKey: ['budget-plans'],
      })
      queryClient.invalidateQueries({
        queryKey: ['budget-plans-list'],
      })
    },
    onError: (error) => {
      console.error('Failed to save planning:', error)
      toast.error(
        t('error.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
    },
  })
}

export const useBudgetPreparations = () => {
  const planningService = usePlanningService()

  return useQuery({
    queryKey: ['budget-preparations'],
    queryFn: () => planningService.getBudgetPreparations(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
