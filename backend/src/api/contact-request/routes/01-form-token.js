'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/contact-requests/form-token',
      handler: 'contact-request.formToken',
      config: {
        auth: false,
      },
    },
  ],
};
