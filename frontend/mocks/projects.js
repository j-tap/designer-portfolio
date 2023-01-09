const src = 'https://via.placeholder.com/600x1500?text=Test+image'
const page = {
  id: null,
  type: 'default',
  title: 'Окно регистрации',
  subtitle:'Registration Window',
  images: [],
}
const example = {
  id: null,
  name: null,
  title: null,
  preview: null,
  images: [
    { src },
    { src },
  ],
  time: {
    start: '08/12/2022',
    end: '10/19/2022',
  },
  steps: [
    { id: 1, title: 'Анализ конкурентов' },
    { id: 2, title: 'Разработка CJM' },
    { id: 3, title: 'Разработка Wireframe' },
    { id: 4, title: 'Разработка Wireframe' },
    { id: 5, title: 'Разработка Wireframe' },
  ],
  fonts: ['Vipnagorgialla', 'Manrope'],
  colors: ['#ffffff', '#ffffff', '#ffffff'],
  pages: [
    {
      ...page,
      title: 'Окно регистрации',
      subtitle:'Registration Window',
      images: [
        { src },
        { src },
        { src },
        { src },
        { src },
      ],
    },
    {
      ...page,
      title: 'Личный кабинет 2',
      subtitle: 'Registration Window',
      images: [
        { src },
      ],
    },
    {
      ...page,
      title: 'Личный кабинет 3',
      subtitle: 'Registration Window',
      images: [
        { src },
      ],
    },
    {
      ...page,
      title: 'Личный кабинет 4',
      subtitle: 'Registration Window',
      images: [
        { src },
      ],
    },
    {
      ...page,
      type: 'other',
      title: 'Тестовая страница другие 1',
      subtitle: 'Test page',
      images: [
        { src },
        { src },
        { src },
        { src },
      ],
    },
    {
      ...page,
      type: 'other',
      title: 'Тестовая страница другие 2',
      subtitle: 'Test page 2',
      images: [
        { src },
        { src },
        { src },
      ],
    },
    {
      ...page,
      type: 'other',
      title: 'Тестовая страница другие 3',
      subtitle: 'Test page 3',
      images: [
        { src },
      ],
    },
    {
      ...page,
      type: 'other',
      title: 'Тестовая страница другие 4',
      subtitle: 'Test page 4',
      images: [
        { src },
        { src },
      ],
    },
    {
      ...page,
      type: 'mobile',
      title: 'Тестовая страница мобильная 1',
      subtitle: 'Test page 1',
      images: [
        { src },
      ],
    },
    {
      ...page,
      type: 'mobile',
      title: 'Тестовая страница мобильная 2',
      subtitle: 'Test page 2',
      images: [
        { src },
        { src },
        { src },
        { src },
      ],
    },
    {
      ...page,
      type: 'mobile',
      title: 'Тестовая страница мобильная 3',
      subtitle: 'Test page 3',
      images: [
        { src },
      ],
    },
  ],
}
export default [
  {
    ...example,
    id: 1,
    name: 'cadillac',
    title: 'закрытое сообщество Cadillac',
    preview: 'https://i.imgur.com/UrUuryS.jpeg',
  },
  {
    ...example,
    id: 2,
    name: 'unyapp',
    title: 'UnyApp - платформа для знакомства',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 3,
    name: 'ulula',
    title: 'ULULA Мобильное приложение для обучения',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 4,
    name: 'test_1',
    title: 'Test 1',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 5,
    name: 'test_2',
    title: 'Test 2',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 6,
    name: 'test_3',
    title: 'Test 3',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 7,
    name: 'test_4',
    title: 'Test 4',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 8,
    name: 'test 5',
    title: 'Test 5',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 9,
    name: 'test 6',
    title: 'Test 6',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 10,
    name: 'test 7',
    title: 'Test 7',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 11,
    name: 'test 8',
    title: 'Test 8',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 12,
    name: 'test 9',
    title: 'Test 9',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 13,
    name: 'test 10',
    title: 'Test 10',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
]
