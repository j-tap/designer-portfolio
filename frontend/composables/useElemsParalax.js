import { getElementViewportInfo } from '~/utils/check'

export const elems = ref([])
export const elemsStart = ref([])
export function updateProjectsPrlx (list, scrl = 0) {
  if (window !== undefined) {
    list.forEach((o, ind) => {
      const el = elems.value[ind]
      const { isInViewport } = getElementViewportInfo(el)

      if (isInViewport) {
        if (!elemsStart.value[ind]) {
          elemsStart.value[ind] = scrl
        }

        let k = 0

        if (ind > 0) {
          if (ind === 2 || ind % 9 === 0) {
            k = 9
          } else if (ind === 4 || ind % 11 === 0) {
            k = 11
          } else if (ind === 5 || ind % 12 === 0) {
            k = 7
          } else if (ind === 6 || ind % 13 === 0) {
            k = 9
          }
        }

        if (k) {
          const scrlStart = elemsStart.value[ind]
          const y = (scrl - scrlStart) / k
          el.style.transform = `translateY(${y}px)`
        }
      }
    })
  }
}