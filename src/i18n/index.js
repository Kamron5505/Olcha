import ru from './ru';
import uz from './uz';
import oz from './oz';

export const LANGUAGES = [
  { code: 'ru', label: 'Рус', flag: '🇷🇺' },
  { code: 'uz', label: "O'z", flag: '🇺🇿' },
  { code: 'oz', label: 'Ўз', flag: '🇺🇿' },
];

export const translations = { ru, uz, oz };

export function t(lang, key) {
  return translations[lang]?.[key] || translations['ru']?.[key] || key;
}
