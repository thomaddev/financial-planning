import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import toast from 'react-hot-toast'
import { FormAction, JsonFormFrappe } from '@vise/kit'
import { useTranslations } from 'next-intl'
import { isEmptyObject } from '@vise/kit'

interface PlanningDetailBtnProps {
  toggleDialog: boolean
  initialData?: object
  docType: string
  specificSection?: string
  onSubmitDialog: (data: object) => void
  onCloseDialog: () => void
  formAction: FormAction
}

const PlanningDetailBtn: React.FC<PlanningDetailBtnProps> = ({
  toggleDialog,
  initialData = {},
  docType,
  onSubmitDialog,
  onCloseDialog,
  formAction,
}) => {
  const t = useTranslations()
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState<object>({})
  const [formDataErrors, _setFormDataErrors] = useState<any[]>([])

  // Effect to sync with `toggleDialog`
  useEffect(() => {
    setShowDialog(toggleDialog)
  }, [toggleDialog])

  // Effect to sync `initialData` into `formData`
  useEffect(() => {
    if (!isEmptyObject(initialData)) {
      setFormData(initialData)
    } else {
      setFormData({})
    }
  }, [initialData])

  const handleAddItem = () => {
    setShowDialog(true)
    setFormData({})
  }

  const handleClose = () => {
    setShowDialog(false)
    onCloseDialog()
  }

  const handleSubmit = () => {
    if (formDataErrors.length > 0) {
      toast.error(t('please_fill_in_all_required_fields'))
      return
    }
    setShowDialog(false)
    onSubmitDialog(formData)
    setFormData({})
  }

  const handleFormUpdate = (updatedData: any) => {
    console.log(updatedData)
    setFormData(updatedData)
  }

  return (
    <>
      {/* Add Item Button */}
      <Button
        data-test="planning-detail-btn"
        variant="contained"
        color="primary"
        onClick={handleAddItem}
      >
        {t('addItem')}
      </Button>

      {/* Dialog Modal */}
      <Dialog
        open={showDialog}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        data-test="planning-detail-modal"
      >
        <DialogTitle>{t('addItem')}</DialogTitle>
        <DialogContent>
          <JsonFormFrappe
            formAction={formAction}
            doctype={docType}
            formData={formData}
            onChange={handleFormUpdate}
          />
          {/* <JsonFormDocType
            formMode="create"
            docType={docType}
            initialData={formData}
            excludeFields={EXCLUDE_COMMON_FIELDS}
            onUpdateData={({ data, errors }) => {
              setFormData(data);
              setFormDataErrors(errors || []);
            }}
            specificSection={specificSection}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {t('ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PlanningDetailBtn
