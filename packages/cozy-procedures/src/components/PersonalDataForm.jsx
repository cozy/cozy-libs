import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Form from 'react-jsonschema-form'
import get from 'lodash/get'
import { Button, SubTitle } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import {
  FieldTemplate,
  InputAdapter,
  InputWithUnit,
  ObjectFieldTemplate,
  SelectBoxAdapter,
  TextareaAdapter
} from './form'
import CompletedFromMyselfStatus from '../containers/CompletedFromMyselfStatus'
import Topbar from './Topbar'
import { creditApplicationTemplate } from 'cozy-procedures'

const widgets = {
  BaseInput: InputAdapter,
  SelectWidget: SelectBoxAdapter,
  TextareaWidget: TextareaAdapter,
  InputWithUnit
}

class PersonalDataForm extends React.Component {
  render() {
    const { formData, updateFormData, router, t } = this.props
    const schema = get(creditApplicationTemplate, 'personalData.schema')
    const uiSchema = get(creditApplicationTemplate, 'personalData.uiSchema')

    return (
      <div>
        <Topbar title={t('personalDataForm.title')} />
        <SubTitle>{t('personalDataForm.subtitle')}</SubTitle>
        <CompletedFromMyselfStatus />
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
            label={t('confirm')}
            onClick={router.goBack}
            extension="full"
            className="u-mb-1"
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
