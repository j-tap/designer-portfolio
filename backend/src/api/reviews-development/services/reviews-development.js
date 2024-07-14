'use strict';

/**
 * reviews-development service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reviews-development.reviews-development');
