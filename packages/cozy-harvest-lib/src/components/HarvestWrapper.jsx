// @ts-check
import React from 'react'

import HarvestVaultProvider from './HarvestVaultProvider'
import ComponentsPropsProvider from './Providers/ComponentsPropsProvider'
import { IntentProvider } from './Providers/IntentProvider'
import VaultUnlockProvider from './VaultUnlockProvider'
/**
 * @param {{
 *  componentsPropsProviderProps?: {
 *    ComponentsProps: import("./Providers/ComponentsPropsProvider").ComponentsProps;
 *  };
 *  intentData?: object;
 *  intentId?: string;
 * children: JSX.Element; }} props
 */
export default function HarvestWrapper(props) {
  return (
    <HarvestVaultProvider>
      <VaultUnlockProvider>
        <IntentProvider intentData={props.intentData} intentId={props.intentId}>
          <ComponentsPropsProvider
            ComponentsProps={
              props?.componentsPropsProviderProps?.ComponentsProps
            }
          >
            {props.children}
          </ComponentsPropsProvider>
        </IntentProvider>
      </VaultUnlockProvider>
    </HarvestVaultProvider>
  )
}
