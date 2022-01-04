import { PageFooter } from 'cozy-ui/transpiled/react'
import React from 'react'
import { optionsProvider, optionsConsumer } from './ProcedureOptions'

describe('options', () => {
  function DumbWrapper({ children }) {
    return <div>{children}</div>
  }
  function DumbItem({ children }) {
    return <div>{children}</div>
  }
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
    function CustomPageFooter() {
      return <div />
    }
    const Wrapper = optionsProvider(DumbWrapper, {
      components: { PageFooter: CustomPageFooter }
    })
    function DumbItem({ children }) {
      return <div>{children}</div>
    }
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
