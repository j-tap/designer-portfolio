/**
 *
 * @param hex {string|null}
 * @returns {number[]|null}
 */
export function hexToHsl (hex = null) {
  if (hex) {
    const rgb = hexToRgb(hex)
    return rgbToHsl(rgb)
  }

  return null
}

/**
 * RGB color to HSL color
 * @param {[r, g, b]}
 * @returns {(number|number)[]}
 */
export function rgbToHsl ([r, g, b]) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}

/**
 * HEX color to RGB color
 * @param hex {string|null}
 * @returns {number[]|null}
 */
export function hexToRgb (hex = null) {
  if (hex) {
    let s = hex.toString()
    s = s.replace('#', '')

    if (s.length !== 6) {
      s = s.split('').map(t =>  t + t).join('')
    }

    const hexArr = s.match(/.{1,2}/g)

    return [
      parseInt(hexArr[0], 16),
      parseInt(hexArr[1], 16),
      parseInt(hexArr[2], 16),
    ]
  }

  return null
}

/**
 * RGB color to number luminance value
 * @param {[r, g, b]}
 * @returns {number}
 */
export function rgbToLuminance ([r, g, b]) {
  return Math.sqrt(.299 * r * r + .587 * g * g + .114 * b * b)
}

/**
 *
 * @param {[r, g, b]}
 * @returns {number}
 */
export function rgbToLightness ([r, g, b]) {
  return 1 / 2 * (Math.max(r, g, b) + Math.min(r, g, b))
}

/**
 *
 * @param {[r, g, b]}
 * @returns {number}
 */
export function rgbToSaturation ([r, g, b]) {
  const L = rgbToLightness([r, g, b])
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  return (L === 0 || L === 1) ? 0 : (max - min)/(1 - Math.abs(2 * L - 1))
}

/**
 *
 * @param {[r, g, b]}
 * @returns {number}
 */
export function rgbToHue ([r, g, b]) {
  return Math.round(
    Math.atan2(
      Math.sqrt(3) * (g - b),
      2 * r - g - b,
    ) * 180 / Math.PI
  )
}

/**
 *
 * @param {[r, g, b]}
 * @returns {number}
 */
export function colorDistance ([r, g, b]) {
  const balance = [10, 0, 0.01]
  const hsl = rgbToHsl([r, g, b])
  let result = 0

  for (let i = 0; i < hsl.length; i++) {
    result += hsl[i] * balance[i]
  }

  return result
}
