'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
} from '@mui/material'
import { CALCULATOR_TYPE } from '@/data'
import { useTranslations } from 'next-intl'

interface CalculatorGridDialogProps {
  toggleDialog: boolean
  currentYear?: number
  onSubmitDialog: (data: any) => void
  onCancelDialog: () => void
}

const CalculatorGridDialog: React.FC<CalculatorGridDialogProps> = ({
  toggleDialog,
  currentYear = 0,
  onSubmitDialog,
  onCancelDialog,
}) => {
  const t = useTranslations()
  const [open, setOpen] = useState(toggleDialog)
  const [activeTab, setActiveTab] = useState('1')

  const [formCalculator, setFormCalculator] = useState({
    current: currentYear,
    additionValueForAdjust: 0,
    additionValueForReplace: 0,
    typeForAdjust: 'bath',
    typeForReplace: 'bath',
  })

  // Sync dialog state when props change
  useEffect(() => {
    setOpen(toggleDialog)
    setFormCalculator((prev) => ({ ...prev, current: currentYear }))
  }, [toggleDialog, currentYear])

  // Function to update input values
  const updateFormCalculator = (key: string, value: number | string) => {
    setFormCalculator((prev) => ({ ...prev, [key]: value }))
  }

  // Change Type (bath/percent)
  const changeType = (type: string) => {
    if (activeTab === '1') {
      setFormCalculator((prev) => ({ ...prev, typeForAdjust: type }))
    } else {
      setFormCalculator((prev) => ({ ...prev, typeForReplace: type }))
    }
  }

  // Handle Submit
  const handleOk = () => {
    onSubmitDialog({
      type: activeTab === '1' ? CALCULATOR_TYPE.adjust : CALCULATOR_TYPE.replace,
      ...formCalculator,
    })
    setOpen(false)
  }

  // Handle Cancel
  const handleCancel = () => {
    setOpen(false)
    onCancelDialog()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>เครื่องมือช่วยคำนวณ</DialogTitle>
      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="คำนวณจากค่าปีปัจจุบัน" value="1" />
          <Tab label="แทนค่าปีประมาณการ" value="2" />
        </Tabs>

        {activeTab === '1' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="ค่าปีปัจจุบัน"
              value={formCalculator.current}
              onChange={(e) => updateFormCalculator('current', Number(e.target.value))}
            />
            <TextField
              fullWidth
              label="เพิ่มจากปีปัจจุบันด้วยจำนวนหรือเปอร์เซ็นต์"
              value={formCalculator.additionValueForAdjust}
              onChange={(e) =>
                updateFormCalculator('additionValueForAdjust', Number(e.target.value))
              }
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant={formCalculator.typeForAdjust === 'bath' ? 'contained' : 'outlined'}
                onClick={() => changeType('bath')}
              >
                #
              </Button>
              <Button
                variant={formCalculator.typeForAdjust === 'percent' ? 'contained' : 'outlined'}
                onClick={() => changeType('percent')}
              >
                %
              </Button>
            </Box>
          </Box>
        )}

        {activeTab === '2' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="แทนค่าปีประมาณการด้วยจำนวนหรือเปอร์เซ็นต์"
              value={formCalculator.additionValueForReplace}
              onChange={(e) =>
                updateFormCalculator('additionValueForReplace', Number(e.target.value))
              }
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant={formCalculator.typeForReplace === 'bath' ? 'contained' : 'outlined'}
                onClick={() => changeType('bath')}
              >
                #
              </Button>
              <Button
                variant={formCalculator.typeForReplace === 'percent' ? 'contained' : 'outlined'}
                onClick={() => changeType('percent')}
              >
                %
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>{t('cancel')}</Button>
        <Button onClick={handleOk} color="primary" variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CalculatorGridDialog
