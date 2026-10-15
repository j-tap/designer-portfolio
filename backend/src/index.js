'use strict';

const { addBlurhash } = require('./utils/blurhash');
const { createVariants, removeVariants, createAllVariants } = require('./utils/image-variants');
const { grantPublicPermissions } = require('./utils/public-permissions');

module.exports = {
  register({ strapi }) {
    // Колонка blurhash у файлов досталась от плагина strapi-blurhash. Без атрибута в схеме
    // Strapi при запуске удалил бы её вместе с уже посчитанными хешами
    strapi.contentType('plugin::upload.file').attributes.blurhash = {
      type: 'text',
    };
  },

  async bootstrap({ strapi }) {
    // beforeUpdate — для замены файла в медиатеке: тогда в данных приходят новые url и mime
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate: addBlurhash,
      beforeUpdate: addBlurhash,
      // WebP-копии для сайта — в фоне, не задерживая ответ админке
      afterCreate: ({ result }) => { createVariants(result); },
      afterUpdate: ({ result }) => { createVariants(result); },
      afterDelete: ({ result }) => removeVariants(result),
    });

    // Права роли Public — по роутерам API: новый тип доступен сайту без галочек в админке
    await grantPublicPermissions(strapi);

    // Копии для уже загруженных картинок. Первый проход после обновления займёт минуты,
    // сайт тем временем работает: недостающую копию создаст первый же запрос
    setImmediate(() => {
      createAllVariants().catch(error => strapi.log.error(`image variants: ${error.message}`));
    });
  },
};
