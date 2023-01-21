export function sizeToPx ({ width, height }) {
  return {
    width: `${width}px`,
    height: `${height}px`,
  }
}

export function getSizeFromProps ({ width, height }) {
  return {
    width: width,
    height: height,
  }
}