'use client'

import TabWrapper from '@/components/plan-control/TabWrapper'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormAction } from '@vise/kit/types'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
import { TextInput } from '@vise/kit'
import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import { usePlanSelectionStore } from '@/lib/stores/planSelectionStore'
import { useParams } from 'next/navigation'
import { convertProcedureTaskToGantt } from '@/utils/helper'
import { useGetProject } from '@/lib/api/project'

const Step1 = dynamic(() => import('./(step)/step1'), { ssr: false })
const Step2 = dynamic(() => import('./(step)/step2'), { ssr: false })
const Step3 = dynamic(() => import('./(step)/step3'), { ssr: false })
const Step4 = dynamic(() => import('./(step)/step4'), { ssr: false })
const Step5 = dynamic(() => import('./(step)/step5'), { ssr: false })
const Step6 = dynamic(() => import('./(step)/step6'), { ssr: false })

export interface StepProps {
  formAction: FormAction
}

const ProjectPlanning = () => {
  const params = useParams()
  const action = params.action as string
  const { version } = usePlanSelectionStore()
  const [tabIndex, setTabIndex] = useState('1')

  const convertGanttProcedureTask = () => {
    const formattedTasks = procedureTask.tasks.map((task) => {
      if (!task?.id) return {}
      return {
        id: task.id,
        text: task.text,
        start_date: dayjs(task.start_date).format('YYYY-MM-DD'),
        duration: task.duration,
        progress: task.progress,
      }
    })
    return formattedTasks
  }

  const {
    formAction,
    id: idUpdated,
    projectName,
    setProjectName,
    formDataDetail,
    setFormDataDetail,
    formDataRelation,
    setFormDataRelation,
    formDataResponsible,
    setFormDataResponsible,
    formDataImportant,
    setFormDataImportant,
    objectives,
    setObjectives,
    procedureTask,
    setProcedureTask,
    targets,
    setTargets,
    formDataPeriod,
    setFormDataPeriod,
    formDataLocation,
    setFormDataLocation,
    rowDataBudget,
    setRowDataBudget,
    gridApiKpi,
    setGridApiKpi,
    setFormAction,
    setKpiData,
  } = usePlanFormStore()

  // Fetch project data using the reusable hook
  const { data: projectData } = useGetProject(idUpdated)

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.project_name)
      // 1. Tab 1
      setFormDataDetail({
        company: projectData?.company ?? '',
        cost_center: projectData?.cost_center ?? '',
      })
      setFormDataRelation({
        budget_strategy: projectData?.budget_strategy ?? '',
        budget_plan: projectData?.budget_plan ?? '',
        budget_output: projectData?.budget_output ?? '',
        budget_activity: projectData?.budget_activity ?? '',
        fund_group: projectData?.fund_group ?? '',
        sub_fund_group: projectData?.sub_fund_group ?? '',
        fund_source: projectData?.fund_source ?? '',
        fund_account: projectData?.fund_account ?? '',
        fund_type: projectData?.fund_type ?? '',
        sub_fund_type: projectData?.sub_fund_type ?? '',
      })

      // 2. Tab 2

      setFormDataResponsible({
        project_owner_name: projectData?.project_owner_name,
        project_owner_position: projectData?.project_owner_position,
        project_owner_phone_number: projectData?.project_owner_phone_number,
        project_coordinator_phone_number: projectData?.project_coordinator_phone_number,
        project_coordinator_name: projectData?.project_coordinator_name,
      })

      setFormDataImportant({
        project_reason: projectData?.project_reason,
      })
      setObjectives(projectData?.project_objective_items || [])

      // 3. Tab 3
      setProcedureTask({
        tasks: convertProcedureTaskToGantt(projectData?.procedure_task_items),
        links: [], // ถ้ามีลิงก์ก็ใส่ได้
      })

      // 4. Tab 4
      // formTargetState.targets = result?.project_target_items
      // dispatchTargets({
      //   type: 'UPDATE',
      //   payload: result?.project_target_items || [],
      // })

      setTargets(projectData?.project_target_items || [])

      setFormDataPeriod({
        project_start_date: projectData?.project_start_date,
        project_end_date: projectData?.project_end_date,
      })

      if (projectData?.project_location) {
        setFormDataLocation([13.7780523, 100.5352406])
      } else {
        setFormDataLocation([13.7780523, 100.5352406])
      }

      // 6. Tab 5
      const kpiData =
        projectData?.project_kpi_items?.map((item) => ({
          kpi_quantity_name: item.kpi_quantity_name,
          kpi_quantity_uom: item.kpi_quantity_uom,
          year_1: item.year_1,
          year_2: item.year_2,
          year_3: item.year_3,
          year_4: item.year_4,
          year_5: item.year_5,
          january: item.kpi_plan_period_1,
          february: item.kpi_plan_period_2,
          march: item.kpi_plan_period_3,
          april: item.kpi_plan_period_4,
          may: item.kpi_plan_period_5,
          june: item.kpi_plan_period_6,
          july: item.kpi_plan_period_7,
          august: item.kpi_plan_period_8,
          september: item.kpi_plan_period_9,
          october: item.kpi_plan_period_10,
          november: item.kpi_plan_period_11,
          december: item.kpi_plan_period_12,
        })) || []
      setKpiData(kpiData)

      // 7. Tab 6
      setRowDataBudget(projectData?.budget_items || [])
    }
  }, [
    projectData,
    setProjectName,
    setFormDataDetail,
    setFormDataRelation,
    setFormDataResponsible,
    setFormDataImportant,
    setObjectives,
    setProcedureTask,
    setTargets,
    setFormDataPeriod,
    setRowDataBudget,
    setFormDataLocation,
    setGridApiKpi,
    setKpiData,
  ])

  const submitForm = async () => {
    const budget_items = rowDataBudget.map(({ name, sum, count, ...rest }) => rest)

    const project_kpi_items: any = []
    if (gridApiKpi) {
      gridApiKpi.forEachNode((node) => {
        if (!node.data || node.rowPinned) return // ข้ามแถว pinned
        project_kpi_items.push({
          kpi_quantity_name: node.data.kpi_quantity_name,
          kpi_quantity_uom: node.data.kpi_quantity_uom,
          year_1: node.data.year_1,
          year_2: node.data.year_2,
          year_3: node.data.year_3,
          year_4: node.data.year_4,
          year_5: node.data.year_5,
          january: node.data.january,
          february: node.data.february,
          march: node.data.march,
          april: node.data.april,
          may: node.data.may,
          june: node.data.june,
          july: node.data.july,
          august: node.data.august,
          september: node.data.september,
          october: node.data.october,
          november: node.data.november,
          december: node.data.december,
        })
      })
    }

    console.log('formDataResponsible', formDataResponsible)

    const param = {
      ...formDataDetail,
      ...formDataRelation,
      ...formDataResponsible,
      ...formDataImportant,
      ...formDataPeriod,
      ...formDataLocation,
      name: idUpdated,
      project_name: projectName,
      procedure_task_items: convertGanttProcedureTask() ?? [],
      budget_items: budget_items,
      preparation_document: version,
      project_objective_items: objectives,
      project_target_items: targets,
      project_kpi_items: project_kpi_items,
    }
    console.log('submitForm', param)
    // await mutateAsyncSaveProject(param);
  }

  useEffect(() => {
    setFormAction(action as 'create' | 'update')
  }, [action, setFormAction])

  return (
    <Box className="pl-[39px] pr-[39px] h-full">
      <TextInput
        value={projectName}
        setValue={(value) => setProjectName(value ?? '')}
        label={''}
        path={''}
        placeholder={'ใส่ชื่อโครงการของคุณที่นี่'}
      />

      <TabWrapper
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        listTab={[
          { label: 'โครงการขั้นต้น', value: '1' },
          { label: 'ข้อเสนอโครงการ', value: '2' },
          { label: 'วิธีการดำเนินการ', value: '3' },
          { label: 'รายละเอียดโครงการ', value: '4' },
          { label: 'ตัวชี้วัดเป้าหมายโครงการ', value: '5' },
          { label: 'งบประมาณ', value: '6' },
        ]}
      >
        <>
          <Step1
            formAction={formAction}
            initialDataDetail={formDataDetail}
            initialDataRelation={formDataRelation}
            onUpdateDetail={setFormDataDetail}
            onUpdateRelation={setFormDataRelation}
          />
        </>
        <>
          <Step2
            formAction={formAction}
            initialDataResponsible={formDataResponsible}
            initialDataImportant={formDataImportant}
            initialObjectives={objectives}
            onUpdateResponsible={setFormDataResponsible}
            onUpdateImportant={setFormDataImportant}
            onUpdateObjectives={setObjectives}
          />
        </>
        <>
          <Step3 procedureTasks={procedureTask} setProcedureTasks={setProcedureTask} />
        </>
        <>
          <Step4
            initialTargets={targets}
            initialPeriodData={formDataPeriod}
            initialLocation={formDataLocation}
            formMode="edit"
            onUpdateTargets={setTargets}
            onUpdatePeriod={setFormDataPeriod}
            onUpdateLocation={setFormDataLocation}
          />
        </>
        <>
          <Step5 formAction={formAction} />
        </>
        <>
          <Step6 formAction={formAction} />
        </>
      </TabWrapper>
      <Button onClick={submitForm}>Submit</Button>
    </Box>
  )
}

export default ProjectPlanning
