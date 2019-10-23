import React from 'react'
import { storiesOf } from '@storybook/react'
import { Flex } from 'pcln-design-system'
import NumberPicker from '../src/NumberPicker.js'

storiesOf('ComboPicker', module)
  .add('One input', () => <NumberPicker />)
  .add('Multiple inputs', () => (
    <Flex flexDirection="column">
      <NumberPicker />
      <NumberPicker />
      <NumberPicker />
    </Flex>
  ))
