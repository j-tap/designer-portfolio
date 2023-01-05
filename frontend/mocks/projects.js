const src = 'https://via.placeholder.com/600x1500?text=Test+image'
const example = {
  fonts: ['Vipnagorgialla', 'Manrope'],
  colors: ['#fffff', '#fffff', '#fffff'],
  pages: [
    {
      title: 'Личный кабинет 1',
      images: [
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
