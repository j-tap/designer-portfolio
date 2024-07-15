<template>
  <form
    v-if="form"
    class="review-form"
    @submit.prevent="$emit('send', form)"
  >
    <label class="review-form__field">
      <input v-model="form.name" class="field" type="text" placeholder="Имя" required />
    </label>

    <label class="review-form__field">
      <input v-model="form.company" class="field" type="text" placeholder="Компания/Проект" required />
    </label>

    <div class="review-form__field">
      <span>Оценка</span>
      <RatingStars v-model="form.rating" changeable />
    </div>

    <div class="review-form__field">
      <select v-model="form.development" class="field" required>
        <option value="" disabled>Разработка</option>
        <option
          v-for="item in data.developments"
          :key="item.id"
          :value="item.id"
        >
          {{ item?.title }}
        </option>
      </select>
    </div>

    <div class="review-form__field">
      <select v-model="form.cooperation" class="field" required>
        <option value="" disabled>Сотрудничество</option>
        <option
          v-for="item in data.cooperations"
          :key="item.id"
          :value="item.id"
        >
          {{ item?.title }}
        </option>
      </select>
    </div>

    <label class="review-form__field">
      <input v-model="form.link" class="field" type="text" placeholder="Ссылка" />
    </label>

    <label class="review-form__field">
      <textarea v-model="form.text" class="field" placeholder="Отзыв" rows="6"></textarea>
    </label>

    <div class="review-form__field">
      <div class="files-upload">
        <label class="btn btn_sm" for="formInputFile">Загрузите файлы, которыми хотите поделиться</label>
        <input type="file" id="formInputFile" multiple @change="onFileUpload">
        <ul v-if="form.files.length" class="files-list">
          <li
            v-for="(file, i) in form.files"
            :key="i"
            class="files-list__item"
          >
            <button class="btn btn_xs btn_icon" type="button" @click="removeFile(file)">&times;</button>
            <span class="files-list__name">{{ file.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <button class="btn" type="submit">Отправить отзыв</button>
  </form>
</template>

<script setup>
import { RatingStars } from '~/components/common'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

function removeFile (file) {
  props.form.files.splice(props.form.files.indexOf(file), 1)
}

function onFileUpload (evt) {
  Object.entries(evt.target.files).forEach(([, file]) => {
    props.form.files.push(file)
  })
}
</script>

<style lang="scss" scoped src="./style.scss"/>
