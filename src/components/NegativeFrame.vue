<script setup>
import { computed } from 'vue'
import { toneFor, initialsFor } from '../utils/tone.js'

const props = defineProps({
  name: { type: String, required: true },
  src: { type: String, default: null },
  stacked: { type: Boolean, default: false },
})

const tones = computed(() => toneFor(props.name))
const initial = computed(() => initialsFor(props.name))
</script>

<template>
  <div class="frame" :style="{ '--tone-a': tones[0], '--tone-b': tones[1] }">
    <div class="frame__notch frame__notch--top" aria-hidden="true"></div>
    <div class="frame__glass">
      <img v-if="src" :src="src" :alt="name" class="frame__photo" />
      <span v-else class="frame__initial">{{ initial }}</span>
      <div v-if="stacked && !src" class="frame__ghost frame__ghost--1"></div>
      <div v-if="stacked && !src" class="frame__ghost frame__ghost--2"></div>
    </div>
    <div class="frame__notch frame__notch--bottom" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  aspect-ratio: 4 / 5;
  background: #08090b;
}

.frame__notch {
  display: flex;
  justify-content: space-between;
  padding: 0 0px;
}

.frame__notch::before,
.frame__notch::after,
.frame__notch span {
  content: '';
}



.frame__glass {
  position: relative;
  height: 100%;
  margin-top: 0;
}

.frame__glass::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    115deg,
    rgba(0, 0, 0, 0.08) 0px,
    rgba(0, 0, 0, 0.08) 1px,
    transparent 1px,
    transparent 5px
  );
  mix-blend-mode: overlay;
  pointer-events: none;
}

.frame__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.frame__initial {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: rgba(22, 17, 13, 0.72);
  z-index: 1;
}

.frame__ghost {
  position: absolute;
  border-radius: 50%;
  background: rgba(22, 17, 13, 0.18);
}

.frame__ghost--1 {
  width: 46%;
  height: 46%;
  left: 6%;
  bottom: -8%;
}

.frame__ghost--2 {
  width: 40%;
  height: 40%;
  right: 4%;
  bottom: -6%;
}
</style>