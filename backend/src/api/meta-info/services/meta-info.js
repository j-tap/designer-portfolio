'use strict';

/**
 * meta-info service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::meta-info.meta-info');
