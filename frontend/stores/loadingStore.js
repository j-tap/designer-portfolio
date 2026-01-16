import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loadingStore', {
  state: () => ({
    isLoading: false,
    countLoading: 0,
  }),
  getters: {
    getIsLoading: (state) => state.isLoading,
    getCountLoading: (state) => state.countLoading,
  },
  actions: {
    setCountLoading (value) {
      this.countLoading = value
    },
    setIsLoading (value) {
      this.isLoading = value
    },

    updateLoading (is = true) {
      const cnt = this.countLoading
      const newCnt = is ? cnt + 1 : Math.max(cnt - 1, 0)

      this.setCountLoading(newCnt)
      this.setIsLoading(!!this.countLoading > 0)
    },
    resetLoading () {
      this.countLoading = 0
      this.isLoading = false
    }
  },
})