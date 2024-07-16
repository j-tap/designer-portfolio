<template>
  <ul v-if="items?.length" :class="['files-list', { 'files-list_editable': editable }]">
    <li
      v-for="(file, i) in items"
      :key="i"
      class="files-list__item"
    >
      <img
        :src="getSrc(file)"
        :alt="file.name"
        class="files-list__icon"
      />
      <button v-if="editable" class="btn btn_xs btn_icon files-list__remove" type="button" @click="removeFile(file)">&times;</button>
      <a v-if="file.url" class="files-list__name" :href="urlFile(file.url)" target="_blank" download>{{ file.name }}</a>
      <span v-else class="files-list__name">{{ file.name }}</span>
    </li>
  </ul>
</template>

<script setup>
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

function getSrc (file) {
  const type = file?.type || file?.mime
  const is = type.startsWith('image/')

  if (is) {
    if (file?.url) {
      return urlFile(file.url)
    }
    else {
      return URL.createObjectURL(file)
    }
  }

  return icon
}

function removeFile (file) {
  if (props.editable) {
    emit('remove', file)
  }
}
</script>

<style lang="scss" src="./style.scss" scoped />