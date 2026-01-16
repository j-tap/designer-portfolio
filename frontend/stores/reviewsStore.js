import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const key = 'canSendReview'
const canSendReview = useStorage(key, true)

export const useReviewsStore = defineStore('reviewsStore', {
  state: () => ({
    canSendReview: ref(true),
  }),

  getters: {
    getCanSendReview: () => canSendReview.value,
  },

  actions: {
    setCanSendReview(can = true) {
      canSendReview.value = can
    },
  },
})
