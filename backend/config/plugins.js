module.exports = ({ env }) => ({
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

  email: {
    config: {
      provider: 'strapi-provider-email-smtp',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        secure: true,
        username: env('SMTP_USERNAME'),
        password: env('SMTP_PASSWORD'),
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 1,
      },
      settings: {
        defaultFrom: `Diana UI/UX <noreply@${env('SMTP_FROM')}>`,
        defaultReplyTo: `Diana UI/UX <noreply@${env('SMTP_FROM')}>`,
      },
    },
  },
});
