import InputDateAdapter from '../components/ModelSteps/widgets/InputDateAdapter'
import InputTextAdapter from '../components/ModelSteps/widgets/InputTextAdapter'

const hasInputDate = ({ attrs }) => {
  return attrs.type === 'date'
}
const hasInputText = ({ attrs }) => {
  return attrs.type === 'text' || attrs.type === 'number'
}

const inputInformationSpecs = {
  date: {
    condition: hasInputDate,
    component: InputDateAdapter
  },
  text: {
    condition: hasInputText,
    component: InputTextAdapter
  }
}

/**
 * Get only the correct Inputs based on the attributes passed
 *
 * @param {Object[]} attributes - Array of PapersDefinitions attributes
 * @returns {{ Component: Object, attrs: Object }[]}
 */
export const getInputsInformationStep = (attributes = []) => {
  const inputs = []

  for (const attrs of attributes) {
    Object.values(inputInformationSpecs).forEach(stepRule => {
      if (stepRule.condition({ attrs })) {
        inputs.push({ Component: stepRule.component, attrs })
      }
    })
  }

  return inputs
}
