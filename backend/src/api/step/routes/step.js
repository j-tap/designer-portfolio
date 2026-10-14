'use strict';

/**
 * step router. Открыты только действия, которые вызывает сайт: остальные
 * (update, delete…) не откроет даже случайная галочка в правах роли Public
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::step.step', {
  only: ['find', 'findOne'],
});
