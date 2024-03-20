import React from "react";

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'

import I18n from 'cozy-ui/transpiled/react/providers/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { CozyProvider, createFakeClient } from 'cozy-client'

import enLocale from '../locales/en.json'
import SharingContext from "../src/context";

const preview = {
  decorators: [
    (Story) => {
      const fakeClient = createFakeClient({
        queries: {
          'io.cozy.settings/instance': {
            doctype: 'io.cozy.settings',
            definition: {
              doctype: 'io.cozy.settings',
              id: 'io.cozy.settings/io.cozy.settings.instance'
            },
            data: [
              {
                id: 'io.cozy.settings/io.cozy.settings.instance',
                attributes: {
                  public_name: 'Alice'
                }
              }
            ]
          }
        },
        clientOptions: {
          uri: 'http://alice.cozy.localhost:8080'
        }
      })
      return (
      <CozyProvider client={fakeClient}>
        <CozyTheme>
          <BreakpointsProvider>
            <SharingContext.Provider value={{
              revokeGroup: () => {},
              revokeSelf: () => {}
            }}>
              <I18n lang="en" dictRequire={() => enLocale}>
                <div style={{position: "relative"}}>
                  <Story />
                </div>
              </I18n>
            </SharingContext.Provider>
          </BreakpointsProvider>
        </CozyTheme>
      </CozyProvider>
    )},
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
