import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FabWrapper from '../FabWrapper'

const HomeSkeletons = ({ withFabs, ...props }) => {
  const { t } = useI18n()

  return (
    <>
      <div {...props} className="u-flex u-flex-column-m u-m-1">
        <div className="u-flex u-w-100 u-flex-items-center u-mv-half">
          <SearchBar placeholder=" " disabled />
        </div>
        <div className="u-flex u-flex-justify-center-m u-mt-half-m u-flex-wrap-m u-ml-0-m u-ml-1-half">
          {[...Array(10)].map((_, index) => (
            <CircleButton
              key={index}
              style={{ padding: 0, boxShadow: 'none' }}
              label={
                <Skeleton
                  className="u-mv-0 u-mh-auto"
                  variant="text"
                  width="75%"
                />
              }
              disabled
            >
              <Skeleton variant="circle" width={48} height={48} />
            </CircleButton>
          ))}
        </div>
      </div>
      <ListSkeleton count={6} divider />
      {withFabs && (
        <FabWrapper>
          <Fab className="u-mr-half" disabled>
            <Icon icon="reply" />
          </Fab>
          <Fab color="primary" variant="extended" disabled>
            <Icon icon="plus" className="u-mr-half" />
            {t('common.add')}
          </Fab>
        </FabWrapper>
      )}
    </>
  )
}

export default HomeSkeletons
