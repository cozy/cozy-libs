import React from 'react'

import BottomSheet, {
  BottomSheetHeader,
  BottomSheetItem
} from 'cozy-ui/transpiled/react/BottomSheet'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const PageEditMobile = ({ onClose, children }) => {
  const { t } = useI18n()

  return (
    <BottomSheet backdrop onClose={onClose}>
      <BottomSheetHeader className="u-ph-1 u-pb-1 u-flex-justify-center">
        <Typography>{t('PageEdit.title')}</Typography>
      </BottomSheetHeader>
      <BottomSheetItem disableGutters>{children}</BottomSheetItem>
    </BottomSheet>
  )
}

export default PageEditMobile
