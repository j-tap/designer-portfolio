'use strict';

/**
 * Права роли Public — из роутеров API. Роутер каждого типа открывает только действия, которые
 * вызывает сайт (`only: [...]` в src/api/<тип>/routes), и именно их роль Public получает при запуске
 * Strapi: новый тип не нужно отмечать в админке вручную, а прод не отдаёт 403 после выкладки.
 *
 * Права только добавляются: снятые в админке галочки вернутся при следующем запуске, а лишние
 * права, выданные вручную, остаются. Маршруты с `auth: false` прав не требуют.
 */

const PUBLIC_ROLE = 'public';
const PERMISSION_UID = 'plugin::users-permissions.permission';

function routerActions(strapi) {
  const actions = new Set();

  for (const api of Object.values(strapi.apis)) {
    for (const router of Object.values(api.routes ?? {})) {
      for (const route of router.routes ?? []) {
        // У штатных роутеров обработчик — полное имя действия: api::<тип>.<тип>.<действие>
        if (route.config?.auth === false || typeof route.handler !== 'string') continue;
        if (route.handler.startsWith('api::')) actions.add(route.handler);
      }
    }
  }

  return actions;
}

async function grantPublicPermissions(strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: PUBLIC_ROLE } });
  if (!role) return;

  const granted = await strapi.db.query(PERMISSION_UID).findMany({
    where: { role: role.id },
    select: ['action'],
  });
  const grantedActions = new Set(granted.map(permission => permission.action));
  const missing = [...routerActions(strapi)].filter(action => !grantedActions.has(action));

  for (const action of missing) {
    await strapi.documents(PERMISSION_UID).create({ data: { action, role: role.documentId } });
  }

  if (missing.length) {
    strapi.log.info(`public permissions granted: ${missing.join(', ')}`);
  }
}

module.exports = { grantPublicPermissions };
