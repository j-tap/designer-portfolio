import { getElementViewportInfo } from '~/utils/check'

export const elems = ref([])

const MAX_OFFSET = 80

export function resetParalax () {
  elems.value = []
}

export function initPositions () {}

function getParallaxFactor (ind) {
  if (ind <= 0) return 0
  if (ind === 2 || ind % 9 === 0) return 9
  if (ind === 4 || ind % 11 === 0) return 11
  if (ind === 5 || ind % 12 === 0) return 7
  if (ind === 6 || ind % 13 === 0) return 9
  return 0
}

export function updateProjectsPrlx (list, scrl = 0) {
  if (!process.client) return

  const viewportHeight = window.innerHeight

  list.forEach((o, ind) => {
    const el = elems.value[ind]
    if (!el) return
    
    const { isInViewport } = getElementViewportInfo(el)
    if (!isInViewport) {
      el.style.transform = ''
      return
    }

    const k = getParallaxFactor(ind)
    if (!k) return

    const rect = el.getBoundingClientRect()
    const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight
    const y = -centerOffset * MAX_OFFSET / (k / 10)
    const clampedY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y))
    
    el.style.transform = `translateY(${clampedY}px)`
  })
}
