<template>
  <ul v-if="items?.length" :class="['files-list', { 'files-list_editable': editable }]">
    <li
      v-for="(file, index) in items"
      :key="file.id ?? `${file.name}-${file.size}-${file.lastModified}`"
      class="files-list__item"
    >
      <img
        :src="previews[index]"
        :alt="file.name"
        class="files-list__icon"
      />
      <button v-if="editable" class="btn btn_xs btn_icon files-list__remove" type="button" @click="removeFile(file)">&times;</button>
      <a v-if="file.url" class="files-list__name" :href="mediaUrl(file.url)" target="_blank" download>{{ file.name }}</a>
      <span v-else class="files-list__name">{{ file.name }}</span>
    </li>
  </ul>
</template>

<script setup>
const { mediaUrl } = useMedia()
const icon = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9JyNmZmYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZmlsbC1ydWxlPSdldmVub2RkJyBjbGlwLXJ1bGU9J2V2ZW5vZGQnIGQ9J00xNi4wNjA3IDNINS4yNVYyMUgxOC43NVY1LjY4OTM0TDE2LjA2MDcgM1pNNi43NSAxOS41VjQuNUgxNS40MzkzTDE3LjI1IDYuMzEwNjZWMTkuNUg2Ljc1Wk04LjI1IDkuNzVIMTUuNzVWOC4yNUg4LjI1VjkuNzVaTTguMjUgMTIuNzVIMTUuNzVWMTEuMjVIOC4yNVYxMi43NVpNMTIgMTUuNzVIOC4yNVYxNC4yNUgxMlYxNS43NVonIC8+PC9zdmc+'
const emit = defineEmits(['remove'])

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

// Превью: картинка из медиатеки, превью выбранного (ещё не загруженного) файла или значок документа.
// Ссылки blob: на выбранные файлы освобождаются, когда список меняется или компонент исчезает
const previews = shallowRef([])

watchEffect((onCleanup) => {
  const blobs = []

  previews.value = props.items.map((file) => {
    const type = file?.type || file?.mime || ''
    if (!type.startsWith('image/')) return icon
    if (file.url) return mediaUrl(file.url)
    if (import.meta.server) return icon

    const blob = URL.createObjectURL(file)
    blobs.push(blob)
    return blob
  })

  onCleanup(() => blobs.forEach(blob => URL.revokeObjectURL(blob)))
})

function removeFile (file) {
  if (props.editable) {
    emit('remove', file)
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />