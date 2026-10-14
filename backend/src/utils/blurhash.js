'use strict';

const path = require('path');
const sharp = require('sharp');
const { encode } = require('blurhash');

/**
 * Blurhash картинок медиатеки — по нему фронтенд рисует размытое превью, пока грузится
 * картинка (components/common/BlurHash). Раньше его считал плагин strapi-blurhash; его версия
 * для Strapi 5 тянет нативный canvas и скачивает файл по HTTP, а здесь файл читается с диска
 * и уменьшается через sharp, который Strapi и так использует для превью.
 */

// Для кодирования хватает крошечной копии: blurhash хранит лишь несколько цветовых компонент
const SAMPLE_SIDE = 32;
const COMPONENTS = 4;

async function blurhashOf(filePath) {
  const { data, info } = await sharp(filePath)
    .rotate()
    .resize(SAMPLE_SIDE, SAMPLE_SIDE, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, COMPONENTS, COMPONENTS);
}

/**
 * Дописывает blurhash в данные файла перед сохранением. Файл к этому моменту уже лежит
 * в public/uploads (локальный провайдер загрузки). Ошибка не мешает загрузке: картинка
 * просто останется без размытого превью.
 */
async function addBlurhash(event) {
  const { data } = event.params;
  if (!data?.url || !data.mime?.startsWith('image/') || data.mime === 'image/svg+xml') return;
  // Файл на внешнем хранилище: читать нечего
  if (!data.url.startsWith('/')) return;

  try {
    data.blurhash = await blurhashOf(path.join(strapi.dirs.static.public, data.url));
  }
  catch (error) {
    strapi.log.warn(`blurhash: ${data.url}: ${error.message}`);
  }
}

module.exports = {
  addBlurhash,
};
