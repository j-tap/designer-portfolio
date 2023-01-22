/**
 * Возвращает информацию о размещении элемента в окне просмотра.
 *
 * @property {boolean} isInViewport - полностью или частично во вьюпорте
 * @property {boolean} isPartiallyInViewport — частично во вьюпорте
 * @property {boolean} isInsideViewport — полностью внутри вьюпорта
 * @property {boolean} isAroundViewport — полностью закрывает вьюпорт
 * @property {boolean} isOnEdge — пересекает край вьюпорта
 * @property {boolean} isOnTopEdge — пересекает верхний край
 * @property {boolean} isOnRightEdge — пересекает правый край
 * @property {boolean} isOnBottomEdge - пересекает нижний край
 * @property {boolean} isOnLeftEdge - пересекает левый край
 *
 * @param el Element
 * @return {Object} ViewportInfo
 */
export function getElementViewportInfo (el) {
  const result = {
    isAroundViewport: false,
    isInViewport: false,
    isInsideViewport: false,
    isOnBottomEdge: false,
    isOnEdge: false,
    isOnLeftEdge: false,
    isOnRightEdge: false,
    isOnTopEdge: false,
    isPartiallyInViewport: false,
  };
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const insideX = rect.left >= 0 && rect.left + rect.width <= windowWidth;
  const insideY = rect.top >= 0 && rect.top + rect.height <= windowHeight;

  result.isInsideViewport = insideX && insideY;

  const aroundX = rect.left < 0 && rect.left + rect.width > windowWidth;
  const aroundY = rect.top < 0 && rect.top + rect.height > windowHeight;

  result.isAroundViewport = aroundX && aroundY;

  const onTop = rect.top < 0 && rect.top + rect.height > 0;
  const onRight = rect.left < windowWidth && rect.left + rect.width > windowWidth;
  const onLeft = rect.left < 0 && rect.left + rect.width > 0;
  const onBottom = rect.top < windowHeight && rect.top + rect.height > windowHeight;

  const onY = insideY || aroundY || onTop || onBottom;
  const onX = insideX || aroundX || onLeft || onRight;

  result.isOnTopEdge = onTop && onX;
  result.isOnRightEdge = onRight && onY;
  result.isOnBottomEdge = onBottom && onX;
  result.isOnLeftEdge = onLeft && onY;

  result.isOnEdge = result.isOnLeftEdge || result.isOnRightEdge ||
    result.isOnTopEdge || result.isOnBottomEdge;

  const isInX = insideX || aroundX || result.isOnLeftEdge || result.isOnRightEdge;
  const isInY = insideY || aroundY || result.isOnTopEdge || result.isOnBottomEdge;

  result.isInViewport = isInX && isInY;
  result.isPartiallyInViewport = result.isInViewport && result.isOnEdge;

  return result;
}

/**
 * @param value Any
 * @return {Boolean}
 */
export function isObject (value) {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
  )
}
