const { mailFrom } = require('../src/utils/urls');

module.exports = ({ env }) => {
  const smtpPort = env.int('SMTP_PORT', 465);

  return {
    'drag-drop-content-types': {
      enabled: true,
    },

    'multi-select': {
      enabled: true,
    },

    // Кнопка «Translate with AI» в редакторе записи: переводит содержимое формы на язык
    // открытой локали. Модель, адрес API и ключ плагин берёт из переменных окружения
    // (переменные с LLM_TRANSLATOR в имени, см. .env.example), запись сам не сохраняет
    'strapi-llm-translator': {
      enabled: true,
    },

    upload: {
      config: {
        providerOptions: {
          // Срок кеша оригиналов в /uploads (по умолчанию Strapi — 0). Не дольше суток: при замене
          // файла в медиатеке адрес не меняется. WebP-копии для сайта кешируются на год —
          // src/middlewares/uploads.js
          localServer: {
            maxage: 24 * 60 * 60 * 1000,
          },
        },
      },
    },

    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST'),
          port: smtpPort,
          // 465 — TLS сразу при подключении; 587 и другие — обычное подключение,
          // которое requireTLS обязывает перевести в TLS через STARTTLS
          secure: smtpPort === 465,
          requireTLS: true,
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: true,
          },
          // Письмо уходит в фоне, но зависшее соединение не должно висеть часами
          // (по умолчанию nodemailer ждёт до 10 минут на каждом шаге)
          connectionTimeout: 30 * 1000,
          greetingTimeout: 30 * 1000,
          socketTimeout: 60 * 1000,
        },
        settings: {
          // Отправитель всех писем, если в письме не указан другой
          defaultFrom: mailFrom(),
          defaultReplyTo: mailFrom(),
        },
      },
    },
  };
};
