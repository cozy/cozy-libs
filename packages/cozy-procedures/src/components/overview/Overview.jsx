import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'

import { withClient } from 'cozy-client'
import { AdministrativeProcedure } from 'cozy-doctypes'
import { creditApplicationTemplate } from 'cozy-procedures'
import CozyRealtime from 'cozy-realtime'
import {
  Title,
  SubTitle,
  Caption,
  Button,
  translate
} from 'cozy-ui/transpiled/react'
import InlineCard from 'cozy-ui/transpiled/react/InlineCard'

import DocumentsFullyCompleted from './DocumentsFullyCompleted'
import DocumentsNotFullyCompleted from './DocumentsNotFullyCompleted'
import EndModal from './EndModal'
import PersonalDataFullyCompleted from './PersonalDataFullyCompleted'
import PersonalDataNotFullyCompleted from './PersonalDataNotFullyCompleted'
import {
  createFileWithContent,
  fetchTransactionsHistoryContent
} from './helpers'
import ProcedureComponentsPropType from '../ProcedureComponentsPropType'
import Topbar from '../Topbar'

class Overview extends React.Component {
  realtime = null
  destinationFolderId = null

  state = {
    processing: false,
    success: false,
    error: false
  }

  componentWillUnmount() {
    if (this.realtime) {
      this.realtime.unsubscribeAll()
    }
  }

  navigateTo = view => {
    const { location, router } = this.props
    const rootPath = location.pathname
    const separator = rootPath.endsWith('/') ? '' : '/'
    router.push(`${rootPath}${separator}${view}`)
  }

  ensureRealtime = () => {
    if (!this.realtime) {
      this.realtime = new CozyRealtime({ client: this.props.client })
    }
  }

  handleZipChanged = jsonFiles => async job => {
    const { client } = this.props
    if (job.state === 'done') {
      this.setState({
        processing: false,
        success: true
      })

      jsonFiles.forEach(jsonFile => {
        client
          .collection('io.cozy.files')
          .deleteFilePermanently(jsonFile.id)
          .catch(err => {
            console.error('Error while trying to delete the json file: ', err)
          })
      })
    } else if (job.state === 'errored') {
      this.setState({
        processing: false,
        error: true
      })
      // if an error occured, destroy the zip and the json
      const resp = await client.collection('io.cozy.files').find(
        {
          dir_id: job.message.dir_id,
          name: job.message.filename
        },
        {
          indexedFields: ['dir_id', 'name']
        }
      )
      resp.data.forEach(zipFile => {
        client
          .collection('io.cozy.files')
          .deleteFilePermanently(zipFile.id)
          .catch(err => {
            console.error('Error while trying to delete the zip file: ', err)
          })
      })

      jsonFiles.forEach(jsonFile => {
        client
          .collection('io.cozy.files')
          .deleteFilePermanently(jsonFile)
          .catch(err => {
            console.error('Error while trying to delete the json file: ', err)
          })
      })
    }
  }

  getDestinationId = template => {
    const { client } = this.props
    return client
      .collection('io.cozy.files')
      .ensureDirectoryExists(template.pathToSave)
  }

  createProcedureJsonFile = (
    filename,
    destinationId,
    administrativeProcedure
  ) => {
    const { client } = this.props
    const jsonData = AdministrativeProcedure.createJson(administrativeProcedure)

    return createFileWithContent(client, filename, destinationId, jsonData)
  }

  createTransactionsHistoryJsonFile = async (filename, destinationId) => {
    const { client } = this.props
    const content = await fetchTransactionsHistoryContent(client)

    return createFileWithContent(client, filename, destinationId, content)
  }

  getFilesForZip = (jsonFiles, documentsData) => {
    const files = jsonFiles.reduce((acc, file) => {
      acc[file.name] = file.id

      return acc
    }, {})

    Object.keys(documentsData).forEach(categoryName => {
      const documentCategory = documentsData[categoryName]
      documentCategory.files.forEach(f => {
        // !TODO Remove this check. We need to clean datas structure before
        if (f) {
          const identifier = `documents/${f.name}`
          files[identifier] = f.id
        }
      })
    })

    return files
  }

  submitProcedure = async () => {
    const { client, data } = this.props
    const template = creditApplicationTemplate
    try {
      this.setState({
        processing: true
      })
      this.destinationFolderId = await this.getDestinationId(template)
      const datetime = new Date().toISOString()
      const baseFilename = `${template.type}-${datetime}`
      const procedureJsonFilename = `${baseFilename}.json`
      const historyJsonFilename = `transactions-history-${datetime}.json`

      const administrativeProcedure = AdministrativeProcedure.create(
        data,
        creditApplicationTemplate
      )
      const response = await client.create(
        'io.cozy.procedures.administratives',
        administrativeProcedure
      )

      const procedureJsonFile = await this.createProcedureJsonFile(
        procedureJsonFilename,
        this.destinationFolderId,
        response.data
      )

      const historyJsonFile = await this.createTransactionsHistoryJsonFile(
        historyJsonFilename,
        this.destinationFolderId
      )

      const files = this.getFilesForZip(
        [procedureJsonFile, historyJsonFile],
        data.documentsData
      )
      const params = {
        files,
        dir_id: this.destinationFolderId,
        filename: `${baseFilename}.zip`
      }
      this.ensureRealtime()
      const zipResp = await client
        .collection('io.cozy.jobs')
        .create('zip', params)

      await this.realtime.subscribe(
        'updated',
        'io.cozy.jobs',
        zipResp.data.id,
        this.handleZipChanged([procedureJsonFile, historyJsonFile])
      )
    } catch (e) {
      console.error(e)
      this.setState({
        processing: false,
        error: true
      })
    }
  }

  hideModal = () => {
    this.setState({
      processing: false,
      error: false,
      success: false
    })
  }

  render() {
    const {
      documentsCompleted,
      documentsTotal,
      personalDataFieldsCompleted,
      personalDataFieldsTotal,
      data,
      t,
      components: { PageLayout, PageContent, PageFooter }
    } = this.props
    const { success, error, processing } = this.state
    const { amount, duration } = data.procedureData

    return (
      <PageLayout>
        <PageContent>
          {(success || error) && (
            <EndModal
              isSuccessful={success}
              onClose={this.hideModal}
              folderId={this.destinationFolderId}
            />
          )}
          <Topbar
            title={t(`overview.titles.${creditApplicationTemplate.type}`)}
          />
          <Title className="u-mb-2">{t('overview.subtitle')}</Title>
          <section className="u-mb-2">
            <SubTitle className="u-mb-1">{t('overview.request')}</SubTitle>
            <div className="u-flex u-flex-items-center">
              {amount !== null ? (
                <InlineCard
                  className="u-c-pointer u-ph-1 u-pv-half u-lh-xlarge"
                  onClick={() => this.navigateTo('amount')}
                >
                  {t('overview.amountUnit', {
                    smart_count: amount
                  })}
                </InlineCard>
              ) : (
                <Button
                  label={t('overview.amount')}
                  theme="ghost"
                  className="u-ml-0"
                  onClick={() => this.navigateTo('amount')}
                />
              )}
              <span className="u-ph-half">{t('overview.over')}</span>
              {duration !== null ? (
                <InlineCard
                  className="u-c-pointer u-ph-1 u-pv-half u-lh-xlarge"
                  onClick={() => this.navigateTo('duration')}
                >
                  {t('overview.durationUnit', {
                    smart_count: duration
                  })}
                </InlineCard>
              ) : (
                <Button
                  label={t('overview.duration')}
                  theme="ghost"
                  onClick={() => this.navigateTo('duration')}
                />
              )}
            </div>
          </section>
          <section className="u-mb-2">
            <SubTitle className="u-mb-1">{t('overview.documents')}</SubTitle>
            {documentsCompleted !== documentsTotal && (
              <DocumentsNotFullyCompleted
                documentsCompleted={documentsCompleted}
                documentsTotal={documentsTotal}
                navigateTo={this.navigateTo}
              />
            )}
            {documentsCompleted === documentsTotal && (
              <DocumentsFullyCompleted
                documents={data.documentsData}
                navigateTo={this.navigateTo}
              />
            )}
          </section>
          <section className="u-mb-2">
            <SubTitle className="u-mb-1">{t('overview.personalData')}</SubTitle>
            {personalDataFieldsCompleted === personalDataFieldsTotal && (
              <PersonalDataFullyCompleted
                navigateTo={this.navigateTo}
                personalData={data.personalData}
              />
            )}
            {personalDataFieldsCompleted !== personalDataFieldsTotal && (
              <PersonalDataNotFullyCompleted
                navigateTo={this.navigateTo}
                personalDataFieldsCompleted={personalDataFieldsCompleted}
                personalDataFieldsTotal={personalDataFieldsTotal}
              />
            )}
          </section>
          <Caption className="u-mb-1">{t('overview.notice')}</Caption>
        </PageContent>
        <PageFooter>
          <Button
            label={t('overview.button')}
            extension="full"
            onClick={this.submitProcedure}
            busy={processing}
            disabled={processing}
          />
        </PageFooter>
      </PageLayout>
    )
  }
}

Overview.propTypes = {
  documentsCompleted: PropTypes.number,
  documentsTotal: PropTypes.number,
  personalDataFieldsCompleted: PropTypes.number,
  personalDataFieldsTotal: PropTypes.number,
  procedureData: PropTypes.shape({
    amount: PropTypes.number,
    duration: PropTypes.number
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired,
  components: ProcedureComponentsPropType.isRequired
}

Overview.defaultProps = {
  personalDataFieldsCompleted: 0,
  personalDataFieldsTotal: 0,
  location: {
    pathname: '/'
  }
}

export default translate()(withRouter(withClient(Overview)))
