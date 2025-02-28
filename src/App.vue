<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWordsStore } from '@/stores/words'
import { RouterView } from 'vue-router';
import { readData } from '@/utils/functions';


const words = useWordsStore();

onMounted(async () => {
  try {
    words.setWords(await readData());
  } catch (error) {
    console.error('Error loading words:', error)
  }
});


</script>

<template>
  <header>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
