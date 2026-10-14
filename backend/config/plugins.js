const { mailFrom } = require('../src/utils/urls');

module.exports = ({ env }) => {
  const smtpPort = env.int('SMTP_PORT', 465);

  return {
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
        port: smtpPort,
        // 465 — TLS сразу при подключении; 587 и другие — обычное подключение,
        // которое requireTLS обязывает перевести в TLS через STARTTLS
        secure: smtpPort === 465,
        username: env('SMTP_USERNAME'),
        password: env('SMTP_PASSWORD'),
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 1,
      },
      settings: {
        defaultFrom: mailFrom(),
        defaultReplyTo: mailFrom(),
      },
    },
  },
};
};
