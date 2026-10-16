/**
 * Включены ли аналитика и реклама в этом посещении (см. plugins/tracking-scope.client.js)
 * @returns {import('vue').Ref<boolean>}
 */
export function useTrackingActive () {
  return useState('tracking-active', () => false)
}
