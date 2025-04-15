import Papa from 'papaparse'

/**
* Fetches and returns parsed data
* 
*/
export async function readData(): Promise<any[]> {
  try {
    const csvUrl = new URL('./dict.csv', import.meta.url).href;
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error: Error) => reject(error),
      })
    })
  }
  catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

/**
* check if is a real word
*/
export async function is_real_word(word: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      method: 'HEAD'
    })
    return response.ok
  } catch {
    return false
  }
}

/**
* Returns random index of data
*/
export function get_random<T>(data: T[]): T{
  if (data.length == 0) {
    throw new Error("Array is empty! Can't get a random element.")
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex]
}
