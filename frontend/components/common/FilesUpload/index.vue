<template>
  <div class="files-upload">
    <label class="btn btn_sm" :for="inputId">{{ t('reviews.files') }}</label>
    <input :id="inputId" type="file" multiple :accept="accept" @change="onFileUpload">
    <FilesList class="files-upload__list" :items="files" :editable="editable" @remove="removeFile" />
  </div>
</template>

<script setup>
import { FilesList } from '~/components/common'

const { t } = useI18n()
const inputId = useId()
const files = defineModel({ type: Array, default: () => [] })

// Те же типы, что принимает сервер (backend/src/api/review/utils/files.js)
const accept = 'image/jpeg,image/png,image/gif,image/webp,image/avif,application/pdf'

defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
})

function removeFile (file) {
  files.value = files.value.filter(item => item !== file)
}

function onFileUpload ({ target }) {
  files.value = [...files.value, ...target.files]
  // Иначе повторный выбор того же файла не вызовет change
  target.value = ''
}
</script>

<style lang="scss" src="./style.scss" scoped />