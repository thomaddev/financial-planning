'use client'

import { Box, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePlanSelectionStore } from '@/lib/stores/planSelectionStore'
import { useBudgetPreparations } from '@/lib/api/planning'
import { BudgetPreparation } from '@/lib/interfaces/planning.interface'

const PlanCard = ({
  isActive,
  version,
  onClick,
}: {
  isActive: boolean
  version: string
  onClick: () => void
}) => {
  return (
    <Box
      onClick={onClick}
      className={`relative p-4 rounded-[46px] border transition-all duration-300 cursor-pointer
        hover:shadow-md ${
          isActive
            ? 'border-[var(--border-brand-default)]'
            : 'border-[var(--border-default-default)]'
        }`}
    >
      <Box className="absolute top-[31px] left-4 z-10">
        <Typography
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      </Box>

      <Box className="flex flex-col items-center justify-center py-6">
        <Box className="relative w-[180px] h-[180px] mb-4">
          <Image
            src={isActive ? '/images/home_plan.gif' : '/images/home_plan_inactive.gif'}
            alt="Budget Planning"
            fill
            className={`object-contain transition-opacity duration-300 ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
            priority
            unoptimized
          />
        </Box>

        <button
          className={`px-8 py-2.5 rounded-full text-base font-medium transition-all duration-300 cursor-pointer
            ${
              isActive
                ? 'bg-[#2463EB] text-white hover:bg-[#1D4ED8]'
                : 'bg-[#F3F4F6] text-[#6B7280]'
            }`}
        >
          วางแผนงาน
        </button>
      </Box>

      <Typography variant="caption" className="block text-center text-[#6B7280] mt-2">
        Version {version}
      </Typography>
    </Box>
  )
}

const SkeletonCard = () => {
  return (
    <Box
      className={`relative p-4 rounded-[46px] border shadow-md border-[var(--border-default-default)] w-[300px] h-[322px]`}
    >
      <Box className="absolute top-[31px] left-4 z-10">
        <Skeleton
          animation="wave"
          width={55}
          height={35}
          sx={{
            borderRadius: '13px',
          }}
        />
      </Box>

      <Box className="flex flex-col items-center justify-center py-6">
        <Box className="relative w-[180px] h-[180px] mb-4">
          <Skeleton
            animation="wave"
            width={180}
            height={230}
            sx={{
              borderRadius: '13px',
            }}
          />
        </Box>
        <Skeleton
          animation="wave"
          width={125}
          height={45}
          sx={{
            borderRadius: '13px',
          }}
        />
        <Skeleton
          animation="wave"
          width={75}
          height={35}
          sx={{
            borderRadius: '13px',
          }}
        />
      </Box>
    </Box>
  )
}

export default function Home() {
  const router = useRouter()
  const { setVersion, setCurrentPlan } = usePlanSelectionStore()
  const { data: plans = [], isLoading: isLoadingPlans } = useBudgetPreparations()

  const handlePlanSelect = (plan: BudgetPreparation) => {
    setVersion(plan.name)
    setCurrentPlan(plan)
    router.push('/plan/my-board')
  }
  return (
    <Box className="container mx-auto px-4 py-8">
      <h1
        // variant="h5"
        // component="h1"
        className="mb-8 
       font-(--titleform-fontweight) text-(length:--titleform-size) text-[var(--text-default-default)]"
      >
        ระบบวางแผนงบประมาณ ประจำปี 2568
      </h1>

      <Grid2 container spacing={4}>
        {isLoadingPlans ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          plans.map((plan) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={plan.name}>
              <PlanCard
                isActive={plan.is_active}
                version={plan.name}
                onClick={() => handlePlanSelect(plan)}
              />
            </Grid2>
          ))
        )}
      </Grid2>
    </Box>
  )
}
