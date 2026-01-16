import { defineStore } from 'pinia'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    displayMobileMenu: false,
  }),

  getters: {
    getDisplayMobileMenu: (state) => state.displayMobileMenu,
  },

  actions: {
    setDisplayMobileMenu (isDisplay = false) {
      this.displayMobileMenu = isDisplay
    },
  },
})