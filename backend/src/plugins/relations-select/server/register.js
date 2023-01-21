'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'relations-select',
    plugin: 'relations-select',
    type: 'string',
  });
};
