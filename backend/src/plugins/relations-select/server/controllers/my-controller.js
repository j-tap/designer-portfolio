'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('relations-select')
      .service('myService')
      .getWelcomeMessage();
  },
});
