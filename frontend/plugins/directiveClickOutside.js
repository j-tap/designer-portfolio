const name = 'click-outside'
const onClickOutside = (elem, callback) => {
  document.addEventListener('mouseup', (evt) => {
    if (elem.value?.contains(evt.target)) {
      return
    }
    callback()
  })
}

const directive = {
  beforeMount (el, binding) {
    onClickOutside(el, () => {
      binding.value()
    });
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  beforeUnmount (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive(name, directive)
})