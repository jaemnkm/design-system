import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { themeGet } from 'styled-system'
import { css } from 'styled-components'

export const mapProps = map => Component =>
  hoistStatics(props => <Component {...map(props)} />, Component)

// Use this to mark props as deprecated
export const deprecatedPropType = replacement => (
  props,
  propName,
  componentName
) => {
  if (props[propName]) {
    return new Error(
      `The \`${propName}\` prop is deprecated and will be removed in a future release. Please use \`${replacement}\` instead.`
    )
  }
}

export const deprecatedColorValue = () => (props, propName, componentName) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    props.theme &&
    props[propName] &&
    !hasPaletteColor({ color: props[propName], ...props })
  ) {
    return new Error(
      `The color value of \`${props[propName]}\` for \`${componentName}\` is deprecated and will be removed in a future release. Please use a palette color instead.`
    )
  }
}

/**
 * Converts a hex color to rgb
 *
 * @example hexToRgb('#007aff') => 'rgb(0, 122, 255)'
 *
 * @param {string} color The color to transform to rgb
 *
 * @returns {string} The color in rgb
 */
const hexToRgb = color => {
  color = color.substring(1)

  let colors = color.match(new RegExp(`.{1,${color.length / 3}}`, 'g'))

  if (colors) {
    colors = colors
      .map(val => parseInt(val.length === 1 ? val + val : val, 16))
      .join(', ')
  }

  return colors ? `rgb(${colors})` : ''
}

/**
 * Decomposes a color into an array of values
 *
 * @example decomposeColor('#007aff') => [0, 122, 255]
 *
 * @param {string} color The color to decompose
 *
 * @returns {Array} An array of the color values
 */
const decomposeColor = color => {
  if (color.charAt(0) === '#') {
    return decomposeColor(hexToRgb(color))
  }

  return color
    .substring(color.indexOf('(') + 1, color.length - 1)
    .split(',')
    .map(value => parseFloat(value))
}

/**
 * Gets the luminance of a color
 *
 * @example getLuminance('#007aff') => 0.211
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} color The color to get the luminance of
 *
 * @return {Number} The luminance of the color
 */
const getLuminance = color => {
  const [r, g, b] = decomposeColor(color).map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Gets the contrast ratio between two colors
 *
 * @example getContrastRatio('#007aff', '#fff') => 4.016975780478911
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} colorA
 * @param {string} colorB
 *
 * @return {Number} The contrast ratio
 */
const getContrastRatio = (colorA, colorB) => {
  const luminA = getLuminance(colorA)
  const luminB = getLuminance(colorB)
  return (Math.max(luminA, luminB) + 0.05) / (Math.min(luminA, luminB) + 0.05)
}

/**
 * Applies the selected variation style to a styled component.
 * Combines the variation style with any custom styling from
 * theme.componentStyles[component][variation]
 *
 * Once updated to styled-components v4, componentName is no
 * longer needed as it is part of forwardedClass.displayName
 *
 * @param {string}  componentName The name of the component
 * @param {Object=} variations    An object of variation styles
 *
 * @returns {array}
 */
export const applyVariations = (componentName, variations = null) => props => {
  const { color, variation } = props

  if (
    variations &&
    typeof color === 'string' &&
    typeof variation === 'string'
  ) {
    return css`
      ${variations[variation] || ''}
      ${themeGet(`componentStyles.${componentName}.${variation}.${color}`, '')}
    `
  }

  return css`
    ${themeGet(`componentStyles.${componentName}.${color}`, '')}
  `
}

/**
 * Gets the color of a palette shade, using props.color as
 * the palette color. If palette shade does not exist, falls
 * back to theme.colors
 *
 * @example getPaletteColor('dark')(props) => will return the dark
 * shade of theme.palette[props.color].dark
 * @example getPaletteColor('primary.base')(props) => theme.palette.primary.base
 * @example getPaletteColor('primary', 'base')(props) => theme.palette.primary.base
 */
export const getPaletteColor = (...args) => props => {
  let color = args.length === 2 ? args[0] : props.color
  let shade = args.length === 2 ? args[1] : args[0]

  const colorShade = shade.match(/^([a-z]+)\.([a-z]+)$/i)

  if (colorShade) {
    color = colorShade[0]
    shade = colorShade[1]
  }

  return (
    themeGet(`palette.${color}.${shade}`)(props) ||
    themeGet(`palette.${color}`)(props) ||
    themeGet(`colors.${color}`)(props) ||
    color
  )
}

/**
 * Checks if the given color prop is a valid palette color
 *
 * @param {Object} props
 *
 * @returns {boolean}
 */
export const hasPaletteColor = props => {
  return (
    props.theme &&
    props.theme.palette &&
    typeof props.color === 'string' &&
    Object.keys(props.theme.palette).includes(props.color.split('.')[0])
  )
}

/**
 * Gets the text color that belongs on a given background color
 *
 * @param {string} name The name of the background color
 *
 * @returns {string} The text color that belongs on the background
 */
export const getTextColorOn = name => props => {
  const { theme } = props

  if (theme.palette) {
    const color = getPaletteColor(name)(props)
    const text = theme.palette.text

    if (color) {
      return getContrastRatio(text.lightest, color) >= theme.contrastRatio
        ? text.lightest
        : text.base
    }

    return text.base
  }

  return ''
}

const getByPalette = props => css`
  background-color: ${getPaletteColor(props.bg, 'base')(props)};
  color: ${getPaletteColor(props.color, 'base')(props)};
`

/**
 * Extended color function from styled-system. First checks
 * for a palette color before falling back to styled-system
 *
 * @param {Object} props
 *
 * @returns {string|css}
 */
export const color = props => {
  if (!props.theme || (!props.color && !props.bg)) {
    return ''
  } else if (props.color === 'text') {
    return props.color && props.bg
      ? getByPalette(props)
      : css`
          color: ${getPaletteColor('base')(props)};
        `
  } else if (props.color && props.bg) {
    return getByPalette(props)
  } else if (props.color && hasPaletteColor(props)) {
    return css`
      background-color: ${getPaletteColor('base')(props)};
      color: ${getTextColorOn('base')(props)};
    `
  } else if (props.color) {
    return css`
      color: ${getPaletteColor('base')(props)};
    `
  } else {
    return css`
      background-color: ${getPaletteColor(props.bg, 'base')(props)};
    `
  }
}

export const borders = props => {
  const borderColor = props.color
    ? getPaletteColor('base')(props)
    : getPaletteColor('border.base')(props)
  const focusColor = props.color
    ? borderColor
    : getPaletteColor('primary.base')(props)
  return {
    'border-color': borderColor,
    'box-shadow': `0 0 0 1px ${borderColor}`,
    ':focus': {
      outline: 0,
      'border-color': focusColor,
      'box-shadow': `0 0 0 2px ${focusColor}`
    }
  }
}
