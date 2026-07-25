<script setup>
import { computed } from 'vue'
import { people, albums, families } from '../data/family.js'

const props = defineProps({
  active: { type: String, default: 'home' },
  currentFamily: { type: String, default: null },
  currentPerson: { type: String, default: null },
  currentAlbum: { type: String, default: null },
})

const emit = defineEmits(['navigate', 'select-person', 'select-album', 'select-family'])

const links = [
  { id: 'home', label: 'Forside' },
  { id: 'families', label: 'Familier', hasDropdown: true, type: 'families' },
  { id: 'people', label: 'Personer', hasDropdown: true, type: 'people' },
  { id: 'albums', label: 'Album', hasDropdown: true, type: 'albums' },
  { id: 'about', label: 'Om' },
]

// Filtrer personer efter valgt familie
const filteredPeople = computed(() => {
  if (!props.currentFamily) return people
  return people.filter((p) => 
    p.families.some((f) => f.id === props.currentFamily)
  )
})
// Filtrer albums efter valgt familie
const filteredAlbums = computed(() => {
  if (!props.currentFamily) return albums
  return albums.filter((a) => 
    a.families.includes(props.currentFamily)
  )
})

function onFamilyClick(familyId) {
  emit('select-family', familyId)
}


function onPersonClick(personId) {
  emit('select-person', personId) // Sender personens ID op til App.vue
  emit('navigate', 'people')      // Skifter fane til 'people'
}

function onAlbumClick(albumId) {
  emit('select-album', albumId)   // Sender albummets ID op til App.vue
  emit('navigate', 'albums')      // Skifter fane til 'albums'
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">
      <button class="navbar__brand" @click="$emit('navigate', 'home')">
        <span class="navbar__aperture" aria-hidden="true"></span>
        <span class="navbar__brand-text">Kabell Eierstrand Rummet</span>
      </button>

      <nav class="navbar__links" aria-label="Hovedmenu">
        <div
          v-for="link in links"
          :key="link.id"
          class="navbar__item"
          :class="{ 'navbar__item--dropdown': link.hasDropdown }"
        >
          <!-- Almindeligt link -->
          <button
            v-if="!link.hasDropdown"
            class="navbar__link"
            :class="{ 'navbar__link--active': active === link.id }"
            @click="$emit('navigate', link.id)"
          >
            {{ link.label }}
          </button>

          <!-- Dropdown-links -->
          <template v-else>
            <button
              class="navbar__link"
              :class="{ 'navbar__link--active': active === link.id }"
              @click="$emit('navigate', link.id)"
            >
              {{ link.label }}
              <span class="navbar__chevron" aria-hidden="true">▾</span>
            </button>

            <div class="navbar__dropdown">
              <!-- Familier -->
              <template v-if="link.type === 'families'">
                <button
                  v-for="family in families"
                  :key="family.id"
                  class="navbar__dropdown-item"
                  :class="{ 'navbar__dropdown-item--active': currentFamily === family.id }"
                  @click="onFamilyClick(family.id)"
                >
                  {{ family.name }}
                </button>
              </template>

              <!-- Personer -->
              <template v-else-if="link.type === 'people'">
                <button
                  v-for="person in filteredPeople"
                  :key="person.id"
                  class="navbar__dropdown-item"
                  :class="{ 'navbar__dropdown-item--active': currentPerson === person.id }"
                  @click="onPersonClick(person.id)"
                >
                  {{ person.name }}
                </button>
                <p v-if="filteredPeople.length === 0" class="navbar__dropdown-empty">
                  Vælg en familie først
                </p>
              </template>

              <!-- Album -->
              <template v-else-if="link.type === 'albums'">
                <button
                  v-for="album in filteredAlbums"
                  :key="album.id"
                  class="navbar__dropdown-item"
                  :class="{ 'navbar__dropdown-item--active': currentAlbum === album.id }"
                  @click="onAlbumClick(album.id)"
                >
                  {{ album.name }}
                </button>
                <p v-if="filteredAlbums.length === 0" class="navbar__dropdown-empty">
                  Vælg en familie først
                </p>
              </template>
            </div>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1100;
  background: #0b0d10;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--panel-edge);
}

.navbar__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--paper);
}

.navbar__aperture {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--safelight);
  position: relative;
  flex-shrink: 0;
}

.navbar__aperture::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--safelight);
}

.navbar__brand-text {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.navbar__links {
  display: flex;
  gap: 4px;
}

.navbar__item {
  position: relative;
}

.navbar__link {
  background: none;
  border: none;
  color: var(--paper-dim);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.navbar__link:hover {
  color: var(--paper);
  background: var(--panel);
}

.navbar__link--active {
  color: var(--safelight);
}

.navbar__chevron {
  font-size: 0.65rem;
  opacity: 0.7;
}

/* ---- Dropdown ---- */
.navbar__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  border-radius: 6px;
  padding: 6px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
  z-index: 30;
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.5);
}

.navbar__item--dropdown:hover .navbar__dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.navbar__dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--paper-dim);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 8px 16px;
  cursor: pointer;
  transition: color 0.12s ease, background 0.12s ease;
}

.navbar__dropdown-item:hover {
  color: var(--safelight);
  background: rgba(255, 255, 255, 0.04);
}

/* Aktiv markering */
.navbar__dropdown-item--active {
  color: var(--safelight);
  background: rgba(255, 255, 255, 0.07);
  font-weight: 600;
}

.navbar__dropdown-empty {
  margin: 0;
  padding: 10px 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
  font-style: italic;
}

/* ---- Mobil ---- */
@media (max-width: 640px) {
  .navbar__brand-text {
    font-size: 1rem;
  }
  .navbar__links {
    gap: 0;
  }
  .navbar__link {
    padding: 8px 8px;
    font-size: 0.68rem;
  }

  .navbar__dropdown {
    display: none;
  }
  .navbar__chevron {
    display: none;
  }
}
</style>