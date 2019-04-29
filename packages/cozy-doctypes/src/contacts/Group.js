const PropTypes = require('prop-types')

const Document = require('../Document')

class Group extends Document {}

const GroupShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  _type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  trashed: PropTypes.bool
})

Group.doctype = 'io.cozy.contacts.groups'
Group.propType = GroupShape

module.exports = Group
