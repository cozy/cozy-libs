import React, { useMemo } from 'react'

import { models } from 'cozy-client'

import { useDatacardOptions } from './DatacardOptionsContext'

const findSuitableDataCards = (datacardOptions, datacardContext) => {
  return datacardOptions.datacards
    .filter(({ match }) => match(datacardContext))
    .map(x => x.component)
}

const Datacards = ({ konnector, account, trigger }) => {
  const datacardOptions = useDatacardOptions()
  const datacards = useMemo(() => {
    const datacardContext = { konnector, trigger, account }
    return datacardOptions
      ? findSuitableDataCards(datacardOptions, datacardContext)
      : []
  }, [konnector, trigger, account, datacardOptions])
  return (
    <>
      {datacards.map((Datacard, i) => (
        <Datacard
          key={i}
          konnector={konnector}
          trigger={trigger}
          accountId={trigger.message.account}
          sourceAccountIdentifier={models.account.getAccountLogin(account)}
        />
      ))}
    </>
  )
}

export default Datacards
