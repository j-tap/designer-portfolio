'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
// Ошибки Strapi: обработчик ошибок сам отвечает 400 (ValidationError) или 429 (RateLimitError)
// с текстом в error.message — его и показывает форма на сайте
const { errors: { ValidationError, RateLimitError } } = require('@strapi/utils');
const { createAntispam } = require('../../../utils/antispam');
const { prepareReviewFiles } = require('../utils/files');
const { notifyNewReview } = require('../utils/notify');

const UID = 'api::review.review';
const { issueFormToken, checkFormToken, hitRateLimit } = createAntispam('review-form');
const SUCCESS = { data: { ok: true } };

const LIMITS = {
  name: 100,
  company: 150,
  link: 500,
  text: 5000,
};

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

  // Схема — только «что-то://»: иначе company.ru:8080 принимается за схему company.ru
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
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
function rating(value) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < 1 || result > 5) throw new ValidationError('Оценка должна быть от 1 до 5');
  return result;
}

async function sanitizeReview(data) {
  const locale = await resolveLocale(data.locale);

  const review = {
    name: text(data.name, 'name', { required: true }),
    company: text(data.company, 'company', { required: true }),
    link: link(data.link),
    rating: rating(data.rating),
    text: text(data.text, 'text'),
    developments: { connect: await relation('api::reviews-development.reviews-development', data.developments, locale) },
    cooperations: { connect: await relation('api::reviews-cooperation.reviews-cooperation', data.cooperations, locale) },
  };

  return { review, locale };
}

/**
 * Файлы попадают в медиатеку, в папку «API Uploads» — туда же их клал Strapi 4, когда
 * файлы прикреплялись прямо к создаваемой записи (в Strapi 5 так больше нельзя).
 */
async function uploadFiles(files) {
  if (!files.length) return [];

  const folder = await strapi.plugin('upload').service('api-upload-folder').getAPIUploadFolder();
  return strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: files.map(() => ({ folder: folder.id })) },
    files,
  });
}

async function removeFiles(files) {
  await Promise.all(files.map(file => strapi.plugin('upload').service('upload').remove(file)));
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

  // Временные файлы запроса удаляет middleware cleanup-uploads
  async create(ctx) {
    const data = readData(ctx);

    // Скрытое поле: человек его не видит и не заполняет, а боты заполняют все поля подряд.
    // Отвечаем так же, как на успех, чтобы бот не понял, что его отсеяли
    if (data.website) {
      ctx.body = SUCCESS;
      return;
    }

    if (!checkFormToken(data.formToken)) {
      throw new ValidationError('Форма устарела, обновите страницу и попробуйте ещё раз');
    }

    const { review, locale } = await sanitizeReview(data);

    // Попытку засчитываем только за заполненную форму (исправление опечаток лимит не тратит),
    // но до обработки файлов: перекодирование картинок — самая тяжёлая часть запроса
    if (hitRateLimit(ctx.request.ip)) {
      throw new RateLimitError('Слишком много отзывов, попробуйте позже');
    }

    const uploaded = await uploadFiles(await prepareReviewFiles(ctx));

    try {
      // Без status документ создаётся черновиком и ждёт модерации в админке
      const document = await strapi.documents(UID).create({
        // Отзыв сохраняется на языке автора, переводы на другие языки добавляет админ
        locale,
        data: { ...review, files: uploaded.map(({ id }) => id) },
      });

      // Не ждём SMTP: письмо не должно задерживать ответ, а его ошибки notifyNewReview логирует сама
      notifyNewReview(document);
    }
    catch (error) {
      // Отзыв не сохранился — его файлы в медиатеке ни к чему не привязаны
      await removeFiles(uploaded);
      throw error;
    }

    ctx.body = SUCCESS;
  },
}));
