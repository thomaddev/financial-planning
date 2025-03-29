import { useQuery } from '@tanstack/react-query'
import { useUserService } from '@/lib/services/userService'
import { User } from '@/lib/interfaces/user.interface'

export const useUser = () => {
  const userService = useUserService()

  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  })
} 