<script setup>
import NegativeFrame from './NegativeFrame.vue'

defineProps({
  person: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <button
    class="card"
    :class="{ 'card--selected': selected }"
    @click="$emit('select', person.id)"
  >
    <NegativeFrame :name="person.name" :src="person.cover" />
    <div class="card__caption">
      <span class="card__name">{{ person.name }}</span>
      <span class="card__role">{{ person.role }}</span>
    </div>
  </button>
</template>

<style scoped>
.card {
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: var(--paper);
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--safelight-dim);
  box-shadow: 0 10px 24px -12px rgba(232, 163, 61, 0.35);
}

.card--selected {
  border-color: var(--safelight);
  box-shadow: 0 0 0 1px var(--safelight);
}

.card__caption {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--safelight);
}

.card__role {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>