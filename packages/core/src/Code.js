import styled from 'styled-components'

import { fontSize, lineHeight, space } from 'styled-system'
import { mapProps, applyVariations, getPaletteColor } from './utils'

const Code = mapProps(({ align, ...props }) => ({
  ...props
}))(styled.code`
  color: ${getPaletteColor('base')};
  ${props =>
    props.bg
      ? `background-color: ${getPaletteColor(props.bg, 'base')(props)};`
      : ''}
  ${applyVariations('Code')}
  ${fontSize}
  ${lineHeight}
  ${space}
  white-space: pre-wrap;
`)

Code.displayName = 'Code'

export default Code
