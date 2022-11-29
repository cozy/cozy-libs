export const makeLabel = ({
  t,
  f,
  running,
  expectingTriggerLaunch,
  lastSuccessDate
}) => {
  return running || expectingTriggerLaunch
    ? t('card.launchTrigger.lastSync.syncing')
    : lastSuccessDate
    ? f(lastSuccessDate, t('card.launchTrigger.lastSync.format'))
    : t('card.launchTrigger.lastSync.unknown')
}
