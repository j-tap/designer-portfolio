/**
 * Предпросмотр проекта на посадочной странице: окно с проектом поверх страницы вместо перехода
 * в портфолио. Открытый проект — в адресе (?project=<slug>): кнопка «Назад» в браузере и на телефоне
 * закрывает окно, а не уводит с посадочной, и ссылкой с открытым проектом можно поделиться.
 * Остальные параметры адреса (метки рекламы) сохраняются.
 */
export function useProjectPreview () {
  const route = useRoute()
  const router = useRouter()

  const slug = computed(() => (typeof route.query.project === 'string' && route.query.project) || null)

  function withoutProject () {
    const { project, ...query } = route.query
    return query
  }

  function open (value) {
    router.push({ query: { ...route.query, project: value } })
  }

  function close () {
    if (!slug.value) return
    // Окно открыли на этой странице — шаг назад вернёт её адрес без проекта.
    // Открыли сразу по ссылке с проектом — назад идти некуда, просто убираем параметр
    const back = window.history.state?.back
    const previous = back ? router.resolve(back) : null
    if (previous?.path === route.path && !previous.query.project) router.back()
    else router.replace({ query: withoutProject() })
  }

  return { slug, open, close }
}
