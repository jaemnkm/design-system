const dynamicTitlePlugin = require('./plugins/svg-dynamic-title-plugin')

const replaceSvgPlugin = require('./plugins/svg-replace-plugin')

const template = (
  { template },
  opts,
  { imports, componentName, props, jsx, exports }
) => template.ast`import React from 'react'
import Svg from './Svg'
import styled from 'styled-components'

const BaseComponent = ({
  size,
  title,
  desc,
  titleId,
  descId,
  ...props
}) => (
  ${jsx}
)

const ${componentName} = styled(BaseComponent)\`
  outline: none;
\`

${componentName}.isIcon = true

${componentName}.defaultProps = {
  size: 24,
  tabIndex: -1,
  focusable: false,
  'aria-hidden': true,
  role: 'img'
}

export default ${componentName}`

module.exports = {
  template,
  jsx: {
    babelConfig: {
      plugins: [replaceSvgPlugin, dynamicTitlePlugin]
    }
  },
  svgProps: {
    viewBox: '0 0 24 24',
    height: '{size}',
    width: '{size}',
    fill: 'currentcolor'
  },
  svgoConfig: {
    plugins: {
      removeAttrs: { attrs: '(fill|viewBox)' }
    }
  },
  prettierConfig: {
    semi: false,
    singleQuote: true
  }
}
