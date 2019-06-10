import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Form from 'react-jsonschema-form'
import { Button } from 'cozy-ui/transpiled/react'

import {
  FieldTemplate,
  InputAdapter,
  InputWithUnit,
  ObjectFieldTemplate,
  SelectBoxAdapter,
  TextareaAdapter
} from './form'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'
import withLocales from '../withLocales'

const { schema, uiSchema } = creditApplicationTemplate.personalData

const widgets = {
  BaseInput: InputAdapter,
  SelectWidget: SelectBoxAdapter,
  TextareaWidget: TextareaAdapter,
  InputWithUnit
}

class PersonalDataForm extends React.Component {
  render() {
    const { formData, updateFormData, router } = this.props
    return (
      <div className="u-ml-2">
        <h2 className="u-title-h2">Personal data</h2>
        <Form
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
          FieldTemplate={FieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          widgets={widgets}
          onChange={({ formData }) => updateFormData(formData)}
        >
          <Button label="Go!" className="u-mt-2" onClick={router.goBack} />
        </Form>
      </div>
    )
  }
}

PersonalDataForm.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  })
}

PersonalDataForm.defaultProps = {
  formData: {}
}

export default withLocales(withRouter(PersonalDataForm))
