import React from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Empty from 'cozy-ui/transpiled/react/Empty'
import CloudSync2 from 'cozy-ui/transpiled/react/Icons/CloudSync2'
import Button from 'cozy-ui/transpiled/react/Buttons'

interface ConnectCardProps {
  description: string
  title: string
  buttonProps: {
    busy: boolean
    disabled: boolean
    label: string
    onClick: () => void
  }
}

export const ConnectCard = ({
  buttonProps,
  description,
  title
}: ConnectCardProps): JSX.Element => (
  <Card className="u-flex u-flex-wrap">
    <Empty icon={CloudSync2} title={title} text={description} />

    <Button className="u-mh-auto" {...buttonProps} />
  </Card>
)
