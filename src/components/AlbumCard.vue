<script setup>
import NegativeFrame from './NegativeFrame.vue'

defineProps({
  album: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <button
    class="album"
    :class="{ 'album--selected': selected }"
    @click="$emit('select', album.id)"
  >
    <NegativeFrame :name="album.name" :src="album.cover" stacked />
    <div class="album__caption">
      <span class="album__name">{{ album.name }}</span>
      <span class="album__count">{{ album.count }} billeder</span>
    </div>
  </button>
</template>

<style scoped>
.album {
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: var(--paper);
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.album:hover,
.album:focus-visible {
  transform: translateY(-3px);
  border-color: var(--tray-red);
}

.album--selected {
  border-color: var(--tray-red);
  box-shadow: 0 0 0 1px var(--tray-red);
}

.album__caption {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.album__name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--tray-red);
}

.album__count {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted);
}
</style>