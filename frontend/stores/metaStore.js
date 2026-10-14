import { defineStore } from 'pinia'
import { find } from '~/composables/useApi'
import { fillExperience } from '~/utils/experience'

export const useMetaStore = defineStore('metaStore', {
  state: () => ({
    title: null,
    description: null,
    keywords: null,
    image: null,
    author: null,
    pay_rate: 0,
    career_start_year: null,
    first_name: null,
    last_name: null,
    specialization: null,
  }),

  getters: {
    getMetaInfo: ({
      title,
      description,
      keywords,
      image,
      author,
      pay_rate,
      career_start_year,
      first_name,
      last_name,
      specialization,
    }) => ({
      title,
      description,
      keywords,
      image,
      author,
      pay_rate,
      career_start_year,
      first_name,
      last_name,
      specialization,
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

    async updateMetaInfo (meta) {
      if (meta) {
        this.setMetaInfo({
          title: meta.title,
          description: fillExperience(meta.description, meta.career_start_year),
          keywords: meta.keywords,
          image: meta.image?.url,
          author: meta.author,
          pay_rate: meta.pay_rate,
          career_start_year: meta.career_start_year,
          first_name: meta.first_name,
          last_name: meta.last_name,
          specialization: meta.specialization,
        })
      }
    }
  },
})