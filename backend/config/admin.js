module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  // Необязательные: без TRANSFER_TOKEN_SALT выключен перенос данных между инстансами
  // (`strapi transfer`), без ENCRYPTION_KEY токены API нельзя посмотреть повторно после создания
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: false,
    promoteEE: false,
  },
});
