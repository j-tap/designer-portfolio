'use strict';

/**
 * Токен формы отзыва. Файл назван с префиксом 01-, чтобы маршрут зарегистрировался
 * раньше стандартного GET /reviews/:id и не воспринимался как id.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/reviews/form-token',
      handler: 'review.formToken',
      config: {
        auth: false,
      },
    },
  ],
};
