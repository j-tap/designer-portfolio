'use strict';

/**
 * contact-request router. Сайт только создаёт обращения; читать их можно лишь в админке
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact-request.contact-request', {
  only: ['create'],
});
