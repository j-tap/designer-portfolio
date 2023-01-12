'use strict';

const { slugify } = require('../utils/convert.js');

module.exports = {
  updateName (title = '') {
    return slugify(title);
  }
}
