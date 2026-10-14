/* Number to string with spaces */
export function toWithSpaces (val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function priceFormat (val) {
  return `${toWithSpaces(val)}\xa0$`
}

export function kebabToPascalCase (str = '') {
  return (str.match(/[a-zA-Z0-9]+/g) || [])
    .map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join('')
}

export function stringToKey (str = '') {
  return str.toString().trim().toLowerCase().replace(/\s+/g, '_')
}
