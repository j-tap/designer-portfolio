module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    data.publishedAt = null;
  },
};
