import React from 'react'

import { PageFooter } from 'cozy-ui/transpiled/react'

import { optionsProvider, optionsConsumer } from './ProcedureOptions'

describe('options', () => {
  const DumbWrapper = ({ children }) => <div>{children}</div>
  const DumbItem = ({ children }) => <div>{children}</div>
  const Item = optionsConsumer(DumbItem)

  it('should work with default options', () => {
    const Wrapper = optionsProvider(DumbWrapper)
    const root = mount(
      <Wrapper>
        <Item />
      </Wrapper>
    )
    expect(root.find(DumbItem).props().components.PageFooter).toBe(PageFooter)
  })

  it('should work with passed options', () => {
    const CustomPageFooter = () => <div />
    const Wrapper = optionsProvider(DumbWrapper, {
      components: { PageFooter: CustomPageFooter }
    })
    const DumbItem = ({ children }) => <div>{children}</div>
    const Item = optionsConsumer(DumbItem)

    const root = mount(
      <Wrapper>
        <Item />
      </Wrapper>
    )
    expect(root.find(DumbItem).props().components.PageFooter).toBe(
      CustomPageFooter
    )
  })
})
