'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
// Ошибки Strapi: обработчик ошибок сам отвечает 400 (ValidationError) или 429 (RateLimitError)
// с текстом в error.message — его и показывает форма на сайте
const { errors: { ValidationError, RateLimitError } } = require('@strapi/utils');
const { createAntispam } = require('../../../utils/antispam');
const { notifyNewContactRequest } = require('../utils/notify');

const UID = 'api::contact-request.contact-request';
const SUCCESS = { data: { ok: true } };

const { issueFormToken, checkFormToken, hitRateLimit } = createAntispam('contact-form', { perIp: 3, total: 30 });

const LIMITS = {
  name: 100,
  email: 200,
  message: 5000,
  page: 500,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, field, { required = false } = {}) {
  const result = typeof value === 'string' ? value.trim() : '';
  if (required && !result) throw new ValidationError(`Поле ${field} обязательно`);
  if (result.length > LIMITS[field]) throw new ValidationError(`Поле ${field} длиннее ${LIMITS[field]} символов`);
  return result || null;
}

function email(value) {
  const result = text(value, 'email', { required: true });
  if (!EMAIL_RE.test(result)) throw new ValidationError('Некорректный адрес электронной почты');
  return result;
}

module.exports = createCoreController(UID, () => ({
  async formToken(ctx) {
    ctx.set('Cache-Control', 'no-store');
    ctx.body = { token: issueFormToken() };
  },

  async create(ctx) {
    const { data = {} } = ctx.request.body || {};

    // Скрытое поле: человек его не видит, а боты заполняют все поля подряд.
    // Отвечаем как на успех, чтобы бот не понял, что его отсеяли
    if (data.website) {
      ctx.body = SUCCESS;
      return;
    }

    if (!checkFormToken(data.formToken)) {
      throw new ValidationError('Форма устарела, обновите страницу и попробуйте ещё раз');
    }

    // Принимаем только известные поля: остальное отбрасываем
    const request = {
      name: text(data.name, 'name', { required: true }),
      email: email(data.email),
      message: text(data.message, 'message', { required: true }),
      page: text(data.page, 'page'),
      locale_code: typeof data.locale === 'string' ? data.locale.slice(0, 10) : null,
    };

    // Попытку засчитываем только за заполненную форму: исправление опечаток лимит не тратит
    if (hitRateLimit(ctx.request.ip)) {
      throw new RateLimitError('Слишком много сообщений, попробуйте позже');
    }

    const document = await strapi.documents(UID).create({ data: request });

    // Не ждём SMTP: письмо не должно задерживать ответ, а его ошибки функция логирует сама
    notifyNewContactRequest(document);

    ctx.body = SUCCESS;
  },
}));
