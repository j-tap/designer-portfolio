import { useErrorsStore } from '~/stores/errorsStore'

export function display404 (isExist) {
  if (isExist) {
    const errorsStore = useErrorsStore()
    errorsStore.setDisplayContent404(true)
  }
}