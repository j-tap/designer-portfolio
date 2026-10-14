'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { issueFormToken, checkFormToken, hitRateLimit } = require('../utils/antispam');
const { FileError, prepareReviewFiles, removeUploaded } = require('../utils/files');

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

function ids(value) {
  if (!Array.isArray(value)) return [];
  return value.map(Number).filter(id => Number.isInteger(id) && id > 0).slice(0, 20);
}

/**
 * Из формы принимаем только известные поля: остальное (publishedAt, createdBy и т.п.)
 * отбрасываем, чтобы отправитель не мог влиять на модерацию и служебные данные.
 */
function sanitizeReview(data) {
  const rating = Number(data.rating);

  return {
    name: text(data.name, 'name', { required: true }),
    company: text(data.company, 'company', { required: true }),
    link: link(data.link),
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5,
    text: text(data.text, 'text'),
    developments: ids(data.developments),
    cooperations: ids(data.cooperations),
  };
}

// Черновики (отзывы на модерации) наружу не отдаём, даже если в запросе publicationState=preview
function onlyPublished(ctx) {
  ctx.query = { ...ctx.query, publicationState: 'live' };
}

module.exports = createCoreController('api::review.review', () => ({
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

      const review = sanitizeReview(data);
      await prepareReviewFiles(ctx);

      ctx.request.body.data = ctx.is('multipart') ? JSON.stringify(review) : review;
      // populate и прочие параметры от клиента при создании не нужны
      ctx.query = {};

      await super.create(ctx);
      ctx.body = { data: { ok: true } };
    }
    catch (error) {
      if (error instanceof ValidationError || error instanceof FileError) {
        return ctx.badRequest(error.message);
      }
      throw error;
    }
    finally {
      // strapi::body удаляет только файлы медиатеки (ключ files), а временные файлы
      // загрузок в записи (files.<поле>) оставлял бы в /tmp навсегда
      await removeUploaded(ctx);
    }
  },
}));
