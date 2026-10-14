'use strict';

const { addBlurhash } = require('./utils/blurhash');

module.exports = {
  register({ strapi }) {
    // Колонка blurhash у файлов досталась от плагина strapi-blurhash. Без атрибута в схеме
    // Strapi при запуске удалил бы её вместе с уже посчитанными хешами
    strapi.contentType('plugin::upload.file').attributes.blurhash = {
      type: 'text',
    };
  },

  bootstrap({ strapi }) {
    // beforeUpdate — для замены файла в медиатеке: тогда в данных приходят новые url и mime
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate: addBlurhash,
      beforeUpdate: addBlurhash,
    });
  },
};
