'use client'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { JsonFormFrappe } from '@vise/kit'
import { StepProps } from '../page'

interface Step1Props extends StepProps {
  initialDataDetail: object
  initialDataRelation: object
  onUpdateDetail: (data: object) => void
  onUpdateRelation: (data: object) => void
}

const Step1: React.FC<Step1Props> = ({
  formAction,
  initialDataDetail,
  initialDataRelation,
  onUpdateDetail,
  onUpdateRelation,
}) => {
  return (
    <Box py={4}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">หน่วยงานโครงการ</Typography>
          <Typography variant="body2" color="textSecondary">
            ข้อมูลแสดงปีงบประมาณในการทำโครงการ จะแสดงเป็นไปตามกำหนดของระบบในปีงบประมาณนั้นๆ
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ข้อมูลแสดงคณะ สำนักวิชา หรือ ชื่อสถาบันตามสิทธิ์ที่ผู้ใช้งานเข้าสู่ระบบ
            ข้อมูลแสดงหน่วยงานย่อย ตามสิทธิ์ที่ผู้ใช้งานเข้าสู่ระบบ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <JsonFormFrappe
            formAction={formAction}
            doctype="Project Planning"
            formData={initialDataDetail}
            specificSection="section_company"
            onChange={(data) => {
              onUpdateDetail(data)
            }}
          />
        </Grid>

        {/* Section 2: Project Relation */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5">ความเชื่อมโยงโครงการ</Typography>
          <Typography variant="body2" color="textSecondary">
            เลือกแผนงาน และเชื่อมโยงยุทธศาสตร์ โดยจะปรากฏตัวเลือกเชื่อมโยงในแต่ละแผนงาน
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <JsonFormFrappe
            formAction={formAction}
            doctype="Project Planning"
            formData={initialDataRelation}
            specificSection="section_relation"
            onChange={(data) => {
              onUpdateRelation(data)
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Step1
