import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Manager, Reference } from 'react-popper'
import PopoverContent from './PopoverContent'

class Popover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPopoverOpen: false
    }
    this.contentRef = React.createRef()
    this.triggerRef = React.createRef()
    this.handleToggle = this.handleToggle.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.setFocusToRef = this.setFocusToRef.bind(this)
  }

  handleToggle(evt, isOpen) {
    evt.preventDefault()
    evt.stopPropagation()
    if (isOpen) {
      this.handleClose()
    } else {
      this.handleOpen()
    }
  }

  handleClose() {
    this.setState({ isPopoverOpen: false }, () => {
      this.setFocusToRef(this.triggerRef)
    })
  }

  handleOpen() {
    this.setState({ isPopoverOpen: true }, () => {
      this.setFocusToRef(this.contentRef)
    })
  }

  setFocusToRef(ref) {
    try {
      ref.current.focus({
        preventScroll: true
      })
    } catch {
      // We need to be safe in case the ref is invalid, which will unmount component
      /*istanbul ignore next*/
      return false
    }
  }

  render() {
    const { isPopoverOpen } = this.state
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            // Need to be a native element, because of ref forwarding limitations with DS functional components
            <InlineContainer innerRef={ref}>
              {// Clone element to pass down toggle event so it can be used directly from children as needed
              React.cloneElement(this.props.children, {
                'aria-label': 'Click to open popover with more information',
                onClick: evt => this.handleToggle(evt, isPopoverOpen),
                innerRef: this.triggerRef, // Need to use inner ref for DS core components using styled components v4
                ref: this.triggerRef // Additionally need to add ref, in case native element is used as trigger
              })}
            </InlineContainer>
          )}
        </Reference>
        {isPopoverOpen && (
          <PopoverContent
            {...this.props}
            onCloseRequest={this.handleClose}
            contentRef={this.contentRef}
          />
        )}
      </Manager>
    )
  }
}

const InlineContainer = styled.div`
  display: inline-block;
`

Popover.propTypes = {
  idx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // ID needs to be required for A11y purposes. We need to uniquely identify each popover on screen
  renderContent: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  p: PropTypes.number,
  bg: PropTypes.string,
  borderColor: PropTypes.string,
  placement: PropTypes.string,
  zIndex: PropTypes.number,
  width: PropTypes.number,
  overlayOpacity: PropTypes.number
}

export default Popover
