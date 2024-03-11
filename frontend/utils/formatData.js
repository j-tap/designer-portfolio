export function strToNumHash (str) {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

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

export function splitArrayHalf (arr = []) {
  const middleIndex = Math.ceil(arr.length / 2)
  const firstHalf = arr.slice(0, middleIndex)
  const secondHalf = arr.slice(middleIndex)
  return [firstHalf, secondHalf]
}