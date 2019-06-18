import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Form from 'react-jsonschema-form'
import { Button, SubTitle, Title } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import {
  FieldTemplate,
  InputAdapter,
  InputWithUnit,
  ObjectFieldTemplate,
  SelectBoxAdapter,
  TextareaAdapter
} from './form'
import Topbar from './Topbar'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'

const { schema, uiSchema } = creditApplicationTemplate.personalData

const widgets = {
  BaseInput: InputAdapter,
  SelectWidget: SelectBoxAdapter,
  TextareaWidget: TextareaAdapter,
  InputWithUnit
}

class PersonalDataForm extends React.Component {
  render() {
    const { formData, updateFormData, router, t } = this.props
    return (
      <div className="u-ml-2">
        <Topbar title={t('personalDataForm.title')} />
        <SubTitle>{t('personalData.subtitle')}</SubTitle>
        <Form
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
          FieldTemplate={FieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          widgets={widgets}
          onChange={({ formData }) => updateFormData(formData)}
        >
          <Button
            label={t('validate')}
            className="u-mt-2"
            onClick={router.goBack}
          />
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
  }),
  t: PropTypes.func.isRequired
}

PersonalDataForm.defaultProps = {
  formData: {}
}

export default withRouter(translate()(PersonalDataForm))
