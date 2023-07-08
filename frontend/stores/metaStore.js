import { defineStore } from 'pinia'
import { find } from '~/composables/useApi'

export const useMetaStore = defineStore({
  id: 'metaStore',

  state: () => ({
    title: null,
    description: null,
    keywords: null,
    image: null,
    author: null,
    pay_rate: 0,
  }),

  getters: {
    getMetaInfo: ({ title, description, keywords, image, author, pay_rate }) => ({
      title,
      description,
      keywords,
      image,
      author,
      pay_rate,
    }),
  },

  actions: {
    setMetaInfo (meta) {
      Object.keys(meta).forEach(k => {
        this[k] = meta[k] || null
      })
    },

    setMetaByName (key, value = null) {
      this[key] = value
    },

    async fetchMetaInfo () {
      const metaResp = await find('meta-info')
      const meta = metaResp.data

      if (meta) {
        this.setMetaInfo({
          title: meta.title,
          description: meta.description,
          keywords: meta.keywords,
          image: meta.image.url,
          author: meta.author,
          pay_rate: meta.pay_rate,
        })
      }
    }
  },
})