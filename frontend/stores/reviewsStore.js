import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const id = 'reviewsStore'
const key = 'canSendReview'
const canSendReview = useStorage(key, true)

export const useReviewsStore = defineStore({
  id,

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
