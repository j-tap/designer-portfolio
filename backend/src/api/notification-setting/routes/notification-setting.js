'use strict';

/**
 * Адреса для уведомлений — только в админке. Ни одного маршрута API: роль Public получает права
 * по роутерам (src/utils/public-permissions.js), и адреса не должны стать доступны сайту и всем
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::notification-setting.notification-setting', {
  only: [],
});
