'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const MAX_FILES = 10;
// Лимит щедрый: изображения ниже ужимаются до разумного размера
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MAX_IMAGE_SIDE = 2560;

// Тип определяется по содержимому, а не по имени и MIME от клиента: иначе под видом
// картинки можно загрузить HTML или SVG со скриптом, который откроется на нашем домене
const SIGNATURES = [
  { mime: 'image/jpeg', ext: '.jpg', test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', ext: '.png', test: b => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/gif', ext: '.gif', test: b => ['GIF87a', 'GIF89a'].includes(b.toString('latin1', 0, 6)) },
  { mime: 'image/webp', ext: '.webp', test: b => b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP' },
  { mime: 'image/avif', ext: '.avif', test: b => b.toString('latin1', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(b.toString('latin1', 8, 12)) },
  { mime: 'application/pdf', ext: '.pdf', test: b => b.toString('latin1', 0, 5) === '%PDF-' },
];

const RESIZABLE = {
  'image/jpeg': img => img.jpeg({ quality: 82, mozjpeg: true }),
  'image/png': img => img.png({ compressionLevel: 9 }),
  'image/webp': img => img.webp({ quality: 82 }),
  'image/avif': img => img.avif({ quality: 60 }),
};

class FileError extends Error {}

/**
 * formidable отдаёт либо один файл, либо массив — приводим к массиву.
 * Поля файла (formidable 2): filepath, originalFilename, mimetype, size.
 */
function listUploaded(ctx) {
  return Object.values(ctx.request.files || {}).flat().filter(Boolean);
}

async function readHead(filePath) {
  const handle = await fs.open(filePath, 'r');
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(16), 0, 16, 0);
    return buffer.subarray(0, bytesRead);
  }
  finally {
    await handle.close();
  }
}

function safeBaseName(name) {
  const base = path.basename(String(name || 'file'), path.extname(String(name || '')));
  return base.replace(/[^\p{L}\p{N}_ -]+/gu, '_').slice(0, 80) || 'file';
}

/**
 * Перекодирование заодно убирает EXIF (в том числе геолокацию с фото телефона)
 * и обезвреживает файлы-полиглоты, у которых за заголовком картинки спрятано что-то ещё.
 */
async function compressImage(file, type) {
  const output = await RESIZABLE[type.mime](
    sharp(file.filepath)
      .rotate()
      .resize({ width: MAX_IMAGE_SIDE, height: MAX_IMAGE_SIDE, fit: 'inside', withoutEnlargement: true })
  ).toBuffer();

  await fs.writeFile(file.filepath, output);
  file.size = output.length;
}

/**
 * Проверяет и подготавливает файлы отзыва к сохранению. Возвращает их список для загрузки
 * в медиатеку. Бросает FileError с текстом для пользователя.
 */
async function prepareReviewFiles(ctx) {
  const keys = Object.keys(ctx.request.files || {});
  if (keys.some(key => key !== 'files.files')) {
    throw new FileError('Файлы можно прикрепить только к полю files');
  }

  const files = listUploaded(ctx);
  if (files.length > MAX_FILES) {
    throw new FileError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new FileError(`Файл «${file.originalFilename}» больше ${MAX_FILE_SIZE / 1024 / 1024} МБ`);
    }

    const head = await readHead(file.filepath);
    const type = SIGNATURES.find(({ test }) => test(head));
    if (!type) {
      throw new FileError(`Файл «${file.originalFilename}»: поддерживаются только изображения (JPG, PNG, GIF, WebP, AVIF) и PDF`);
    }

    if (RESIZABLE[type.mime]) {
      try {
        await compressImage(file, type);
      }
      catch {
        throw new FileError(`Не удалось обработать изображение «${file.originalFilename}»`);
      }
    }

    // Имя и MIME, с которыми файл сохранится и будет отдаваться, берём из проверенного типа
    file.originalFilename = `${safeBaseName(file.originalFilename)}${type.ext}`;
    file.mimetype = type.mime;
  }

  return files;
}

async function removeUploaded(ctx) {
  await Promise.all(listUploaded(ctx).map(file => fs.rm(file.filepath, { force: true })));
}

module.exports = {
  FileError,
  prepareReviewFiles,
  removeUploaded,
};
