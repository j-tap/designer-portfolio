const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'sqlite'),
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
  // connection: {
  //   client: 'postgres',
  //   connection: {
  //     host: env('DB_HOST', '127.0.0.1'),
  //     port: env.int('DB_PORT', 5432),
  //     database: env('DB_NAME', 'strapi'),
  //     user: env('DB_USER', 'strapi'),
  //     password: env('DB_PASSWORD', 'strapi'),
  //     schema: env('DB_SCHEMA', 'public'), // Not required
  //     ssl: env.bool('DB_SSL', false) ? { rejectUnauthorized: false } : false
  //   },
  // },
});
