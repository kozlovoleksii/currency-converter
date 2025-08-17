const BASE_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory';

export type CurrenciesMap = Record<string, string>;

export type LatestResponse = {
  amount: number;                 
  base: 'UAH';                   
  date: string;                   
  rates: Record<string, number>;  
};

type NbuItem = {
  r030: number;
  txt: string;      
  rate: number;      
  cc: string;      
  exchangedate: string;
};

async function fetchNbu(): Promise<NbuItem[]> {
  const res = await fetch(`${BASE_URL}/exchange?json`);
  if (!res.ok) throw new Error('Failed to load NBU rates');
  return res.json();
}
export async function getCurrencies(): Promise<CurrenciesMap> {
  const data = await fetchNbu();
  
  const currenciesObject: CurrenciesMap = { UAH: 'Українська гривня' };
  for (const item of data) currenciesObject[item.cc] = item.txt;
  return currenciesObject;
}

export async function getLatest(): Promise<LatestResponse> {
  const data = await fetchNbu();
  const rates: Record<string, number> = { UAH: 1 };
  let date = '';

  for (const item of data) {
    rates[item.cc] = item.rate;    
    if (!date) date = item.exchangedate;
  }

  return { amount: 1, base: 'UAH', date, rates };
}
