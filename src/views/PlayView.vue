<script setup lang='ts'>
import { onMounted, ref} from 'vue'
import { get_random } from '@/utils/functions';
import { useWordsStore } from '@/stores/words';
import {RouterLink, useRouter} from 'vue-router'
import { readData } from '@/utils/functions';

const router = useRouter();
const words = useWordsStore();
const picked = ref('');
const to_guess = ref('');
const definition = ref('');


onMounted(async () => {
  try {
    words.setWords(await readData());

    if (words.words.length > 0) {
      setup()
    }
  } catch (error) {
    console.error('Error loading words:', error)
  }
});

const setup = () => {
  picked.value = get_random(words.words);
  to_guess.value = picked.value.word;
  definition.value = picked.value.definition.replace(new RegExp(to_guess.value, 'gi'), '*'.repeat(to_guess.value.length));
}
const guesses = ref([]);
const guess = ref('');
const isFinished = ref(false)
const num_guesses = ref(5)

const restart = () => {
  picked.value = get_random(words.words)
  to_guess.value = picked.value.word
  definition.value = picked.value.definition.replace(new RegExp(to_guess.value, 'gi'), '*'.repeat(to_guess.value.length))
  guesses.value = []
  guess.value = ''
  isFinished.value = false
  num_guesses.value = 5
}

const submit = () => {
  if (guess && guess.value.length == to_guess.value.length) {
    num_guesses.value = num_guesses.value - 1
    guesses.value.push(guess.value)
    check()
    guess.value = ''
  }

}
const check = () => {
  if (guess.value === to_guess.value || num_guesses.value <= 0) {
    isFinished.value = true
  }
}

const giveup = () => {
  isFinished.value = true
}
</script>

<template>
<div v-if="words.words.length > 0" class="page">
  <RouterLink to="/">
    <p class="home">Home</p>
  </RouterLink >
  <div class="word">
    <h1 v-if="isFinished">{{to_guess}}</h1>
    <div v-else class="redacted">
      <h1 v-for="i in to_guess">*</h1>
    </div>
  </div>
  <div class="big-container">
    <div class="left-column">
      <p><span class="bold">Length:</span> {{to_guess.length}}</p>
      <p><span class="bold">Definition:</span> {{definition}}</p>
    </div>
    <div class="right-column">
      <div class="header">
        <h2>{{num_guesses}} guesses left</h2>
        <h3 class="clickable" v-if="isFinished == false" @click="giveup">Give up?</h3>
      </div>
      <div class="guess-container" v-for="guess in guesses" :key="guess">
        <div class='guess-row' >
          <p v-for="(char, index) in guess" :key="index" :class="['letter', char == to_guess[index] ? 'green' : to_guess.includes(char) ? 'yellow' : 'red']">{{char}}</p>
        </div>
      </div>
      <form class="word-input-form" @submit="(event) => {event.preventDefault(); submit();}" v-if="!isFinished">
        <input class="word-input" v-model="guess" :maxLength = "to_guess.length"></input>
        <p class="char-limit">{{to_guess.length - guess.length}}</p>
      </form>
    </div>
  </div>
  <div class="footer" v-if="isFinished">
    <h1 class="clickable" @click="restart">Play Again</h1>
  </div>
  </div>
</template>

<style scoped>

.page {
  height: 90vh;
  overflow-y: scroll;
  margin: 1rem;
  
  /* Hide scrollbar for WebKit browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer & Edge */
}

.page::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, Edge */
}
.word {
  width: 100%;
  font-size: x-large;
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}
.big-container{
  display: flex;
  width: 100%;
  align-items: start;
  margin-bottom: 1rem;
  gap: 2rem;
}
.left-column, .right-column {
  width: 100%;
  height: 100%;
  font-size: large;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.clickable:hover {
  cursor: pointer;
}
.bold {
  font-weight: bold
}
.right-column {
  align-items: center;
}
.header {
  display: flex;
  width: 80%;
  justify-content: space-between;
}
.guess-container {
  display: grid;
  width: 100%;
}
.guess-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.letter {
  font-size: large;
  font-weight: bold;
  padding: 1rem;
}
.green {
  border: dashed green;
}
.yellow {
  border: dashed yellow;
}
.red {
  border: dashed red;
}
.redacted {
  display: flex;
}
.word-input-form {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.word-input {
  background-color: transparent;
  color: white;  
  font-size: xx-large;
}
.char-limit {
  height: 100%;
  padding-left: 10px;
}
.footer {
  width: 100%;
  padding-top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 480px) {
  .page {
    margin: 0;
    width: 100%;
  }
  .big-container {
    flex-direction: column;
  }
  .guess-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-left: .5rem;
    margin-right: .5rem;
    margin-top: 0;
    margin-bottom: 0;
  }

  .letter {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding: 0rem;
  }
  .red, .yellow, .green {
    border: none;
  }
  .red {
    color: red;
  }
  .yellow {
    color: yellow;
  }
  .green {
    color: green;
  }
  .word {
    font-size: small;
  }

  .word-input {
    font-size: 1rem;
  }
  
  .left-column, .right-column {
    font-size: x-small;
    height: 40%;
  }
  
}
</style>
