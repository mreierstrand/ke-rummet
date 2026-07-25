<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import PersonCard from './PersonCard.vue'
import NegativeFrame from './NegativeFrame.vue'

const props = defineProps({
  people: { type: Array, required: true },
  initialSelected: { type: String, default: null },
})
const emit = defineEmits(['select'])

const selectedId = ref(null)
const lightboxIndex = ref(null)

function selectPerson(id) {
  selectedId.value = id
  emit('select', id) 
}

function backToGrid() {
  selectedId.value = null
  lightboxIndex.value = null
  emit('select', null)
}

function personOf(people, id) {
  return people.find((p) => p.id === id)
}

const selectedPerson = computed(() => personOf(props.people, selectedId.value))
const currentGallery = computed(() => selectedPerson.value?.gallery ?? [])

// Tilføjer en separat egenskab (photoCountText) til kortene, så personens originale 'role' (f.eks. far/datter) bevares
const peopleWithCounts = computed(() => {
  return props.people.map((person) => {
    const count = person.gallery?.length || 0
    const countText = count > 0 ? `${count} ${count === 1 ? 'billede' : 'billeder'}` : 'Ingen billeder'
    return {
      ...person,
      photoCountText: countText
    }
  })
})

// Reager på valg udefra (navbar + skift af familie)
watch(
  () => props.initialSelected,
  (id) => {
    selectedId.value = id
    lightboxIndex.value = null
  }
)

// Lock page scroll while the full-page person view is open
watch(selectedId, (id) => {
  document.body.style.overflow = id ? 'hidden' : ''
})
onUnmounted(() => {
  document.body.style.overflow = ''
})

function openLightbox(i) {
  lightboxIndex.value = i
}

function closeLightbox() {
  lightboxIndex.value = null
}

function nextPhoto() {
  if (lightboxIndex.value === null || !currentGallery.value.length) return
  lightboxIndex.value = (lightboxIndex.value + 1) % currentGallery.value.length
}

function prevPhoto() {
  if (lightboxIndex.value === null || !currentGallery.value.length) return
  lightboxIndex.value =
    (lightboxIndex.value - 1 + currentGallery.value.length) % currentGallery.value.length
}

function onKeydown(e) {
  if (lightboxIndex.value !== null) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextPhoto()
    if (e.key === 'ArrowLeft') prevPhoto()
    return
  }
  if (selectedId.value !== null && e.key === 'Escape') backToGrid()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section id="people" class="section">
    <div class="section__head">
      <h2 class="section__title">Personer</h2>
      <span class="section__count">{{ people.length }} i familien</span>
    </div>

    <div class="grid">
      <PersonCard
        v-for="person in peopleWithCounts"
        :key="person.id"
        :person="{ ...person, role: person.photoCountText }"
        :selected="false"
        @select="selectPerson"
      />
    </div>
  </section>

  <Teleport to="body">
    <Transition name="page-fade">
      <div v-if="selectedId" class="person-view">
        <div class="person-view__inner">
          <button type="button" class="detail__back" @click="backToGrid">
            <span aria-hidden="true">&larr;</span> Tilbage til alle personer
          </button>

          <div class="detail">
            <NegativeFrame
              :name="selectedPerson.name"
              :src="selectedPerson.cover"
              class="detail__frame"
            />
            <div class="detail__text">
              <h3 class="detail__name">{{ selectedPerson.name }}</h3>
              <p class="detail__role">{{ selectedPerson.role }}</p>

              <p v-if="!selectedPerson.gallery || selectedPerson.gallery.length === 0" class="detail__empty">
                Ingen billeder er lagt op endnu.
              </p>
              <div v-else class="detail__gallery">
                <button
                  v-for="(photo, i) in selectedPerson.gallery"
                  :key="i"
                  type="button"
                  class="detail__thumb-btn"
                  @click="openLightbox(i)"
                >
                  <img
                    :src="photo"
                    :alt="`${selectedPerson.name} billede ${i + 1}`"
                    class="detail__thumb"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="lightboxIndex !== null"
        class="lightbox"
        @click.self="closeLightbox"
      >
        <button class="lightbox__close" @click="closeLightbox" aria-label="Luk">
          &times;
        </button>

        <button
          v-if="currentGallery.length > 1"
          class="lightbox__nav lightbox__nav--prev"
          @click="prevPhoto"
          aria-label="Forrige billede"
        >
          &#8249;
        </button>

        <img
          v-if="lightboxIndex !== null"
          :src="currentGallery[lightboxIndex]"
          :alt="`${selectedPerson?.name} billede ${lightboxIndex + 1}`"
          class="lightbox__image"
        />

        <button
          v-if="currentGallery.length > 1"
          class="lightbox__nav lightbox__nav--next"
          @click="nextPhoto"
          aria-label="Næste billede"
        >
          &#8250;
        </button>

        <span v-if="currentGallery.length > 1" class="lightbox__count">
          {{ lightboxIndex + 1 }} / {{ currentGallery.length }}
        </span>
      </div>
    </Transition>
  </Teleport>
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

/* ---- Full-page person view ---- */
.person-view {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: var(--bg);
  overflow-y: auto;
  padding: 48px 24px 80px;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.person-view__inner {
  max-width: 720px;
  margin: 0 auto;
  margin-top: 50px;
}

.detail__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--safelight);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  padding: 0;
  margin-bottom: 28px;
}

.detail__back:hover,
.detail__back:focus-visible {
  text-decoration: underline;
}

.detail {
  background: var(--panel);
  border: 1px solid var(--safelight-dim);
  padding: 28px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 28px;
  align-items: start;
}

.detail__frame {
  width: 200px;
}

.detail__name {
  font-size: 1.8rem;
  color: var(--safelight);
}

.detail__role {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--muted);
  margin: 6px 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.detail__empty {
  color: var(--paper-dim);
  font-style: italic;
  margin: 0;
}

.detail__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.detail__thumb-btn {
  padding: 0;
  border: 1px solid var(--panel-edge);
  background: none;
  cursor: pointer;
  line-height: 0;
  border-radius: 0;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.detail__thumb-btn:hover,
.detail__thumb-btn:focus-visible {
  border-color: var(--safelight-dim);
  transform: translateY(-2px);
}

.detail__thumb {
  display: block;
  width: 76px;
  height: 76px;
  object-fit: cover;
}

@media (max-width: 560px) {
  .person-view {
    padding: 32px 16px 60px;
  }
  .detail {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .detail__frame {
    width: 140px;
  }
  .detail__thumb {
    width: 64px;
    height: 64px;
  }
}

/* ---- Lightbox ---- */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(5, 6, 8, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.18s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox__image {
  max-width: min(90vw, 1100px);
  max-height: 85vh;
  object-fit: contain;
  border: 1px solid var(--panel-edge);
  box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.6);
}

.lightbox .lightbox__image {
  max-width: 95vw !important;
  max-height: 95vh !important;
  width: auto;
  height: auto;
}

.lightbox__close {
  position: absolute;
  top: 90px;
  right: 24px;
  background: none;
  border: 1px solid var(--panel-edge);
  color: var(--paper);
  font-size: 1.5rem;
  line-height: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.lightbox__close:hover,
.lightbox__close:focus-visible {
  border-color: var(--safelight);
  color: var(--safelight);
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid var(--panel-edge);
  color: var(--paper);
  font-size: 1.8rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.lightbox__nav:hover,
.lightbox__nav:focus-visible {
  border-color: var(--safelight);
  color: var(--safelight);
}

.lightbox__nav--prev {
  left: 24px;
}

.lightbox__nav--next {
  right: 24px;
}

.lightbox__count {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
}

@media (max-width: 520px) {
  .lightbox {
    padding: 16px;
  }
  .lightbox__nav {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  .lightbox__nav--prev {
    left: 8px;
  }
  .lightbox__nav--next {
    right: 8px;
  }
}
</style>