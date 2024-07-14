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
      <div class="review-rating">
        <label
          v-for="i in 5"
          :key="i"
          :class="['review-rating__item', { 'review-rating__item_active': form.rating >= i }]"
        >
          <input v-model="form.rating" :value="i" type="radio" />
          <span>{{ i }}</span>
        </label>
      </div>
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
      <label for="formInputFile">Загрузите файлы, которыми хотите поделиться</label>
      <div>
        <input type="file" id="formInputFile" multiple @change="onFileUpload">
        <ul v-if="form.files.length">
          <li v-for="(file, i) in form.files" :key="i">{{ file.name }}</li>
        </ul>
      </div>
    </div>

    <button class="btn" type="submit">Отправить отзыв</button>
  </form>
</template>

<script setup>
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

const onFileUpload = (evt) => {
  this.form.files = Array.from(evt.target.files)
}
</script>

<style lang="scss" scoped src="./style.scss"/>
