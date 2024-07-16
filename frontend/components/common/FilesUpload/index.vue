<template>
  <div class="files-upload">
    <label class="btn btn_sm" for="formInputFile">Загрузите файлы, которыми хотите поделиться</label>
    <input type="file" id="formInputFile" multiple @change="onFileUpload">
    <FilesList class="files-upload__list" :items="modelValue" :editable="editable" @remove="removeFile" />
  </div>
</template>

<script setup>
// TODO:
import { FilesList } from '~/components/common'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

function removeFile (file) {
  const files = [...props.modelValue]
  files.splice(files.indexOf(file), 1)
  emit('update:modelValue', files)
}

function onFileUpload ({ target }) {
  const files = [...props.modelValue]

  Object.entries(target.files).forEach(([, file]) => {
    files.push(file)
  })

  emit('update:modelValue', files)
}
</script>

<style lang="scss" src="./style.scss" scoped />