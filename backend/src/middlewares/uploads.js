'use strict';

const fs = require('fs');
const { parseVariantPath, ensureVariant } = require('../utils/image-variants');

/**
 * Отдача файлов медиатеки (/uploads/…).
 *
 * - /uploads/_w<ширина>/<файл>.webp — уменьшенная WebP-копия картинки (utils/image-variants.js),
 *   создаётся при первом запросе. Фронтенд добавляет к адресу версию файла (?v=…), поэтому
 *   браузер хранит копию год и не перепроверяет.
 * - Остальные файлы отдаёт Strapi (плагин upload, срок кеша — config/plugins.js). Здесь к ним
 *   добавлен ответ 304: сам Strapi на If-Modified-Since каждый раз присылал файл целиком.
 */

const VARIANT_CACHE = 'public, max-age=31536000, immutable';

function notModified(ctx) {
  if (ctx.status !== 200 || !ctx.fresh) return;
  // Файл уже открыт для отправки — закрываем, иначе дескриптор останется висеть
  ctx.body?.destroy?.();
  ctx.status = 304;
  ctx.body = null;
}

async function serveVariant(ctx, { name, width }) {
  let file;
  try {
    file = await ensureVariant(name, width);
  }
  catch (error) {
    strapi.log.error(`image variants: ${name} (${width}): ${error.message}`);
    ctx.status = 500;
    return;
  }
  if (!file) {
    ctx.status = 404;
    return;
  }

  const stat = await fs.promises.stat(file);
  ctx.status = 200;
  ctx.type = 'image/webp';
  ctx.lastModified = stat.mtime;
  ctx.set('Cache-Control', VARIANT_CACHE);
  if (ctx.fresh) {
    ctx.status = 304;
    return;
  }
  ctx.length = stat.size;
  ctx.body = fs.createReadStream(file);
}

module.exports = () => async (ctx, next) => {
  if ((ctx.method !== 'GET' && ctx.method !== 'HEAD') || !ctx.path.startsWith('/uploads/')) {
    return next();
  }

  const variant = parseVariantPath(ctx.path);
  if (variant) return serveVariant(ctx, variant);

  await next();
  notModified(ctx);
};
