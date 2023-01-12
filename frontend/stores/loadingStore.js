import { defineStore } from 'pinia'

export const useLoadingStore = defineStore({
  id: 'loadingStore',
  state: () => ({
    isLoading: false,
    countLoading: 0,
  }),
  getters: {
    getIsLoading: (state) => state.isLoading,
    getCountLoading: (state) => state.countLoading,
  },
  actions: {
    updateLoading (is = true) {
      if (is) {
        this.countLoading += 1
      } else {
        this.countLoading = Math.max(this.countLoading - 1, 0)
      }
      this.isLoading = this.countLoading > 0
    },
    resetLoading () {
      this.countLoading = 0
      this.isLoading = false
    }
  },
})