import PropTypes from 'prop-types'

function getMutationsProptypes(mutations) {
  return {
    ...Object.keys(mutations()).reduce((propTypes, mutationName) => {
      propTypes[mutationName] = PropTypes.func
      return propTypes
    }, {}),
    // FIXME use directly proptypes from cozy-client when available
    createDocument: PropTypes.func,
    saveDocument: PropTypes.func,
    deleteDocument: PropTypes.func
  }
}

const intentsApiProptype = PropTypes.shape({
  fetchSessionCode: PropTypes.func,
  showInAppBrowser: PropTypes.func,
  closeInAppBrowser: PropTypes.func,
  tokenParamName: PropTypes.string
})

const innerAccountModalOverridesProptype = PropTypes.shape({
  SyncButtonWrapperComp: PropTypes.func,
  deleteAccountLabel: PropTypes.string
})

export {
  getMutationsProptypes,
  intentsApiProptype,
  innerAccountModalOverridesProptype
}
