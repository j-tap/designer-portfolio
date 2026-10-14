'use strict';

const fs = require('fs/promises');

/**
 * Удаляет временные файлы multipart-запроса, когда запрос обработан.
 *
 * strapi::body сохраняет в /tmp файлы любого запроса, ещё до проверки маршрута и прав, а удаляет
 * потом только поле `files`. Файл под другим именем (`files.files` формы отзывов или любое поле
 * в запросе бота на закрытый адрес) оставался на диске навсегда — анонимными запросами можно было
 * заполнить диск сервера (в проде /tmp смонтирован в backend/tmp, docker-compose.prod.yml).
 *
 * Стоит в списке сразу после strapi::body: файлы уже разобраны, а удаляются после маршрута,
 * но до того, как strapi::body уберёт список файлов из запроса.
 */
module.exports = () => async (ctx, next) => {
  try {
    await next();
  }
  finally {
    const files = Object.values(ctx.request.files || {}).flat().filter(Boolean);
    await Promise.all(files.map(file => fs.rm(file.filepath, { force: true })));
  }
};
