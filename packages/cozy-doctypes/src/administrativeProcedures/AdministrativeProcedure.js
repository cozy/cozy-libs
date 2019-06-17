const PropTypes = require('prop-types')

const Document = require('../Document')

class AdministrativeProcedure extends Document {}

const AdministrativeShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  _type: PropTypes.string.isRequired,
  procedureData: PropTypes.object.isRequired,
  personalData: PropTypes.object.isRequired,
  relationships: PropTypes.shape({
    templates: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          _type: PropTypes.string.isRequired
        })
      )
    }),
    files: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          _type: PropTypes.string.isRequired,
          templateDocumentId: PropTypes.string.isRequired
        })
      )
    })
  })
})

AdministrativeProcedure.doctype = 'io.cozy.procedures.administratives'
AdministrativeProcedure.propType = AdministrativeShape

module.exports = AdministrativeProcedure
