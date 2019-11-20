import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Text from 'cozy-ui/transpiled/react/Text'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import Icon from 'cozy-ui/transpiled/react/Icon'

const DataTypes = ({ t, dataTypes, konnectorName }) => {
  return dataTypes.length > 0 ? (
    <>
      <Text className="u-ta-center">
        {t('suggestions.data', { name: konnectorName })}
      </Text>
      <ul className="u-w-100 u-nolist u-mt-0 u-ph-0 u-mb-half">
        {dataTypes.map(dataType => (
          <li key={dataType}>
            <CompositeRow
              primaryText={t(`dataType.${dataType}`)}
              image={
                <Icon
                  size={32}
                  icon={
                    require('!svg-sprite-loader!../../assets/datatypes/icon-' +
                      dataType.toLowerCase() +
                      '.svg').default
                  }
                />
              }
            />
          </li>
        ))}
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
