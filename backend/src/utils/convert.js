'use strict';

module.exports = {
  slugify (value) {
    return `${value}`
      .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }
}
