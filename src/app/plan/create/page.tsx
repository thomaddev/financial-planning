'use client'
import Grid2 from '@mui/material/Grid2'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import GroupIcon from '@mui/icons-material/Group'
import HandshakeIcon from '@mui/icons-material/Handshake'
import InventoryIcon from '@mui/icons-material/Inventory'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EngineeringIcon from '@mui/icons-material/Engineering'
import DescriptionIcon from '@mui/icons-material/Description'
import {
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import { useState } from 'react'
import { JsonFormFrappe } from '@vise/kit/json-form-render'
import { EXCLUDE_FIELDS_EMPLOYEE } from '@/data/excludeFields'
import { useRouter } from 'next/navigation'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
import { useTranslations } from 'next-intl'
import { getDataTestAttr } from '@/utils/helper'

interface CardItemProps {
  href: string
  Icon: SvgIconComponent
  title: string
  description: string
  key: string
}

function CardItem({ href, Icon, title, description }: CardItemProps) {
  const router = useRouter()
  const { formHeader, setFormHeader } = usePlanFormStore()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setFormHeader({})
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleFormUpdate = (updatedData: any) => {
    setFormHeader(updatedData)
  }

  const handleSubmit = () => {
    setFormHeader(formHeader)
    router.push(`${href}/new`)
    setOpen(false)
  }

  const activeHoverStyles = {
    borderColor: 'var(--color-blue)',
    '& h3': {
      color: 'var(--color-blue)',
      transition: 'color 0.5s ease',
    },
    '& .icon-container': {
      backgroundColor: 'var(--color-blue)',
      transition: 'background-color 0.5s ease',
      '& svg': {
        color: '#ffffff',
        transition: 'color 0.5s ease',
      },
    },
  }

  return (
    <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
      <CardActionArea
        onClick={handleClickOpen}
        sx={{
          '.MuiCardActionArea-focusHighlight': {
            background: 'transparent',
          },
        }}
        {...getDataTestAttr(`card-${title}`)}
      >
        <Card
          elevation={0}
          className="h-[90px] flex items-center gap-[23px] border border-[var(--border-default-default)] px-[13px] py-[27px]"
          sx={{
            transition: 'all 0.5s ease', // Smooth transition for all states
            // Apply styles when hovering
            ':hover': activeHoverStyles,
            // Apply styles when dialog is open
            ...(open ? activeHoverStyles : {}),
          }}
        >
          <div className="min-w-8 h-8 flex items-center justify-center bg-[var(--background-default-secondary)] rounded-full ml-[23px] icon-container">
            <Icon className="text-[var(--text-default-secondary)] text-[20px]" />
          </div>
          <div className="pr-[23px] overflow-hidden">
            <h3 className="text-[length:var(--subtitle-size)] font-[var(--subtitle-fontweight)] truncate" >
              {title}
            </h3>
            <p className="text-[length:var(--size-scale00)] text-[var(--text-default-secondary)] line-clamp-2">
              {description}
            </p>
          </div>
        </Card>
      </CardActionArea>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth {...getDataTestAttr(`card-dialog-${title}`)}>
        <DialogTitle>
          <div className="flex items-center gap-4 ">
            <div className="w-6 h-6 flex items-center justify-center bg-[var(--background-default-secondary)] rounded-full">
              <Icon className="text-[var(--text-default-secondary)] text-[20px]" />
            </div>
            <h5>{title}</h5>
          </div>
          <Typography variant="caption" color="text.secondary">{description}</Typography>
          </DialogTitle>
        <DialogContent dividers>
          <div  className="overflow-y-auto">
            <div>
              <JsonFormFrappe
                doctype="Budget Planning"
                formData={formHeader}
                onChange={handleFormUpdate}
                excludeFields={EXCLUDE_FIELDS_EMPLOYEE}
                formAction={'create'}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{ color: 'var(--text-default-secondary)' }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'var(--background-brand-default)',
            }}
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  )
}

export default function CreatePlanPage() {
  const revenueItems = [
    {
      href: '/plan/revenue',
      Icon: AttachMoneyIcon,
      title: 'รายได้',
      description: 'การคาดการณ์รายได้จากแหล่งต่างๆ ที่องค์กรจะได้รับ',
    },
    {
      href: '/plan/revenue_allowcate',
      Icon: MoneyOffIcon,
      title: 'รายได้จัดสรร',
      description: 'การคาดการณ์รายได้จากแหล่งต่างๆ ที่องค์กรจะได้รับ',
    },
  ]

  const expenseItems = [
    {
      href: '/plan/employee',
      Icon: GroupIcon,
      title: 'งบบุคลากร',
      description: 'ประมาณการรายจ่ายเพื่อการบริหารงานบุคลากรภาครัฐ',
    },
    {
      href: '/plan/vehicle_repair',
      Icon: HandshakeIcon,
      title: 'ค่าซ่อมแซม',
      description: 'ค่าช่วยเหลือและผลตอบแทนสำหรับการดำเนินกิจการ',
    },
    {
      href: '/plan/durable_goods',
      Icon: InventoryIcon,
      title: 'ครุภัณฑ์',
      description: 'ค่าจัดหาครุภัณฑ์ต่างๆภายในองค์กรและเครื่องมือ',
    },
    {
      href: '/plan/material_cost',
      Icon: DescriptionIcon,
      title: 'ค่าวัสดุ',
      description: 'ค่าใช้จ่ายเกี่ยวกับงานวิจัยที่ใช้ในการดำเนินงาน',
    },
    {
      href: '/plan/utilities_costs',
      Icon: ElectricBoltIcon,
      title: 'ค่าสาธารณูปโภค',
      description: 'ค่าใช้จ่ายเกี่ยวกับสาธารณูปโภค น้ำ ไฟ',
    },
    {
      href: '/plan/land_and_construction',
      Icon: HomeWorkIcon,
      title: 'ที่ดินและสิ่งก่อสร้าง',
      description: 'ค่าใช้จ่ายเกี่ยวกับที่ดินและสิ่งก่อสร้างอาคาร',
    },
    {
      href: '/plan/lump_sum_wage',
      Icon: EngineeringIcon,
      title: 'ค่าจ้างเหมา',
      description: 'ค่าใช้จ่ายการจ้างบุคคลภายนอกทำงาน',
    },
  ]

  const projectItems = [
    {
      href: '/plan/project',
      Icon: DescriptionIcon,
      title: 'โครงการประเภท 1',
      description: 'งบประมาณที่จัดสรรเพื่อการดำเนินการโครงการ',
    },
    {
      href: '/plan/project',
      Icon: DescriptionIcon,
      title: 'โครงการประเภท 2',
      description: 'งบประมาณที่จัดสรรเพื่อการดำเนินการโครงการ',
    },
  ]

  return (
    <div className="py-[33px] px-[39px] w-full lg:w-[75%]">
      <h1 className="text-(length:--titleform-size) font-(family-name:--titleform-fontfamily) font-(--titleform-fontweight) mb-8">
        แผนงบประมาณ
      </h1>

      {/* Revenue Section */}
      <div className="mb-8">
        <h2 className="text-(length:--titlecontent-size) mb-[18px]">รายได้/รายรับ (Revenue)</h2>
        <Grid2 container spacing={2.875}>
          {revenueItems.map((item, index) => (
            <CardItem key={`${item.href}-${index}`} {...item} />
          ))}
        </Grid2>
      </div>

      {/* Expenses Section */}
      <div className="mb-8">
        <h2 className="text-(length:--titlecontent-size) mb-[18px]">รายจ่าย (Expense)</h2>
        <Grid2 container spacing={2.875}>
          {expenseItems.map((item, index) => (
            <CardItem key={`${item.href}-${index}`} {...item} />
          ))}
        </Grid2>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-(length:--titlecontent-size) mb-[18px]">โครงการ (Project)</h2>
        <Grid2 container spacing={2.875}>
          {projectItems.map((item, index) => (
            <CardItem key={`${item.href}-${index}`} {...item} />
          ))}
        </Grid2>
      </div>
    </div>
  )
}
