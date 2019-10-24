import styled from 'styled-components'

import { fontSize, lineHeight, space } from 'styled-system'
import { mapProps, applyVariations, getPaletteColor } from './utils'

const Code = mapProps(({ align, ...props }) => ({
  // Map React props to new prop names that will be passed to styled component
  // Useful for aliasing deprecated props
  ...props
}))(
  // Create styled component
  styled.code`
    // Regular old CSS rules
    color: ${getPaletteColor('base')};
    white-space: pre-wrap;
    
    // Use prop to get background color from palette
    ${props =>
      props.bg
        ? `background-color: ${getPaletteColor(props.bg, 'base')(props)};`
        : ''}
    
    // For white label
    ${applyVariations('Code')}

    // Styled system functions
    ${fontSize}
    ${lineHeight}
    ${space}
`
)

Code.displayName = 'Code'

export default Code
