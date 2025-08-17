export type Lang = 'uk' | 'en';

export const dict: Record<Lang, Record<string, string>> = {
  uk: {
    title: 'Конвертер валют',
    amountLabel: 'Сума',
    amountPlaceholder: 'Введіть суму',
    convert: 'Конвертувати',
    nbu: 'Курси НБУ на:',
    swap: 'Поміняти місцями',
  },
  en: {
    title: 'Currency Converter',
    amountLabel: 'Amount',
    amountPlaceholder: 'Enter amount',
    convert: 'Convert',
    nbu: 'NBU rates as of:',
    swap: 'Swap',
  },
};
