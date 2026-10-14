'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { issueFormToken, checkFormToken, hitRateLimit } = require('../utils/antispam');
const { FileError, prepareReviewFiles, removeUploaded } = require('../utils/files');
const { notifyNewReview } = require('../utils/notify');

const UID = 'api::review.review';

const LIMITS = {
  name: 100,
  company: 150,
  link: 500,
  text: 5000,
};

class ValidationError extends Error {}

function readData(ctx) {
  const { data } = ctx.request.body || {};
  if (ctx.is('multipart')) {
    try {
      return JSON.parse(data || '{}');
    }
    catch {
      throw new ValidationError('Некорректные данные формы');
    }
  }
  return data || {};
}

function text(value, field, { required = false } = {}) {
  const result = typeof value === 'string' ? value.trim() : '';
  if (required && !result) throw new ValidationError(`Поле ${field} обязательно`);
  if (result.length > LIMITS[field]) throw new ValidationError(`Поле ${field} длиннее ${LIMITS[field]} символов`);
  return result || null;
}

/**
 * Ссылка выводится на сайте в href, поэтому сохраняем только http(s).
 * Адрес без схемы (company.ru) дополняем https://.
 */
function link(value) {
  const raw = text(value, 'link');
  if (!raw) return null;

  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (['http:', 'https:'].includes(url.protocol)) return url.href;
  }
  catch {}

  throw new ValidationError('Ссылка должна начинаться с http:// или https://');
}

async function resolveLocale(value) {
  const locales = strapi.plugin('i18n').service('locales');
  const codes = (await locales.find()).map(({ code }) => code);
  return codes.includes(value) ? value : locales.getDefaultLocale();
}

/**
 * Направления разработки и сотрудничества приходят как documentId записей на языке страницы.
 * Отзыв не локализован, поэтому связь указывает на конкретную языковую версию — ту, что
 * видел автор. Несуществующие id отбрасываются, а не роняют сохранение.
 */
async function relation(uid, value, locale) {
  if (!Array.isArray(value)) return [];

  const documentIds = value
    .filter(id => typeof id === 'string' && /^[a-z0-9]{1,64}$/.test(id))
    .slice(0, 20);
  if (!documentIds.length) return [];

  const found = await strapi.documents(uid).findMany({
    filters: { documentId: { $in: documentIds } },
    fields: ['documentId'],
    locale,
  });

  return found.map(({ documentId }) => ({ documentId, locale }));
}

/**
 * Из формы принимаем только известные поля: остальное (publishedAt, createdBy и т.п.)
 * отбрасываем, чтобы отправитель не мог влиять на модерацию и служебные данные.
 */
async function sanitizeReview(data) {
  const rating = Number(data.rating);
  const locale = await resolveLocale(data.locale);

  return {
    name: text(data.name, 'name', { required: true }),
    company: text(data.company, 'company', { required: true }),
    link: link(data.link),
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5,
    text: text(data.text, 'text'),
    developments: { connect: await relation('api::reviews-development.reviews-development', data.developments, locale) },
    cooperations: { connect: await relation('api::reviews-cooperation.reviews-cooperation', data.cooperations, locale) },
  };
}

/**
 * Файлы попадают в медиатеку, в папку «API Uploads» — туда же их клал Strapi 4, когда
 * файлы прикреплялись прямо к создаваемой записи (в Strapi 5 так больше нельзя).
 */
async function uploadFiles(files) {
  if (!files.length) return [];

  const folder = await strapi.plugin('upload').service('api-upload-folder').getAPIUploadFolder();
  const uploaded = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: files.map(() => ({ folder: folder.id })) },
    files,
  });

  return uploaded.map(({ id }) => id);
}

// Черновики (отзывы на модерации) наружу не отдаём, даже если в запросе status=draft
function onlyPublished(ctx) {
  ctx.query = { ...ctx.query, status: 'published' };
}

module.exports = createCoreController(UID, () => ({
  async find(ctx) {
    onlyPublished(ctx);
    return super.find(ctx);
  },

  async findOne(ctx) {
    onlyPublished(ctx);
    return super.findOne(ctx);
  },

  async formToken(ctx) {
    ctx.set('Cache-Control', 'no-store');
    ctx.body = { token: issueFormToken() };
  },

  async create(ctx) {
    try {
      const data = readData(ctx);

      // Скрытое поле: человек его не видит и не заполняет, а боты заполняют все поля подряд.
      // Отвечаем как на успех, чтобы бот не понял, что его отсеяли
      if (data.website) {
        ctx.status = 200;
        ctx.body = { data: null };
        return;
      }

      if (!checkFormToken(data.formToken)) {
        return ctx.badRequest('Форма устарела, обновите страницу и попробуйте ещё раз');
      }

      if (hitRateLimit(ctx.request.ip)) {
        return ctx.tooManyRequests('Слишком много отзывов, попробуйте позже');
      }

      const review = await sanitizeReview(data);
      const files = await uploadFiles(await prepareReviewFiles(ctx));

      // Без status документ создаётся черновиком и ждёт модерации в админке
      const document = await strapi.documents(UID).create({
        data: { ...review, files },
      });

      await notifyNewReview(document);
      ctx.body = { data: { ok: true } };
    }
    catch (error) {
      if (error instanceof ValidationError || error instanceof FileError) {
        return ctx.badRequest(error.message);
      }
      throw error;
    }
    finally {
      // Временные файлы formidable в /tmp сами не удаляются
      await removeUploaded(ctx);
    }
  },
}));
