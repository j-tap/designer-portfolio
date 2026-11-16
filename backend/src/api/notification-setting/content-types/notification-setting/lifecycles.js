'use strict';

const { errors: { ValidationError } } = require('@strapi/utils');
const { splitEmails, EMAIL_RE } = require('../../../../utils/notify-recipients');

// Опечатку в адресе видно сразу при сохранении в админке, а не когда письмо не дойдёт
function validate(event) {
  const { emails } = event.params.data ?? {};
  if (emails === undefined) return;

  const invalid = splitEmails(emails).filter(item => !EMAIL_RE.test(item));
  if (invalid.length) {
    throw new ValidationError(`Неверный адрес: ${invalid.join(', ')}. Пишите по одному адресу на строку`);
  }
}

module.exports = {
  beforeCreate: validate,
  beforeUpdate: validate,
};
