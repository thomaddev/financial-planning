'use client'
import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { ProcedureTask } from '@/types/procedureTask'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import './Gantt.css'
import dayjs from 'dayjs'

interface Step3Props {
  procedureTasks: ProcedureTask
  setProcedureTasks: (tasks: ProcedureTask) => void
}

const Step3: React.FC<Step3Props> = ({ procedureTasks, setProcedureTasks }) => {
  const ganttRef = useRef<HTMLDivElement | null>(null)

  // Adjust the visible range based on the task's start date
  const adjustVisibleRange = (task: any | null) => {
    if (task) {
      const taskStartDate = new Date(task.start_date)
      const currentStartDate = gantt.config.start_date
      const currentEndDate = gantt.config.end_date

      if (
        currentStartDate &&
        currentEndDate &&
        (taskStartDate < currentStartDate || taskStartDate > currentEndDate)
      ) {
        gantt.showDate(taskStartDate)
        const newStartDate = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), 1)
        const newEndDate = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth() + 1, 0)
        gantt.config.start_date = newStartDate
        gantt.config.end_date = newEndDate
        gantt.render()
      }
    } else {
      const today = new Date()
      gantt.showDate(today)
      const startDate = gantt.date.add(today, -15, 'day')
      const endDate = gantt.date.add(startDate, 30, 'day')
      gantt.config.start_date = startDate
      gantt.config.end_date = endDate
      gantt.render()
    }
  }

  // // Add a task
  // const addTask = (task: any) => {
  //   setProcedureTasks({
  //     ...procedureTasks,
  //     tasks: [...procedureTasks.tasks, task],
  //   })
  //   adjustVisibleRange(task)
  // }

  // // Update a task
  // const updateTask = (updatedTask: any) => {
  //   const updatedTasks = procedureTasks.tasks.map((t) =>
  //     t.id === updatedTask.id ? updatedTask : t,
  //   )
  //   setProcedureTasks({
  //     ...procedureTasks,
  //     tasks: updatedTasks,
  //   })
  //   adjustVisibleRange(updatedTask)
  // }

  // // Remove a task
  // const removeTask = (taskId: string | number) => {
  //   setProcedureTasks({
  //     ...procedureTasks,
  //     tasks: procedureTasks.tasks.filter((t) => t.id !== taskId),
  //   })
  //   adjustVisibleRange(null)
  // }

  useEffect(() => {
    if (!ganttRef.current) return

    // Gantt configuration (matching Vue version)
    gantt.config.date_format = '%Y-%m-%d'
    gantt.config.scale_unit = 'month'
    gantt.config.step = 1
    gantt.config.date_scale = '%F, %Y'
    gantt.config.subscales = [{ unit: 'week', step: 1, date: 'Week #%W' }]
    gantt.config.show_tasks_outside_timescale = true

    const today = dayjs().toDate()
    const startDate = gantt.date.add(today, -15, 'day')
    const endDate = gantt.date.add(startDate, 30, 'day')
    gantt.config.start_date = startDate
    gantt.config.end_date = endDate

    // Initialize Gantt
    gantt.init(ganttRef.current)

    // Load initial tasks
    if (procedureTasks.tasks.length > 0) {
      gantt.parse({
        data: procedureTasks.tasks,
        links: procedureTasks.links || [],
      })
    }

    // Event handlers (matching Vue version)
    gantt.attachEvent('onTaskCreated', () => true)

    gantt.attachEvent('onAfterTaskAdd', (id, task) => {
      setProcedureTasks({
        ...procedureTasks,
        tasks: [...procedureTasks.tasks, task],
      })
      adjustVisibleRange(task)
    })

    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      const updatedTasks = procedureTasks.tasks.map((t) => (t.id === task.id ? task : t))
      setProcedureTasks({
        ...procedureTasks,
        tasks: updatedTasks,
      })
      adjustVisibleRange(task)
    })

    gantt.attachEvent('onAfterTaskDelete', (id) => {
      setProcedureTasks({
        ...procedureTasks,
        tasks: procedureTasks.tasks.filter((t) => t.id !== id),
      })
      adjustVisibleRange(null)
    })

    gantt.attachEvent('onTaskClick', (id) => {
      const task = gantt.getTask(id)
      adjustVisibleRange(task)
      return true
    })

    // Cleanup
    return () => {
      gantt.clearAll()
    }
  }, [procedureTasks, setProcedureTasks]) // Dependencies ensure re-init if props change

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">วิธีการดำเนินการ</Typography>
          <Typography variant="body2" color="textSecondary">
            วิธีดําเนินการเป็นงานหรือกิจกรรมที่กําหนดขึ้น เป็นขั้นตอนตามลําดับก่อนหลังเพื่อใช้
            ปฏิบัติให้บรรลุตามวัตถุประสงค์ของโครงการ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box ref={ganttRef} sx={{ width: '100%', height: 'calc(100vh - 445px)' }} />
        </Grid>
      </Grid>
    </>
  )
}

export default Step3
