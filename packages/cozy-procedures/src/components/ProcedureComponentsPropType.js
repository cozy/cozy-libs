import PropTypes from 'prop-types'

export default PropTypes.shape({
  PageLayout: PropTypes.elementType.isRequired,
  PageFooter: PropTypes.elementType.isRequired,
  PageContent: PropTypes.elementType.isRequired
})
