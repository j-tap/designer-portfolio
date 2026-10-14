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
 * Адрес отправителя писем. Gmail отправляет только от имени самого аккаунта
 * или подтверждённого в нём псевдонима, поэтому по умолчанию это SMTP_USERNAME.
 */
function mailFrom() {
  return `Diana UI/UX <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`;
}

module.exports = {
  siteUrl,
  strapiPublicUrl,
  mailFrom,
};
