module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // console.log('Request body:', ctx.request.body);
    await next();
  };
};
