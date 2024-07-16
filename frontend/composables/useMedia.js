import { ref } from 'vue'
import { useEventListener } from './useEventListener'

const sizes = {
    sm: (v) => v < 768,
    'md-down': (v) => v < 1024,
    md: (v) => v < 1024 && v >= 768,
    'md-up': (v) => v >= 768,
    lg: (v) => v >= 1024,
}

export function useMedia (size) {
    if (window !== undefined) {
        const result = ref(sizes[size](window.outerWidth))

        useEventListener(window, 'resize', () => {
            result.value = sizes[size](window.outerWidth)
        })

        return result
    }

    return ref(false)
}
