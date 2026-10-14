'use strict';

/**
 * Все адреса выводятся из SITE_URL — единственного адреса сайта в .env.
 * Тот же расчёт во фронтенде: frontend/config/site.js.
 */

function siteUrl() {
  return new URL(process.env.SITE_URL || 'http://localhost:3000').origin;
}

/**
 * Публичный адрес Strapi. В проде Traefik отдаёт Strapi по пути /strapi того же домена.
 * При локальной разработке Strapi работает на своём порту без префикса — тогда адрес
 * задаётся явно через STRAPI_PUBLIC_URL.
 */
function strapiPublicUrl() {
  return (process.env.STRAPI_PUBLIC_URL || `${siteUrl()}/strapi`).replace(/\/+$/, '');
}

/**
 * Адрес отправителя писем: SMTP_FROM, по умолчанию SMTP_USERNAME (почтовые серверы
 * обычно разрешают отправлять только от имени того ящика, под которым вошли).
 * SMTP_FROM можно указать с именем — «Имя <адрес>», тогда он используется как есть.
 */
function mailFrom() {
  // Пустая строка, а не исключение: конфиг читается и при `strapi build`, где почты нет
  const from = process.env.SMTP_FROM || process.env.SMTP_USERNAME || '';
  if (!from || from.includes('<')) return from;
  return `Diana UI/UX <${from}>`;
}

module.exports = {
  siteUrl,
  strapiPublicUrl,
  mailFrom,
};
