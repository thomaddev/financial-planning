import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

interface SavePlanningBtnProps {
  submitting: boolean
  isDisabled: boolean
  submitForm: () => void
  setting: { data: { is_open_form: number } } // Simulating injected setting
}

const SavePlanningBtn: React.FC<SavePlanningBtnProps> = ({
  submitting,
  isDisabled,
  submitForm,
  setting,
}) => {
  const t = useTranslations()
  if (setting.data.is_open_form !== 1) return null // Hide button if `is_open_form` is not 1

  return (
    <Button
      data-test="submit-form-plan-btn"
      variant="contained"
      color="primary"
      disabled={isDisabled || submitting}
      onClick={submitForm}
    >
      {submitting ? t('pendingSave') : t('save')}
    </Button>
  )
}

export default SavePlanningBtn
