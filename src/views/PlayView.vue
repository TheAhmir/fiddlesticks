<script setup lang='ts'>
import {watch, onMounted, ref, nextTick} from 'vue'
import { get_random } from '@/utils/functions';
import { useWordsStore } from '@/stores/words';
import {RouterLink, useRouter} from 'vue-router'
import { readData, is_real_word } from '@/utils/functions';

const router = useRouter();
const words = useWordsStore();
const picked = ref<{ word: string, definition: string } | null>(null);
const to_guess = ref('');
const definition = ref('');
const letter_counts = ref<{[key:number]:string}>({});

onMounted(async () => {
  try {
    const data = await readData();
    words.setWords(data);
    await nextTick()
    setup(); // Only run setup when words are available

  } catch (error) {
  
    console.error('Error loading words:', error)
  }
});

const fill_letter_counts = (word: string) => {
  letter_counts.value = {}
  for (const [index, letter] of [...word].entries()) {
    letter_counts.value[index] = letter
   }
  
}

const setup = () => {
  picked.value = get_random(words.words);
  if (picked.value) {
    to_guess.value = picked.value.word.toLowerCase();
    definition.value = picked.value.definition.replace(new RegExp(to_guess.value, 'gi'), '*'.repeat(to_guess.value.length));
    fill_letter_counts(to_guess.value)
  }
}

const guesses = ref<string[]>([]);
const guess = ref('');
const isFinished = ref(false)
const num_guesses = ref(5)
const real_word_popup = ref(false)
const found = ref<string[]>([])

const get_colors = (char: string, index: number) => {
  if (char == to_guess.value[index]) {
    try {
      delete letter_counts.value[index]
      found.value.push(char)
    } catch {} finally {
      return 'green'
    }
  } else if (Object.values(letter_counts.value).includes(char)) {
      return "yellow"
  } else {
    if (Object.values(found.value).includes(char)) {
      return "none"
    } else {
      return "red"
    }
  }
}

const trigger_popup = () => {
  real_word_popup.value = true

  setTimeout(() => {
    real_word_popup.value = false
  }, 1000)
}

const restart = () => {
  picked.value = get_random(words.words)
  if (picked.value) {
    to_guess.value = picked.value.word.toLowerCase();
    definition.value = picked.value.definition.replace(new RegExp(to_guess.value, 'gi'), '*'.repeat(to_guess.value.length));
    fill_letter_counts(to_guess.value)
  }
  guesses.value = []
  guess.value = ''
  isFinished.value = false
  num_guesses.value = 5
}

const submit = async () => {
  if (guess && guess.value?.length == to_guess.value.length) {
    if (await is_real_word(guess.value.toLowerCase()) || words.words.map(w => w.word.toLowerCase()).includes(guess.value)) {
      num_guesses.value = num_guesses.value - 1
      guesses.value.push(guess.value.toLowerCase())
      check()
      guess.value = ''
    } else {
      trigger_popup()
    }
  }

}
const check = () => {
  if (guess.value.toLowerCase() === to_guess.value || num_guesses.value <= 0) {
    isFinished.value = true
  }
}

watch(guesses, () => {
  check();
});


const giveup = () => {
  isFinished.value = true
}
</script>

<template>
<div v-if="words.words.length > 0" class="page">
  <RouterLink to="/">
    <p class="home">Home</p>
  </RouterLink >
  <div class="real_word_popup" v-if="real_word_popup">Not a real word!</div>
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
          <p v-for="(char, index) in guess" :key="index" :class="['letter', get_colors(char, index)]">{{char}}</p>
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
  .none {
    color: red;    
  }
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
    font-size: small;
    height: 40%;
  }
  
}
</style>
