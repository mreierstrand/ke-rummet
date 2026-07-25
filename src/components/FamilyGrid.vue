<script setup>
import { computed } from 'vue'
import PersonCard from './PersonCard.vue'
import { people } from '../data/family.js'

const props = defineProps({
  families: { type: Array, required: true },
  selectedId: { type: String, default: null },
})

const emit = defineEmits(['select'])

// Tæller personer og lægger det i 'role', så PersonCard kan vise det
const familiesWithCount = computed(() => {
  return props.families.map((family) => {
    const count = people.filter((p) => 
      p.families.some((f) => f.id === family.id)
    ).length

    return {
      ...family,
      role: `${count} ${count === 1 ? 'person' : 'personer'}`
    }
  })
})

function selectFamily(id) {
  emit('select', id)
}
</script>

<template>
  <section id="families" class="section">
    <div class="section__head">
      <h2 class="section__title">Familier</h2>
      <span class="section__count">{{ families.length }} familier</span>
    </div>

    <div class="grid">
      <PersonCard
        v-for="family in familiesWithCount"
        :key="family.id"
        :person="family"
        :selected="selectedId === family.id"
        @select="selectFamily"
      />
    </div>
  </section>
</template>

<style scoped>
.section {
  max-width: 1100px;
  margin: 56px auto 0;
  padding: 0 24px;
}

.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--panel-edge);
  padding-bottom: 12px;
}

.section__title {
  font-size: 1.5rem;
  color: var(--paper);
}

.section__count {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
</style>