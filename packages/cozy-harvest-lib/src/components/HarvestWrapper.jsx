// @ts-check
import React from 'react'

import HarvestVaultProvider from './HarvestVaultProvider'
import { MountPointProvider } from './MountPointContext'
import ComponentsPropsProvider from './Providers/ComponentsPropsProvider'
import VaultUnlockProvider from './VaultUnlockProvider'

/**
 * @param {{ mountPointProviderProps?: { baseRoute: string; }; componentsPropsProviderProps?: { ComponentsProps: import("./Providers/ComponentsPropsProvider").ComponentsProps; }; children: JSX.Element; }} props
 */
export default function HarvestWrapper(props) {
  return (
    <MountPointProvider baseRoute={props?.mountPointProviderProps?.baseRoute}>
      <HarvestVaultProvider>
        <VaultUnlockProvider>
          <ComponentsPropsProvider
            ComponentsProps={
              props?.componentsPropsProviderProps?.ComponentsProps
            }
          >
            {props.children}
          </ComponentsPropsProvider>
        </VaultUnlockProvider>
      </HarvestVaultProvider>
    </MountPointProvider>
  )
}
