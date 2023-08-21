import React, { useEffect } from 'react'
import { useParams, useRouteError } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import styles from './styles.styl'
import MesPapiersBroken from '../../assets/icons/MesPapiersBroken.svg'
import { useError } from '../Contexts/ErrorProvider'
import PapersListToolbar from '../Papers/PapersListToolbar'

const ErrorBoundary = () => {
  const params = useParams()
  const routeError = useRouteError()
  const { t } = useI18n()
  const { setError } = useError()

  useEffect(() => {
    setError(routeError)
  }, [routeError, setError])

  return (
    <>
      {params.qualificationLabel && (
        <PapersListToolbar selectedThemeLabel={params.qualificationLabel} />
      )}
      <Empty
        className={styles['errorBoundaryEmpty']}
        icon={MesPapiersBroken}
        iconSize="large"
        title={t('ErrorBoundary.title')}
        text={t('ErrorBoundary.text')}
      >
        <Button
          className="u-mt-1"
          label={t('ErrorBoundary.action')}
          onClick={() => window.location.reload()}
        />
      </Empty>
    </>
  )
}

export default ErrorBoundary
