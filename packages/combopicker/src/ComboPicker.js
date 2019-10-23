import React, { Component } from 'react'
import { Input, Flex, IconButton } from 'pcln-design-system'

export default class ComboPicker extends Component {
  render() {
    return (
      <Flex width={[1, null, null, 1 / 2]}>
        <IconButton name="Minus" />
        <Input />
        <IconButton name="Plus" />
      </Flex>
    )
  }
}

ComboPicker.defaultProps = {}

ComboPicker.propTypes = {}
