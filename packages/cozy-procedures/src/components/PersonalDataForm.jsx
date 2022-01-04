import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Form from 'react-jsonschema-form'
import get from 'lodash/get'
import { Button, Title } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { creditApplicationTemplate } from 'cozy-procedures'
import ProcedureComponentsPropType from './ProcedureComponentsPropType'

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

const widgets = {
  BaseInput: InputAdapter,
  SelectWidget: SelectBoxAdapter,
  TextareaWidget: TextareaAdapter,
  InputWithUnit
}

class PersonalDataForm extends React.Component {
  render() {
    const {
      formData,
      updateFormData,
      router,
      t,
      components: { PageLayout, PageContent, PageFooter }
    } = this.props
    const schema = get(creditApplicationTemplate, 'personalData.schema')
    const uiSchema = get(creditApplicationTemplate, 'personalData.uiSchema')

    return (
      <PageLayout>
        <PageContent>
          <Topbar title={t('personalDataForm.title')} />
          <Title className="u-ta-center u-mb-2">
            {t('personalDataForm.subtitle')}
          </Title>
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
            <PageFooter>
              <Button
                label={t('confirm')}
                onClick={router.goBack}
                extension="full"
              />
            </PageFooter>
          </Form>
        </PageContent>
      </PageLayout>
    )
  }
}

PersonalDataForm.propTypes = {
  formData: PropTypes.object,
  updateFormData: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }),
  t: PropTypes.func.isRequired,
  components: ProcedureComponentsPropType.isRequired
}

PersonalDataForm.defaultProps = {
  formData: {}
}

export default withRouter(translate()(PersonalDataForm))
