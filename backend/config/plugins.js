module.exports = {
  'drag-drop-content-types': {
    enabled: true,
  },

  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        'category-project': {
          field: 'slug',
          references: 'title',
        },
        'subcategory-project': {
          field: 'slug',
          references: 'title',
        },
        'project': {
          field: 'slug',
          references: 'title',
        },
      },
    },
  },

  'transformer': {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      }
    }
  },

  'strapi-plugin-populate-deep': {
    enabled: true,
  },

  'multi-select': {
    enabled: true,
  },

  'strapi-blurhash': {
    enabled: true,
  },

  'relations-select': {
    enabled: true,
    resolve: './src/plugins/relations-select',
  },
}
