function ruRu (choice, choicesLength) {
  if (choice === 0) return 0

  const mod10 = choice % 10
  const mod100 = choice % 100

  if (mod10 === 1 && mod100 !== 11) return 1
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 2

  return 3
}

export default { 'ru-RU': ruRu }
