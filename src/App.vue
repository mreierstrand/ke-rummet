<script setup>
import { ref, computed } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import FamilyGrid from './components/FamilyGrid.vue'
import PersonGrid from './components/PersonGrid.vue'
import AlbumGrid from './components/AlbumGrid.vue'
import AppAbout from './components/AppAbout.vue'
import AppFooter from './components/AppFooter.vue'
import { people, albums, families } from './data/family.js'

const active = ref('home')
const lastUpdated = '25. juli 2026'

const selectedFamilyId = ref(null)
const selectedPersonId = ref(null)
const selectedAlbumId = ref(null)

// Filtrerede personer
const filteredPeople = computed(() => {
  if (!selectedFamilyId.value) return []

  return people
    .filter((p) => p.families.some((f) => f.id === selectedFamilyId.value))
    .map((p) => {
      const match = p.families.find((f) => f.id === selectedFamilyId.value)
      return {
        ...p,
        role: match?.role || '',
        order: match?.order ?? 999,   // fallback hvis order mangler
      }
    })
    .sort((a, b) => a.order - b.order)   // ← sorterer efter order i den valgte familie
})

// Filtrerede albums
const filteredAlbums = computed(() => {
  if (!selectedFamilyId.value) return []
  const result = albums.filter((a) => a.families.includes(selectedFamilyId.value))
  return result
})

function backToGrid() {
  selectedPersonId.value = null
  selectedAlbumId.value = null
}

function navigate(id) {
  active.value = id
  
  if (id === 'home') {
    // Nulstil alle valg, så man lander på den "rene" forside uden valgt familie
    selectedFamilyId.value = null
    selectedPersonId.value = null
    selectedAlbumId.value = null
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function onSelectPerson(id) {
  selectedPersonId.value = id
  selectedAlbumId.value = null
  
  if (id) {
    active.value = 'people'
    
    // Hvis ingen familie er valgt, find den første familie personen tilhører og sæt den
    if (!selectedFamilyId.value) {
      const personObj = people.find((p) => p.id === id)
      if (personObj && personObj.families.length > 0) {
        selectedFamilyId.value = personObj.families[0].id
      }
    }
  } else {
    active.value = 'families'
  }
}

function onSelectAlbum(id) {
  selectedAlbumId.value = id
  selectedPersonId.value = null // Nulstil person
  active.value = 'albums'       // Gør 'Album'-fanen aktiv
}

function onSelectFamily(id) {
  if (id === selectedFamilyId.value) return
  selectedFamilyId.value = id
  selectedPersonId.value = null
  selectedAlbumId.value = null
  active.value = 'families'
}
</script>

<template>
  <div class="main-layout">
    <AppNavbar
      :active="active"
      :current-family="selectedFamilyId"
      :current-person="selectedPersonId"
      :current-album="selectedAlbumId"
      @navigate="navigate"
      @select-family="onSelectFamily"
      @select-person="onSelectPerson"
      @select-album="onSelectAlbum"
    />

    <FamilyGrid
      :families="families"
      :selected-id="selectedFamilyId"
      @select="onSelectFamily"
    />

    <template v-if="selectedFamilyId">
      <PersonGrid
        :key="'people-' + selectedFamilyId"
        :people="filteredPeople"
        :initial-selected="selectedPersonId"
        @select="onSelectPerson"
      />
      <AlbumGrid
        :key="'albums-' + selectedFamilyId"
        :albums="filteredAlbums"
        :initial-selected="selectedAlbumId"
        @select="onSelectAlbum"
      />
    </template>

    <AppAbout />
  </div>

  <AppFooter :updated="lastUpdated" />
</template>