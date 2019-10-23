import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { Code } from '../src'

const codeSnippet = `function foo() {
  return 'bar'
}`

storiesOf('Code', module)
  .add(
    'Default',
    withInfo({
      inline: true,
      text: 'Format a block of code and preserve whitespace'
    })(() => <Code>{codeSnippet}</Code>)
  )
  .add(
    'Big text',
    withInfo({
      inline: true,
      text: 'Format a block of code and preserve whitespace'
    })(() => (
      <Code fontSize={4} bg={'background.light'}>
        {codeSnippet}
      </Code>
    ))
  )
