<template>
  <form
    v-if="form"
    class="form review-form"
    @submit.prevent="sendForm"
  >
    <label class="form__item">
      <span class="label">Имя *</span>
      <input v-model="form.name" class="field" type="text" placeholder="Напишите имя" required />
    </label>

    <label class="form__item">
      <span class="label">Компания/Проект *</span>
      <input v-model="form.company" class="field" type="text" placeholder="Напишите компанию" required />
    </label>

    <label class="form__item">
      <span class="label">Ссылка</span>
      <TooltipBase text="Вставьте ссылку на проект или сайт компании">
        <input v-model="form.link" class="field" type="text" placeholder="Вставьте ссылку" />
      </TooltipBase>
    </label>

    <div class="form__item">
      <span class="label">Оценка</span>
      <RatingStars v-model="form.rating" editable />
    </div>

    <div class="form__item form__item_large">
      <span class="label">Сотрудничество</span>
      <label
        v-for="item in data.cooperations"
        :key="item.id"
        class="checkbox-row"
      >
        <CheckboxField
          :checked="form.cooperations.includes(item.id)"
          :value="item.id"
          required
          @change="onChangeCheck(item.id, 'cooperations')"
        />
        {{ item?.title }}
      </label>
    </div>

    <div class="form__item form__item_large">
      <span class="label">Услуги</span>
      <label
        v-for="item in data.developments"
        :key="item.id"
        class="checkbox-row"
      >
        <CheckboxField
          :checked="form.developments.includes(item.id)"
          :value="item.id"
          required
          @change="onChangeCheck(item.id, 'developments')"
        />
        {{ item?.title }}
      </label>
    </div>

    <label class="form__item">
      <span class="label">Отзыв</span>
      <textarea v-model="form.text" class="field" placeholder="Напишите отзыв" rows="6"></textarea>
    </label>

    <FilesUpload v-model="form.files" editable />

    <button class="btn" type="submit">Отправить</button>
  </form>
</template>

<script setup>
import { RatingStars, CheckboxField, TooltipBase, FilesUpload } from '~/components/common'

const emit = defineEmits(['send'])

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

function onChangeCheck (id, key) {
  if (props.form[key].includes(id)) {
    props.form[key] = props.form[key].filter(v => v !== id)
  }
  else {
    props.form[key].push(id)
  }
}

function sendForm () {
  // if (props.form.cooperation.length && props.form.developments.length) {
  emit('send', props.form)
}
</script>

<style lang="scss" scoped src="./style.scss"/>
