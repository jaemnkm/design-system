import React, { Component } from 'react'
import styled from 'styled-components'
import { Input, Flex, IconButton } from 'pcln-design-system'

const CenteredInput = styled(Input)`
  text-align: center;
`

export default class NumberPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0
    }
  }

  updateValue(newVal) {
    this.setState(prevState => ({ value: prevState.value + newVal }))
  }

  render() {
    const { value } = this.state
    return (
      <Flex width={[1, null, null, 1 / 2]} m={2}>
        <IconButton
          name="RadioMinus"
          onClick={() => this.updateValue(-1)}
          mr={2}
        />
        <CenteredInput value={value} />
        <IconButton
          name="RadioPlus"
          onClick={() => this.updateValue(1)}
          ml={2}
        />
      </Flex>
    )
  }
}

NumberPicker.defaultProps = {}

NumberPicker.propTypes = {}
