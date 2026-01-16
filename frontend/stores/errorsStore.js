import { defineStore } from 'pinia'

export const useErrorsStore = defineStore('errorsStore', {
  state: () => ({
    displayContent404: false,
  }),

  getters: {
    getDisplayContent404: (state) => state.displayContent404,
  },

  actions: {
    setDisplayContent404 (isDisplay = false) {
      this.displayContent404 = isDisplay
    },
  },
})