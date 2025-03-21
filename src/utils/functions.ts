import Papa from 'papaparse'

/**
* Fetches and returns parsed data
* 
*/
export async function readData(): Promise<any[]> {
  try {
    const response = await fetch("/dict.csv")
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
* Returns random index of data
*/
export function get_random<T>(data: T[]): T{
  if (data.length == 0) {
    throw new Error("Array is empty! Can't get a random element.")
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex]
}
