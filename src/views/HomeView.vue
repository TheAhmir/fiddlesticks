<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';


</script>

<template>

      <h1 class="title">Fiddlesticks</h1>
      <p>Fiddlesticks is an exclamation used to indicate nonsense or rubbish. It is derived from the literal term "fiddle sticks," which refers to the bows used to play violins. The phrase is used to express mild annoyance or impatience. In traditional music, fiddlesticks are used to add percussion to old-time and Cajun fiddle music.</p>
  <header>

    <div>
      <nav>
        <div class="play-button">
          <RouterLink class="play-link" to="/play">Play</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

.play-button {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.play-link {
  font-size: x-large;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border: solid slategray;
  border-radius: 5px;
}

.title {
  font-size: xx-large;
  font-weight: bold;
}
</style>
