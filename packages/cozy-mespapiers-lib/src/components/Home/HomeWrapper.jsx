import React from 'react'

import Home from './Home'
import { Providers } from '../MesPapiersLib'

const HomeWrapper = () => {
  return (
    <Providers>
      <Home />
    </Providers>
  )
}

export default HomeWrapper
