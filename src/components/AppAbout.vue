<script setup></script>

<template>
  <section id="about" class="section">
    <div class="section__head">
      <h2 class="section__title">Om albummet</h2>
    </div>
    <p class="about__text">
      Dette er Kabell & Eierstrand familiernes samlingssted for billeder &mdash; En hyldest til Anders Lykke Hansen og hans Alhrummet.dk – et digitalt familiealbum, der gennem tiden har samlet minder, øjeblikke og historier fra en hel familie.
<!-- Hjemmesiden er genopstået i en ny og moderne udgave – bygget op fra bunden med respekt for det originale album og den kærlighed, Anders har ligget bag.
Efterhånden som nye billeder tilføjes, vokser albummet videre – præcis som familien selv har gjort gennem årene. Det, der begyndte som Anders Lykke Hansen's samling af familiens minder, er nu blevet endnu større og rummer endnu flere generationer, relationer og historier.
Dette er ikke blot en hjemmeside med billeder. Det er et levende familiearkiv – en hyldest til de mennesker, øjeblikke og minder, der binder familierne sammen. -->

    </p>
  </section>
</template>

<style scoped>
.section {
  max-width: 1100px;
  margin: 56px auto 56px;
  padding: 0 24px;
}

.section__head {
  margin-bottom: 18px;
  border-bottom: 1px solid var(--panel-edge);
  padding-bottom: 12px;
}

.section__title {
  font-size: 1.5rem;
  color: var(--paper);
}

.about__text {
  color: var(--paper-dim);
  line-height: 1.7;
  max-width: 62ch;
}
</style>
