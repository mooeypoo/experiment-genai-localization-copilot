<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { validateUser } from '../data/store'

const { t, locale } = useI18n()
const emit = defineEmits(['submit', 'error'])

const BIO_MAX_LENGTH = 160

const name = ref('')
const pronouns = ref('they/them')
const bio = ref('')
const errorMessage = ref('')

const bioLength = computed(() => bio.value.length)
const bioRemaining = computed(() => BIO_MAX_LENGTH - bioLength.value)
const bioCounterClass = computed(() => {
  if (bioLength.value > BIO_MAX_LENGTH) return 'char-counter--over'
  if (bioLength.value >= BIO_MAX_LENGTH - 20) return 'char-counter--warning'
  return ''
})

const formatNumber = (value) => {
  return new Intl.NumberFormat(locale.value).format(value)
}

const formattedCharCounterText = computed(() => {
  return t('charCounter.format', { 
    current: formatNumber(bioLength.value), 
    max: formatNumber(BIO_MAX_LENGTH) 
  })
})

const formattedCounterHint = computed(() => {
  const remaining = bioRemaining.value
  if (remaining < 0) {
    return t('charCounter.over', { count: formatNumber(Math.abs(remaining)) })
  }
  if (remaining <= 20) {
    return t('charCounter.remaining', { count: formatNumber(remaining) })
  }
  return ''
})

const handleSubmit = () => {
  errorMessage.value = ''
  
  const error = validateUser(name.value, bio.value, pronouns.value)
  if (error) {
    errorMessage.value = t(error)
    emit('error', error)
    return
  }
  
  emit('submit', {
    name: name.value.trim(),
    pronouns: pronouns.value,
    bio: bio.value.trim()
  })
  name.value = ''
  pronouns.value = 'they/them'
  bio.value = ''
}
</script>

<template>
  <section class="card form-card">
    <header class="section-header">
      <h2>{{ t('user.createTitle') }}</h2>
      <p>{{ t('user.createSubtitle') }}</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>{{ t('user.nameLabel') }}</span>
        <input v-model="name" type="text" :placeholder="t('user.namePlaceholder')" required />
      </label>
      <label class="form-field">
        <span>{{ t('user.pronounsLabel') }}</span>
        <select v-model="pronouns" required>
          <option value="she/her">{{ t('user.pronounsOptions.sheHer') }}</option>
          <option value="he/him">{{ t('user.pronounsOptions.heHim') }}</option>
          <option value="they/them">{{ t('user.pronounsOptions.theyThem') }}</option>
          <option value="any">{{ t('user.pronounsOptions.any') }}</option>
        </select>
      </label>
      <label class="form-field">
        <span>{{ t('user.bioLabel') }}</span>
        <textarea 
          v-model="bio" 
          rows="3" 
          :placeholder="t('user.bioPlaceholder')"
          :maxlength="BIO_MAX_LENGTH"
        ></textarea>
        <span class="char-counter" :class="bioCounterClass">
          {{ formattedCharCounterText }}
          <span v-if="formattedCounterHint" class="char-counter-hint"> {{ formattedCounterHint }}</span>
        </span>
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn">{{ t('user.submitButton') }}</button>
    </form>
  </section>
</template>
