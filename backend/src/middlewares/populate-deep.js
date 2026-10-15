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
 * populate самой записи: связи на глубину DEPTH и, у переводимых типов, языки её версий —
 * без содержимого. По ним сайт не ведёт переключатель языков и hreflang на несуществующую версию.
 */
function buildRootPopulate(strapi, uid) {
  const result = buildPopulate(strapi, uid, DEPTH);
  // localizations в схеме есть у всех типов, но заполнить его можно только у переводимых
  if (!strapi.getModel(uid).pluginOptions?.i18n?.localized) return result === true ? '*' : result.populate;

  return { ...(result === true ? {} : result.populate), localizations: { fields: ['locale'] } };
}

/**
 * Адрес <префикс API>/<имя>: у коллекций в адресе pluralName, у одиночных типов — singularName.
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
  const prefix = `${strapi.config.get('api.rest.prefix')}/`;
  let routes;
  const cache = new Map();

  return async (ctx, next) => {
    if (ctx.query.populate === 'deep' && ctx.path.startsWith(prefix)) {
      routes ??= contentTypesByRoute(strapi);
      const uid = routes.get(ctx.path.slice(prefix.length).split('/')[0]);

      if (uid) {
        if (!cache.has(uid)) cache.set(uid, buildRootPopulate(strapi, uid));
        ctx.query = { ...ctx.query, populate: cache.get(uid) };
      }
    }

    await next();
  };
};
