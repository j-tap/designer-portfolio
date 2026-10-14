const path = require('path');

// SQLite: файл БД лежит в .tmp, на сервере каталог смонтирован с хоста (docker-compose.prod.yml)
module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
});
