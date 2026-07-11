import { Link } from 'react-router-dom';

const BANKS = [
  { name: 'Uzum Bank', months: 'до 24 мес', logo: '🏦' },
  { name: 'Kapitalbank', months: 'до 18 мес', logo: '🏦' },
  { name: 'Ipoteka Bank', months: 'до 12 мес', logo: '🏦' },
  { name: 'Hamkorbank', months: 'до 24 мес', logo: '🏦' },
];

export default function InstallmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Рассрочка</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Рассрочка 0%</h1>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-10">
        <h2 className="text-2xl font-bold mb-3">Купите сейчас — платите потом</h2>
        <p className="opacity-90 mb-6 max-w-xl">
          Оформите рассрочку прямо на сайте без визита в банк. Только паспорт и банковская карта. 
          Одобрение за 2 минуты.
        </p>
        <div className="flex flex-wrap gap-4">
          {['0% переплата', 'До 24 месяцев', 'Без справок', 'Онлайн оформление'].map((f) => (
            <span key={f} className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">{f}</span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Как оформить рассрочку</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { step: 1, title: 'Выберите товар', desc: 'Найдите нужный товар в каталоге' },
          { step: 2, title: 'Нажмите «В рассрочку»', desc: 'На странице товара или в корзине' },
          { step: 3, title: 'Введите данные', desc: 'Паспорт и номер банковской карты' },
          { step: 4, title: 'Получите товар', desc: 'Доставим после одобрения заявки' },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
              {s.step}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">{s.title}</h3>
            <p className="text-xs text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Banks */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Банки-партнёры</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {BANKS.map((b) => (
          <div key={b.name} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <div className="text-3xl mb-2">{b.logo}</div>
            <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
            <p className="text-xs text-blue-600 mt-1">{b.months}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Частые вопросы</h2>
      <div className="space-y-3">
        {[
          { q: 'Есть ли переплата?', a: 'Нет. Рассрочка 0% — вы платите ровно столько, сколько стоит товар.' },
          { q: 'Какой минимальный первоначальный взнос?', a: 'Первоначальный взнос от 0% в зависимости от банка и суммы покупки.' },
          { q: 'Что нужно для оформления?', a: 'Только паспорт гражданина Узбекистана и банковская карта (Uzcard или Humo).' },
          { q: 'Как быстро одобряют заявку?', a: 'Решение принимается автоматически за 2–5 минут.' },
        ].map((item) => (
          <details key={item.q} className="bg-white rounded-xl border border-gray-100 group">
            <summary className="px-6 py-4 font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between">
              {item.q}
              <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="px-6 pb-4 text-sm text-gray-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
