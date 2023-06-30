import PropTypes from 'prop-types'
import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import CompositeRow from 'cozy-ui/transpiled/react/deprecated/CompositeRow'

import activityIcon from '../../assets/datatypes/icon-activity.svg'
import appointmentIcon from '../../assets/datatypes/icon-appointment.svg'
import bankAccountsIcon from '../../assets/datatypes/icon-bankAccounts.svg'
import bankTransactionsIcon from '../../assets/datatypes/icon-bankTransactions.svg'
import billIcon from '../../assets/datatypes/icon-bill.svg'
import bloodPressureIcon from '../../assets/datatypes/icon-bloodPressure.svg'
import calendarIcon from '../../assets/datatypes/icon-calendar.svg'
import certificateIcon from '../../assets/datatypes/icon-certificate.svg'
import commitIcon from '../../assets/datatypes/icon-commit.svg'
import consumptionIcon from '../../assets/datatypes/icon-consumption.svg'
import contactIcon from '../../assets/datatypes/icon-contact.svg'
import contractIcon from '../../assets/datatypes/icon-contract.svg'
import courseMaterialIcon from '../../assets/datatypes/icon-courseMaterial.svg'
import documentIcon from '../../assets/datatypes/icon-document.svg'
import eventIcon from '../../assets/datatypes/icon-event.svg'
import familyIcon from '../../assets/datatypes/icon-family.svg'
import geopointIcon from '../../assets/datatypes/icon-geopoint.svg'
import heartbeatIcon from '../../assets/datatypes/icon-heartbeat.svg'
import homeIcon from '../../assets/datatypes/icon-home.svg'
import phonecommunicationlogIcon from '../../assets/datatypes/icon-phonecommunicationlog.svg'
import pictureIcon from '../../assets/datatypes/icon-picture.svg'
import podcastIcon from '../../assets/datatypes/icon-podcast.svg'
import profileIcon from '../../assets/datatypes/icon-profile.svg'
import refundIcon from '../../assets/datatypes/icon-refund.svg'
import sinisterIcon from '../../assets/datatypes/icon-sinister.svg'
import sleepTimeIcon from '../../assets/datatypes/icon-sleepTime.svg'
import stepsNumberIcon from '../../assets/datatypes/icon-stepsNumber.svg'
import temperatureIcon from '../../assets/datatypes/icon-temperature.svg'
import travelDateIcon from '../../assets/datatypes/icon-travelDate.svg'
import tweetIcon from '../../assets/datatypes/icon-tweet.svg'
import videostreamIcon from '../../assets/datatypes/icon-videostream.svg'
import weightIcon from '../../assets/datatypes/icon-weight.svg'

const icons = {
  activity: activityIcon,
  appointment: appointmentIcon,
  bankTransactions: bankTransactionsIcon,
  bankAccounts: bankAccountsIcon,
  bill: billIcon,
  bloodPressure: bloodPressureIcon,
  calendar: calendarIcon,
  certificate: certificateIcon,
  commit: commitIcon,
  consumption: consumptionIcon,
  contact: contactIcon,
  contract: contractIcon,
  courseMaterial: courseMaterialIcon,
  document: documentIcon,
  event: eventIcon,
  family: familyIcon,
  geopoint: geopointIcon,
  heartbeat: heartbeatIcon,
  home: homeIcon,
  phonecommunicationlog: phonecommunicationlogIcon,
  picture: pictureIcon,
  podcast: podcastIcon,
  profile: profileIcon,
  refund: refundIcon,
  sinister: sinisterIcon,
  sleepTime: sleepTimeIcon,
  stepsNumber: stepsNumberIcon,
  temperature: temperatureIcon,
  travelDate: travelDateIcon,
  tweet: tweetIcon,
  videostream: videostreamIcon,
  weight: weightIcon
}

const DataTypes = ({ t, dataTypes, konnectorName }) => {
  return dataTypes.length > 0 ? (
    <>
      <Typography className="u-ta-center" variant="body1">
        {t('suggestions.data', { name: konnectorName })}
      </Typography>
      <ul className="u-w-100 u-nolist u-mt-0 u-ph-0 u-mb-half">
        {dataTypes.map(dataType => {
          const TypeIcon = icons[dataType]
          return (
            <li key={dataType}>
              <CompositeRow
                primaryText={t(`dataType.${dataType}`)}
                image={TypeIcon ? <TypeIcon className="u-w-2 u-h-2" /> : null}
              />
            </li>
          )
        })}
      </ul>
    </>
  ) : null
}

DataTypes.propTypes = {
  t: PropTypes.func.isRequired,
  dataTypes: PropTypes.array.isRequired,
  konnectorName: PropTypes.string.isRequired
}

export default translate()(DataTypes)
