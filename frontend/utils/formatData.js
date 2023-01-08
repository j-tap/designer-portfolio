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

export function toWithSpaces (val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function priceFormat (val) {
  return `${toWithSpaces(val)}\xa0₽`
}