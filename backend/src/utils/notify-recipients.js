'use strict';

/**
 * Кому отправлять письма о новых заявках и отзывах. Адреса задаются в админке
 * («Уведомления», по одному на строку), чтобы их можно было менять без выкладки.
 * Пока там пусто — адрес из NOTIFY_EMAIL в .env, как раньше
 */

const UID = 'api::notification-setting.notification-setting';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// По строкам; запятые и точки с запятой тоже разделяют — на случай, если вставят список
function splitEmails(value) {
  return String(value ?? '')
    .split(/[\s,;]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function validEmails(value) {
  const seen = new Set();
  return splitEmails(value).filter((item) => {
    const key = item.toLowerCase();
    if (!EMAIL_RE.test(item) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function notifyRecipients() {
  try {
    const settings = await strapi.documents(UID).findFirst();
    const emails = validEmails(settings?.emails);
    if (emails.length) return emails;
  }
  catch (error) {
    // Настройки недоступны — письмо всё равно уйдёт на адрес из .env
    strapi.log.error(`Не удалось прочитать адреса для уведомлений: ${error.message}`);
  }
  return validEmails(process.env.NOTIFY_EMAIL);
}

module.exports = { notifyRecipients, splitEmails, EMAIL_RE };
