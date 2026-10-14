import { useEventListener, useMediaQuery } from '@vueuse/core'

const MAX_OFFSET = 80

// Какие элементы списка смещаются и насколько: 0 — элемент стоит на месте
function parallaxFactor (index) {
  if (index <= 0) return 0
  if (index === 2 || index % 9 === 0) return 9
  if (index === 4 || index % 11 === 0) return 11
  if (index === 5 || index % 12 === 0) return 7
  if (index === 6 || index % 13 === 0) return 9
  return 0
}

/**
 * Параллакс списка (проекты, посты): часть элементов при прокрутке слегка смещается по вертикали.
 * Только на широких экранах. `items` — template ref массива элементов из v-for; номер элемента
 * берётся из data-index, потому что порядок в массиве ref Vue не гарантирует.
 */
export function useParallax (items, { minWidth = 768 } = {}) {
  const enabled = useMediaQuery(`(min-width: ${minWidth}px)`)
  let frame = null

  function update () {
    frame = null
    const viewportHeight = window.innerHeight

    for (const el of items.value || []) {
      const factor = enabled.value ? parallaxFactor(Number(el.dataset.index)) : 0
      const rect = el.getBoundingClientRect()

      if (!factor || rect.bottom < 0 || rect.top > viewportHeight) {
        el.style.transform = ''
        continue
      }

      const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight
      const y = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, -centerOffset * MAX_OFFSET / (factor / 10)))
      el.style.transform = `translateY(${y}px)`
    }
  }

  function schedule () {
    frame ??= requestAnimationFrame(update)
  }

  useEventListener('scroll', schedule, { passive: true })
  watch([enabled, () => items.value?.length], schedule, { flush: 'post' })
  onMounted(schedule)
  onScopeDispose(() => frame && cancelAnimationFrame(frame))
}
