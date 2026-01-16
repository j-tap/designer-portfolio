import { isRef, unref, watch, onMounted, onBeforeUnmount } from 'vue'

export function useEventListener (target, event, handler){
    if (isRef(target)) {
        watch(target, (value, oldValue) => {
            oldValue?.removeEventListener(event, handler)
            value?.addEventListener(event, handler)
        }, { immediate: true })
    }
    else {
        onMounted(() => {
            target.addEventListener(event, handler)
        })
    }

    onBeforeUnmount(() => {
        unref(target)?.removeEventListener(event, handler)
    })
}
