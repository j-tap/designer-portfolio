'use strict';

const { updateName } = require('../../../../services/common.js');

module.exports = {
  beforeCreate(event) {
    const { data } = event.params
    data.name = updateName(data.title)
  },

  beforeUpdate(event) {
    const { data } = event.params
    data.name = updateName(data.title)
  },
};
