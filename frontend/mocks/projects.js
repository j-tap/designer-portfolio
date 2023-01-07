const src = 'https://via.placeholder.com/600x1500?text=Test+image'
const example = {
  time: {
    start: '12-08-2022',
    end: '19-10-2022',
  },
  steps: [
    { id: 1, title: 'Анализ конкурентов' },
    { id: 2, title: 'Разработка CJM' },
    { id: 3, title: 'Разработка Wireframe' },
    { id: 4, title: 'Разработка Wireframe' },
    { id: 5, title: 'Разработка Wireframe' },
    { id: 6, title: 'Разработка Wireframe' },
  ],
  fonts: ['Vipnagorgialla', 'Manrope'],
  colors: ['#ffffff', '#ffffff', '#ffffff'],
  pages: [
    {
      title: 'Окно регистрации',
      subtitle:'Registration Window',
      images: [
        { src },
        { src },
        { src },
        { src },
        { src },
      ]
    },
    {
      title: 'Личный кабинет 2',
      subtitle: 'Registration Window',
      images: [
        { src },
      ]
    },
    {
      title: 'Личный кабинет 3',
      subtitle: 'Registration Window',
      images: [
        { src },
      ]
    },
  ],
  pagesOther: [
    {
      title: 'Другие страницы',
      subtitle: 'Prototype',
      images: [
        { src },
        { src },
        { src },
      ]
    },
    {
      title: 'Адаптив',
      subtitle: 'Photo/video upload',
      images: [
        { src },
        { src },
        { src },
      ]
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
    name: 'test 1',
    title: 'Test 1',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 5,
    name: 'test 2',
    title: 'Test 2',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 6,
    name: 'test 3',
    title: 'Test 3',
    preview: 'https://via.placeholder.com/400x400?text=Preview',
  },
  {
    ...example,
    id: 7,
    name: 'test 4',
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
]
