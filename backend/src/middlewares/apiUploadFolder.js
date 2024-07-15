module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();
    console.log(ctx.request)
    if (ctx.request.files) {
      const { files } = ctx.request;
      const maxFileSize = 1 * 1024 * 1024;

      for (const file of files.files) {
        if (file.size > maxFileSize) {
          ctx.throw(413, `File ${file.name} exceeds the maximum allowed size of ${maxFileSize}MB`);
        }

        const uploadPath = `./uploads/uploaded-files/${file.name}`;
        const fs = require('fs');
        const path = require('path');

        // Создание директории, если она не существует
        const dir = path.dirname(uploadPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Перемещение файла
        fs.renameSync(file.path, uploadPath);

        // Обновление пути файла в бд
        file.path = uploadPath;
      }
    }
  };
};
