import { render } from '@testing-library/react'
import React from 'react'

import DemoProvider from 'cozy-ui/transpiled/react/providers/DemoProvider'

import { UploadQueue, formatRemainingTime } from '.'
import localeEn from './locales/en.json'

describe('UploadQueue', () => {
  describe('formatRemainingTime', () => {
    it('should return correct remaining time', () => {
      const time = formatRemainingTime(29)

      expect(time).toEqual('less than a minute')
    })
  })

  describe('UploadQueue', () => {
    it('should set singular value when "1 minute remaining"', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 89 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('1 minute remaining')
    })

    it('should set singular value when "moins d 1 minute remaining"', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 29 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('less than a minute remaining')
    })

    it('should set plural value when "44 minutes remainings"', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 2669 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('44 minutes remaining')
    })

    it('should set singular value when "1 hour remaining" - low limit', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 2671 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('about 1 hour remaining')
    })

    it('should set singular value when "about 1 hour remaining" - high limit', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 5369 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('about 1 hour remaining')
    })

    it('should set plural value when more than "2 hours remainings"', () => {
      const item = {
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded: 1234, total: 5678, remainingTime: 5371 },
        getMimeTypeIcon: 'getMimeTypeIcon'
      }

      const { container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('about 2 hours remaining')
    })

    it('should not update time and bar everytime loaded/remaining time update', () => {
      const item = (remainingTime, loaded) => ({
        file: { name: 'file' },
        status: 'status',
        isDirectory: 'isDirectory',
        progress: { loaded, total: 4936, remainingTime },
        getMimeTypeIcon: 'getMimeTypeIcon'
      })

      const { rerender, getAllByRole, container } = render(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item(5371, 1234)]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('about 2 hours remaining')
      expect(getAllByRole('progressbar')[1]).toHaveAttribute(
        'aria-valuenow',
        '25'
      )

      rerender(
        <DemoProvider dictRequire={() => localeEn}>
          <UploadQueue queue={[item(1, 5677)]} />
        </DemoProvider>
      )

      expect(
        container.getElementsByClassName('u-flex-shrink')[0]
      ).toHaveTextContent('about 2 hours remaining')
      expect(getAllByRole('progressbar')[1]).toHaveAttribute(
        'aria-valuenow',
        '25'
      )
    })
  })
})
