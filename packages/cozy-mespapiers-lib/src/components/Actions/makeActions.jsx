/**
 * Make array of actions
 * (to be consumed by the ActionsItems component)
 *
 * @param {Function[]} actionCreators - Array of function to create ActionMenuItem components with associated actions and conditions
 * @param {object} actionOptions - Options that need to be passed on Actions
 * @returns {object[]} Array of actions
 */
const makeActions = (actionCreators = [], actionOptions = {}) => {
  return actionCreators.map(createAction => {
    const actionMenu = createAction(actionOptions)
    const name = actionMenu.name || createAction.name

    return { [name]: actionMenu }
  })
}

export default makeActions
