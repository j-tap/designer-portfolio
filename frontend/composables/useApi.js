import { contentLocales } from '~/config/i18n'
import { pickLocaleVersions } from '~/utils/localeVersions'

/**
 * Данные Strapi для страницы: useAsyncData с ключом из запроса (вместе с языком).
 *
 * Ошибка запроса остаётся в `error`, а не превращается в пустые данные: страница сама решает,
 * что показать (404, страницу ошибки). Чтобы данные были на месте до рендера — и на сервере,
 * и при переходе по сайту, — результат ждут: `const { data } = await useStrapiData(...)`.
 *
 * По умолчанию `populate=deep` (backend/src/middlewares/populate-deep.js).
 * `single: true` — запрос по фильтру (например, по slug): вместо списка — первая запись или null.
 * `singleType: true` — одиночный тип (главная, мета-информация): у него другой способ искать перевод.
 *
 * Записи без перевода на язык страницы показываются на языке оригинала (contentLocales: язык
 * по умолчанию, затем остальные), а не пропадают. Язык показанной версии — в её поле `locale`:
 * по нему страница ставит canonical на оригинал и предупреждает, что текст не переведён.
 * `fallback: false` — только записи на языке страницы.
 *
 * Одни и те же данные запрашивают несколько компонентов (мета-информацию — app.vue, usePageMeta,
 * useStructuredData…), а Strapi должен получить один запрос:
 * - `dedupe: 'defer'` — вызов, пока запрос ещё идёт, ждёт его (по умолчанию `cancel`: каждый
 *   следующий вызов отменял бы запрос и отправлял новый);
 * - getCachedData — на сервере вызов после загрузки (компонент ниже `await` страницы) берёт данные
 *   из payload этого запроса страницы; Nuxt по умолчанию на сервере загрузил бы их заново.
 *   В браузере данные из payload берутся только при гидратации, при переходах — запрашиваются заново.
 */
function getCachedData (key, nuxtApp) {
  if (import.meta.server || nuxtApp.isHydrating) return nuxtApp.payload.data[key]
}

// Больше записей за запрос Strapi не отдаёт (config/api.js в бэкенде)
const MAX_PAGE_SIZE = 100

export function useStrapiData (name, params = {}, { single = false, singleType = false, fallback = true, ...options } = {}) {
  const { locale } = useI18n()
  const { find } = useStrapi()
  const query = computed(() => ({ locale: locale.value, populate: 'deep', ...toValue(params) }))

  async function findOrNull (query) {
    try {
      const { data } = await find(name, query)
      return data
    }
    catch (error) {
      // Одиночный тип без версии на этом языке Strapi отдаёт как 404: данных нет, это не сбой
      if (error?.error?.status === 404) return null
      throw error
    }
  }

  // Одиночный тип не принимает locale=*: языки цепочки перебираются, пока версия не найдётся
  async function findSingleType (chain) {
    for (const code of chain) {
      const data = await findOrNull({ ...query.value, locale: code })
      if (data) return data
    }
    return null
  }

  // Коллекция — одним запросом на всех языках (locale=*), от каждой записи — лучшая версия.
  // Записей с версиями на всех языках больше, чем записей, поэтому страницы Strapi читаются
  // все, а ограничение размера списка (pagination.pageSize) применяется уже к записям
  async function findCollection (chain) {
    const { pagination, ...rest } = query.value
    const rows = []
    for (let page = 1; ; page++) {
      const { data, meta } = await find(name, { ...rest, locale: '*', pagination: { page, pageSize: MAX_PAGE_SIZE } })
      rows.push(...data)
      if (page >= (meta?.pagination?.pageCount || 1)) break
    }
    const list = pickLocaleVersions(rows, chain)
    return pagination?.pageSize ? list.slice(0, pagination.pageSize) : list
  }

  return useAsyncData(
    () => `strapi:${name}:${JSON.stringify(query.value)}${fallback ? '' : ':own-locale'}`,
    async () => {
      const chain = fallback ? contentLocales(locale.value) : [locale.value]

      if (singleType) return findSingleType(chain)
      if (!fallback) {
        const data = await findOrNull(query.value)
        return single ? (data?.[0] ?? null) : data
      }

      const list = await findCollection(chain)
      return single ? (list[0] ?? null) : list
    },
    { dedupe: 'defer', getCachedData, ...options },
  )
}

/**
 * Данные, без которых страницы нет: если Strapi ответил ошибкой — страница ошибки (500),
 * если запись не нашлась — 404. Сервер отвечает статусом ошибки, а не пустой страницей с 200.
 * allowMissing: true — пустой ответ допустим (например, у страницы нет версии на этом языке),
 * ошибкой считается только сбой Strapi.
 */
export async function useRequiredStrapiData (name, params = {}, { allowMissing = false, ...options } = {}) {
  const result = await useStrapiData(name, params, options)

  if (result.error.value) {
    throw createError({ statusCode: 500, statusMessage: 'Strapi request failed', fatal: true })
  }
  if (!result.data.value && !allowMissing) {
    // fatal нужен только в браузере (иначе при переходе по сайту не откроется страница ошибки);
    // на сервере он лишь пишет в лог стек каждого 404 — например, от ботов
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: import.meta.client })
  }
  return result
}

/**
 * Адреса файлов из медиатеки Strapi для браузера: в ответах API пути относительные (/uploads/…),
 * а Strapi отдаётся с другого адреса, чем сайт. Вызывается в setup — адрес Strapi берётся
 * из конфигурации сразу, и функции можно звать где угодно, в том числе при сборке <head>.
 */
export function useMedia () {
  const base = useRuntimeConfig().public.strapi.url

  function mediaUrl (path) {
    if (!path) return null
    return /^https?:\/\//.test(path) ? path : `${base}${path}`
  }

  /**
   * srcset из уменьшенных WebP-копий картинки (backend/src/utils/image-variants.js — там те же
   * ширины и то же правило): все ширины меньше оригинала и копия в размер оригинала.
   * Strapi при замене файла оставляет прежнее имя, поэтому к адресу добавлена версия — дата
   * изменения: браузер кеширует копии на год. null — для файла копий нет (SVG, GIF, документ).
   */
  function mediaSrcset (file) {
    const name = file?.url?.match(/^\/uploads\/([^/]+\.(?:jpe?g|png))$/i)?.[1]
    if (!name || !VARIANT_MIMES.has(file.mime) || !file.width) return null

    const updated = Date.parse(file.updatedAt)
    const version = Number.isNaN(updated) ? '' : `?v=${updated.toString(36)}`

    return variantWidths(file.width)
      .map(width => `${mediaUrl(`/uploads/_w${width}/${name}.webp`)}${version} ${Math.min(width, file.width)}w`)
      .join(', ')
  }

  // Картинка в виде, который ждёт ImgBlock
  function mediaImage (file) {
    return {
      id: file.id,
      url: mediaUrl(file.url),
      srcset: mediaSrcset(file),
      blurhash: file.blurhash,
      title: file.name,
      width: file.width,
      height: file.height,
    }
  }

  return { mediaUrl, mediaSrcset, mediaImage }
}

const VARIANT_WIDTHS = [480, 800, 1280, 1920]
const VARIANT_MIMES = new Set(['image/jpeg', 'image/png'])

function variantWidths (width) {
  const index = VARIANT_WIDTHS.findIndex(w => w >= width)
  return index === -1 ? VARIANT_WIDTHS : VARIANT_WIDTHS.slice(0, index + 1)
}
