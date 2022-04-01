const makeActions = (actionCreators, actionOptions = {}) => {
  let actions = []
  actionCreators.forEach(createAction => {
    const actionMenu = createAction(actionOptions)
    const name = actionMenu.label || actionMenu.icon

    actions = [...actions, { [name]: actionMenu }]
  })
  return actions
}

export default makeActions
