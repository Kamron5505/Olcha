import { createContext, useContext, useState } from 'react';
import { t as translate, LANGUAGES } from '../i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('olcha_lang') || 'ru'
  );

  function changeLang(code) {
    setLang(code);
    localStorage.setItem('olcha_lang', code);
  }

  function t(key) {
    return translate(lang, key);
  }

  return (
    <LangContext.Provider value={{ lang, changeLang, t, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
