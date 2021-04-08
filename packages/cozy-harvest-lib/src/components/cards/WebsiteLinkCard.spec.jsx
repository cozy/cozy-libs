import React from 'react'
import { render } from '@testing-library/react'
import I18n from 'cozy-ui/transpiled/react/I18n'

import WebsiteLinkCard from './WebsiteLinkCard'
import enLocale from '../../locales/en'

describe('WebsiteLinkCard', () => {
  it('should render', () => {
    const link = 'https://fc.assure.ameli.fr/FRCO-app/login'
    const root = render(
      <I18n dictRequire={() => enLocale} lang="en">
        <WebsiteLinkCard link={link} />)
      </I18n>
    )
    const linkNode = root.getByText('fc.assure.ameli.fr')
    expect(linkNode.getAttribute('href')).toEqual(link)
  })
  it('should ignore invalid urls', () => {
    const link = 'www.trainline.fr'
    const root = render(
      <I18n dictRequire={() => enLocale} lang="en">
        <WebsiteLinkCard link={link} />
      </I18n>
    )
    expect(root.queryByText('www.trainline.fr')).toBeFalsy()
  })
})
