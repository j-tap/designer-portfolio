'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

/**
 * Уменьшенные WebP-копии картинок медиатеки для srcset на сайте.
 *
 * Форматы Strapi (large/medium/small) вписывают картинку в квадрат: длинный скриншот страницы
 * 1920×9036 в large становится 213×1000, на сайте он бесполезен. Здесь копии уменьшаются
 * только по ширине. Копия лежит рядом с оригиналами — public/uploads/_w<ширина>/<файл>.webp —
 * и создаётся при первом запросе (middlewares/uploads.js) или заранее, после запуска и загрузки.
 *
 * Ширины и правило выбора совпадают с фронтендом (frontend/composables/useApi.js, useMedia):
 * все ширины меньше ширины оригинала и одна — первая не меньше её, копия в размер оригинала.
 */

const WIDTHS = [480, 800, 1280, 1920];
const MIMES = new Set(['image/jpeg', 'image/png']);
const SOURCE_EXT = /\.(jpe?g|png)$/i;
const VARIANT_PATH = /^\/uploads\/_w(\d+)\/([^/]+)\.webp$/;

// Длинный скриншот при раскодировании занимает в памяти десятки мегабайт: одновременно — не больше двух
const MAX_JOBS = 2;

function uploadsDir() {
  return path.join(strapi.dirs.static.public, 'uploads');
}

function variantWidths(width) {
  if (!width) return [];
  const index = WIDTHS.findIndex(w => w >= width);
  return index === -1 ? WIDTHS : WIDTHS.slice(0, index + 1);
}

/**
 * Ширина и имя оригинала по адресу копии; null — адрес не копии или ширина не из списка.
 */
function parseVariantPath(urlPath) {
  const match = VARIANT_PATH.exec(urlPath);
  if (!match) return null;

  const width = Number(match[1]);
  let name;
  try {
    name = decodeURIComponent(match[2]);
  }
  catch {
    return null;
  }

  if (!WIDTHS.includes(width) || name.startsWith('.') || name !== path.basename(name) || !SOURCE_EXT.test(name)) {
    return null;
  }
  return { width, name };
}

function variantFile(name, width) {
  return path.join(uploadsDir(), `_w${width}`, `${name}.webp`);
}

let running = 0;
const queue = [];

async function limited(job) {
  if (running < MAX_JOBS) running += 1;
  // Место освободится — его передадут из finally, счётчик при этом не меняется
  else await new Promise(resolve => queue.push(resolve));

  try {
    return await job();
  }
  finally {
    const next = queue.shift();
    if (next) next();
    else running -= 1;
  }
}

async function render(source, target, width) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  // Пишем во временный файл и переименовываем: недописанную копию никто не отдаст
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  try {
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      // smartSubsample — меньше цветных ореолов вокруг мелкого текста на скриншотах
      .webp({ quality: 82, smartSubsample: true })
      .toFile(temp);
    await fs.rename(temp, target);
  }
  catch (error) {
    await fs.rm(temp, { force: true });
    throw error;
  }
}

const pending = new Map();

/**
 * Путь к готовой копии: существующей или только что созданной. Копия старше оригинала
 * (файл заменили в медиатеке — Strapi оставляет ему прежнее имя) создаётся заново.
 * null — оригинала нет.
 */
async function ensureVariant(name, width) {
  const source = path.join(uploadsDir(), name);
  const target = variantFile(name, width);

  const sourceStat = await fs.stat(source).catch(() => null);
  if (!sourceStat) return null;

  const targetStat = await fs.stat(target).catch(() => null);
  if (targetStat && targetStat.mtimeMs >= sourceStat.mtimeMs) return target;

  // Одну и ту же копию запросили несколько раз, пока она создаётся
  if (!pending.has(target)) {
    const job = limited(() => render(source, target, width)).finally(() => pending.delete(target));
    pending.set(target, job);
  }
  await pending.get(target);
  return target;
}

/**
 * Имя файла на диске по записи медиатеки; null — для файла копии не делаются.
 */
function fileName(file) {
  if (!MIMES.has(file?.mime) || !file.url?.startsWith('/uploads/')) return null;
  const name = file.url.slice('/uploads/'.length);
  return SOURCE_EXT.test(name) && name === path.basename(name) ? name : null;
}

async function createVariants(file) {
  const name = fileName(file);
  if (!name) return;

  for (const width of variantWidths(file.width)) {
    try {
      await ensureVariant(name, width);
    }
    catch (error) {
      strapi.log.warn(`image variants: ${name} (${width}): ${error.message}`);
    }
  }
}

async function removeVariants(file) {
  const name = fileName(file);
  if (!name) return;
  await Promise.all(WIDTHS.map(width => fs.rm(variantFile(name, width), { force: true })));
}

/**
 * Копии всех картинок медиатеки по очереди — после запуска, в фоне. Готовые копии
 * пропускаются, так что после первого прохода это лишь проверка файлов.
 */
async function createAllVariants() {
  // Недописанные копии: Strapi остановили, пока sharp писал файл
  for (const width of WIDTHS) {
    const dir = path.join(uploadsDir(), `_w${width}`);
    const names = await fs.readdir(dir).catch(() => []);
    await Promise.all(names.filter(name => name.endsWith('.tmp')).map(name => fs.rm(path.join(dir, name), { force: true })));
  }

  const files = await strapi.db.query('plugin::upload.file').findMany({
    select: ['url', 'mime', 'width'],
    where: { mime: { $in: [...MIMES] } },
  });

  for (const file of files) {
    await createVariants(file);
  }
  strapi.log.info(`image variants: checked ${files.length} images`);
}

module.exports = {
  parseVariantPath,
  ensureVariant,
  createVariants,
  removeVariants,
  createAllVariants,
};
