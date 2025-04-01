import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { FormAction } from '@vise/kit'
import { useTranslations } from 'next-intl'
import Grid from '@mui/material/Grid2'

interface AddRowButtonProps {
  className?: string
  docType: string
  formAction?: FormAction
  isDialogOpen: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onChangeFormDataGrid: (formData: any) => void
  handleSubmitDialog: (formData: any) => void
  formData?: any
  docStatus?: string | number
}

export default function AddRowButton({
  className = '',
  docType,
  formAction = 'create' as FormAction,
  isDialogOpen,
  onOpenDialog,
  onCloseDialog,
  onChangeFormDataGrid,
  handleSubmitDialog,
  formData = {},
  docStatus,
}: AddRowButtonProps) {
  const t = useTranslations()
  return (
    <>
      <button
        onClick={docStatus === 1 ? undefined : onOpenDialog}
        className={`absolute top-[68px] right-[26px] ml-2 px-[8px] py-[7px] ${docStatus === 1 ? '' : 'cursor-pointer'}
          rounded-[5px] border border-[${docStatus === 1 ? 'var(--color-input-stroke)' : 'var(--background-brand-default)'}] bg-[${docStatus === 1 ? '' : 'var(--background-brand-default)'}]
          text-white hover:${docStatus === 1 ? 'bg-[var(--color-input-stroke)]' : 'bg-[#2463EB]/90'} ${className}`}
      >
        <AddIcon
          sx={{
            color: docStatus === 1 ? 'var(--color-input-stroke)' : ')',
          }}
        />
      </button>

      <Dialog open={isDialogOpen} onClose={onCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{t('addItem')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData?.title || ''}
                onChange={(e) => onChangeFormDataGrid({ ...formData, title: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={() => handleSubmitDialog(formData)} color="primary" variant="contained">
            {t('ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
