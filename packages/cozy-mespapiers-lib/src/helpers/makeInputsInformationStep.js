import { ContactAdapter } from '../components/ModelSteps/widgets/ContactAdapter/ContactAdapter'
import InputDateAdapter from '../components/ModelSteps/widgets/InputDateAdapter'
import InputTextAdapter from '../components/ModelSteps/widgets/InputTextAdapter'
import RadioAdapter from '../components/ModelSteps/widgets/RadioAdapter'

const hasInputDate = ({ attrs }) => {
  return attrs.type === 'date'
}
const hasInputText = ({ attrs }) => {
  return attrs.type === 'text' || attrs.type === 'number'
}
const hasRadio = ({ attrs }) => {
  return attrs.type === 'radio'
}
const hasContact = ({ attrs }) => {
  return attrs.type === 'contact'
}

const inputInformationSpecs = {
  date: {
    condition: hasInputDate,
    component: InputDateAdapter
  },
  text: {
    condition: hasInputText,
    component: InputTextAdapter
  },
  radio: {
    condition: hasRadio,
    component: RadioAdapter
  },
  contact: {
    condition: hasContact,
    component: ContactAdapter
  }
}

/**
 * Get only the correct Inputs based on the attributes passed
 *
 * @param {Object[]} attributes - Array of PapersDefinitions attributes
 * @returns {{ Component: Object, attrs: Object }[]}
 */
export const makeInputsInformationStep = (attributes = []) => {
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
