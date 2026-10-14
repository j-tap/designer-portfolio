'use strict';

/**
 * `populate=deep` — то же, что в Strapi 4 делал плагин strapi-plugin-populate-deep: раскрывает
 * компоненты, медиа и связи записи на глубину до DEPTH уровней.
 *
 * Объект populate строится по схеме и подставляется в запрос до контроллера, поэтому дальше
 * работают штатные проверки Strapi: связи с типами, которые роль не может читать, в ответ
 * не попадут. Сторонний плагин для Strapi 5 подставляет populate уже в запрос к БД, в обход
 * этих проверок.
 */

const DEPTH = 5;

// Авторы записей из админки, обратные ссылки на другие локали и записи, где используется файл
const SKIP_ATTRIBUTES = new Set(['createdBy', 'updatedBy', 'localizations', 'related']);

function buildPopulate(strapi, uid, depth) {
  if (depth <= 1) return true;

  const populate = {};

  for (const [name, attribute] of Object.entries(strapi.getModel(uid).attributes)) {
    if (SKIP_ATTRIBUTES.has(name) || attribute.private) continue;

    if (attribute.type === 'media') {
      populate[name] = true;
    }
    else if (attribute.type === 'component') {
      populate[name] = buildPopulate(strapi, attribute.component, depth - 1);
    }
    else if (attribute.type === 'dynamiczone') {
      populate[name] = {
        on: Object.fromEntries(attribute.components.map(component => [component, buildPopulate(strapi, component, depth - 1)])),
      };
    }
    else if (attribute.type === 'relation' && !attribute.target.startsWith('admin::')) {
      populate[name] = buildPopulate(strapi, attribute.target, depth - 1);
    }
  }

  return Object.keys(populate).length ? { populate } : true;
}

/**
 * Адрес /api/<имя>: у коллекций в адресе pluralName, у одиночных типов — singularName.
 */
function contentTypesByRoute(strapi) {
  const routes = new Map();

  for (const [uid, contentType] of Object.entries(strapi.contentTypes)) {
    if (!uid.startsWith('api::')) continue;
    const { pluralName, singularName } = contentType.info;
    routes.set(contentType.kind === 'singleType' ? singularName : pluralName, uid);
  }

  return routes;
}

module.exports = (config, { strapi }) => {
  let routes;
  const cache = new Map();

  return async (ctx, next) => {
    if (ctx.query.populate === 'deep' && ctx.path.startsWith('/api/')) {
      routes ??= contentTypesByRoute(strapi);
      const uid = routes.get(ctx.path.split('/')[2]);

      if (uid) {
        if (!cache.has(uid)) cache.set(uid, buildPopulate(strapi, uid, DEPTH));
        const result = cache.get(uid);
        ctx.query = { ...ctx.query, populate: result === true ? '*' : result.populate };
      }
    }

    await next();
  };
};
