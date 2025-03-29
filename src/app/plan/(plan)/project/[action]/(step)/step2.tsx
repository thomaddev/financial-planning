'use client'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { JsonFormFrappe } from '@vise/kit'
import { StepProps } from '../page'

interface Step2Props extends StepProps {
  initialDataResponsible: object
  initialDataImportant: object
  initialObjectives: { key: number; objective: string }[]
  onUpdateResponsible: (data: object) => void
  onUpdateImportant: (data: object) => void
  onUpdateObjectives: (objectives: { key: number; objective: string }[]) => void
}

const Step2: React.FC<Step2Props> = ({
  formAction,
  initialDataResponsible,
  initialDataImportant,
  initialObjectives,
  onUpdateResponsible,
  onUpdateImportant,
  onUpdateObjectives,
}) => {
  const [formDataResponsible, setFormDataResponsible] = useState(initialDataResponsible)
  const [formDataImportant, setFormDataImportant] = useState(initialDataImportant)
  const [objectives, setObjectives] = useState(initialObjectives)

  const addObjective = () => {
    const newObjective = { key: Date.now(), objective: '' }
    const updatedObjectives = [...objectives, newObjective]
    setObjectives(updatedObjectives)
    onUpdateObjectives(updatedObjectives)
  }

  const updateObjective = (index: number, value: string) => {
    const updatedObjectives = [...objectives]
    updatedObjectives[index].objective = value
    setObjectives(updatedObjectives)
    onUpdateObjectives(updatedObjectives)
  }

  useEffect(() => {
    setFormDataResponsible(initialDataResponsible)
    setFormDataImportant(initialDataImportant)
    setObjectives(initialObjectives)
  }, [initialDataResponsible, initialDataImportant, initialObjectives])

  return (
    <Box py={4}>
      <Grid container spacing={4}>
        {/* Section 1: Project Responsible Person */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">ผู้รับผิดชอบโครงการ</Typography>
          <Typography variant="body2" color="textSecondary">
            ระบุข้อมูลบุคคลที่เกี่ยวข้องกับโครงการ
            ผู้รับผิดชอบโครงการและผู้ประสานงานที่สามารถติดต่อและตัดสินใจได้
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <JsonFormFrappe
            formAction={formAction}
            doctype="Project Planning"
            formData={formDataResponsible}
            specificSection="section_responsible_person"
            onChange={(data) => {
              setFormDataResponsible(data)
              onUpdateResponsible(data)
            }}
          />
        </Grid>

        {/* Section 2: Project Importance */}
        <Grid size={{ xs: 12, md: 16 }}>
          <Typography variant="h5">ความสำคัญ ความเป็นมา หลักการและเหตุผล</Typography>
          <Typography variant="body2" color="textSecondary">
            บอกสาเหตุหรือปัญหาที่ทำให้เกิดโครงการนี้ขึ้น ทำโครงการแล้วจะแก้ไขปัญหาส่วนใดบ้าง
            การเขียนอธิบายปัญหาที่มาโครงการควรนำข้อมูลสถานการณ์ปัญหาจากหน่วยงานหรือพื้นที่ที่จะทำโครงการมาแจกแจงให้ชัดเจนขึ้น
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <JsonFormFrappe
            formAction={formAction}
            doctype="Project Planning"
            formData={formDataImportant}
            specificSection="section_reason"
            onChange={(data) => {
              setFormDataImportant(data)
              onUpdateImportant(data)
            }}
          />
        </Grid>

        {/* Section 3: Project Objectives */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">วัตถุประสงค์โครงการ</Typography>
          <Typography variant="body2" color="textSecondary">
            วัตถุประสงค์เป็นเครื่องชี้แนวทางในการดำเนินงานของโครงการ เป็นตัวกำหนดส่วนประกอบอื่นๆ
            ของโครงการว่าต้องการให้เกิดอะไรขึ้นบ้าง
          </Typography>
          <Typography variant="body2" color="textSecondary">
            วัตถุประสงค์จะต้องชัดเจนไม่คลุมเครือ สามารถวัดผลได้ และไม่ควรมีจำนวนมากเกินไป
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          {objectives.map((item, index) => (
            <TextField
              key={index}
              fullWidth
              margin="dense"
              value={item.objective}
              onChange={(e) => updateObjective(index, e.target.value)}
              placeholder="ระบุวัตถุประสงค์โครงการ"
            />
          ))}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={addObjective}
            sx={{ mt: 2 }}
          >
            เพิ่มวัตถุประสงค์โครงการ
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Step2
