<script setup>
defineProps({
  updated: { type: String, required: true },
})
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <span class="footer__mark">Kabell Eierstrand Rummet</span>
      <span class="footer__updated">Sidst opdateret den {{ updated }}</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto; /* Tvinger footeren til altid at lægge sig i bunden */
  border-top: 1px solid var(--panel-edge);
  background: var(--bg-raised);
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
}

.footer__mark {
  color: var(--paper-dim);
}

@media (max-width: 520px) {
  .footer__inner {
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
}


</style>
