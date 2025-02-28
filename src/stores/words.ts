import { defineStore } from 'pinia';

export const useWordsStore = defineStore('words', {
  state: () => ({
    words: [] as any[]
  }),
  actions: {
    setWords(newWords: any[]) {
      this.words = newWords
    }
}
})
