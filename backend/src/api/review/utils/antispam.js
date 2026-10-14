'use strict';

const crypto = require('crypto');

// Форма открыта меньше этого времени — почти наверняка бот
const MIN_FILL_MS = 3 * 1000;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_PER_IP = 5;
// Общий потолок на случай рассылки с множества адресов
const RATE_LIMIT_TOTAL = 50;

const hits = new Map();

function secret() {
  const [key] = strapi.config.get('server.app.keys') || [];
  if (!key) throw new Error('server.app.keys is not configured');
  return key;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(`review-form:${value}`).digest('base64url');
}

/**
 * Токен выдаётся при открытии формы и подписан ключом приложения:
 * бот, отправляющий запрос сразу в API, его не получит, а подделать подпись не сможет.
 */
function issueFormToken() {
  const issuedAt = Date.now();
  return `${issuedAt}.${sign(issuedAt)}`;
}

function checkFormToken(token) {
  if (typeof token !== 'string') return false;

  const [issuedAt, signature] = token.split('.');
  const expected = sign(issuedAt);

  if (
    !signature
    || signature.length !== expected.length
    || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return age >= MIN_FILL_MS && age <= TOKEN_TTL_MS;
}

function prune(list, now) {
  while (list.length && now - list[0] > RATE_WINDOW_MS) list.shift();
}

/**
 * Простой лимит в памяти процесса: Strapi запущен в одном экземпляре,
 * а после перезапуска счётчики обнуляются — для защиты от флуда этого достаточно.
 */
function hitRateLimit(ip) {
  const now = Date.now();

  for (const [key, list] of hits) {
    prune(list, now);
    if (!list.length) hits.delete(key);
  }

  const total = [...hits.values()].reduce((sum, list) => sum + list.length, 0);
  const own = hits.get(ip) || [];

  if (own.length >= RATE_LIMIT_PER_IP || total >= RATE_LIMIT_TOTAL) return true;

  own.push(now);
  hits.set(ip, own);
  return false;
}

module.exports = {
  issueFormToken,
  checkFormToken,
  hitRateLimit,
};
