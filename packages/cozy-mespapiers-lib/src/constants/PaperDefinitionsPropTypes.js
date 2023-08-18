import PropTypes from 'prop-types'

const PaperDefinitionsStepAttrPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
})

export const PaperDefinitionsStepPropTypes = PropTypes.shape({
  model: PropTypes.string.isRequired,
  multipage: PropTypes.bool,
  page: PropTypes.string,
  illustration: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  attributes: PropTypes.arrayOf(PaperDefinitionsStepAttrPropTypes)
})

export const PaperDefinitionsPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  placeholderIndex: PropTypes.number,
  acquisitionSteps: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.arrayOf(PaperDefinitionsStepPropTypes).isRequired
  ]),
  featureDate: PropTypes.string,
  maxDisplay: PropTypes.number
})
