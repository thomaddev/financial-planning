import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useProjectService } from '../services/projectService'

export const useGetProject = (id: string) => {
  const projectService = useProjectService()

  return useQuery({
    queryKey: ['budget-plans', id],
    queryFn: () => projectService.getProject(id),
    enabled: id !== 'new',
  })
}


export const useSaveProject = () => {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const projectService = useProjectService()

  return useMutation({
    mutationFn: async (data: any) => {
      return await projectService.saveProject(data)
    },
    onSuccess: (response, variables) => {
      console.log('Project saved successfully:', response)
      console.log('Data sent:', variables)
      toast.success(
        t('success.update', {
          position: 'bottom-right',
        }),
        {
          position: 'bottom-right',
        },
      )
      queryClient.invalidateQueries({
        queryKey: ['frappe-method', 'vise_budget_planning.api.v1.planning.get_budget_plans'],
      })
    },
    onError: (error) => {
      console.error('Failed to save project:', error)
    },
  })
} 