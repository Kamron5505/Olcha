import { Link } from 'react-router-dom';

const STATS = [
  { value: '2017', label: 'Год основания' },
  { value: '500 000+', label: 'Довольных клиентов' },
  { value: '50 000+', label: 'Товаров в каталоге' },
  { value: '14', label: 'Регионов доставки' },
];

const TEAM = [
  { name: 'Отдел продаж', desc: 'Помогаем выбрать лучший товар по вашему бюджету', icon: '🛒' },
  { name: 'Служба доставки', desc: 'Быстрая и надёжная доставка по всему Узбекистану', icon: '🚚' },
  { name: 'Техподдержка', desc: 'Решаем любые вопросы 24/7', icon: '💬' },
  { name: 'Гарантийный отдел', desc: 'Обеспечиваем гарантию на все товары', icon: '✅' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">О нас</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">О компании olcha.uz</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Мы — ведущий интернет-магазин электроники и бытовой техники в Узбекистане. 
            С 2017 года помогаем людям покупать качественные товары по честным ценам.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <p className="text-3xl font-bold text-red-600 mb-1">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* About text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Наша миссия</h2>
          <p className="text-gray-600 leading-relaxed">
            Сделать покупку качественной техники доступной для каждого жителя Узбекистана. 
            Мы работаем только с проверенными брендами и гарантируем оригинальность каждого товара.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Благодаря формату маркетплейса мы снижаем операционные издержки и предлагаем 
            цены ниже рыночных без потери качества.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Почему выбирают нас</h2>
          <ul className="space-y-3">
            {[
              'Только оригинальные товары с гарантией',
              'Рассрочка 0% без банков и бумаг',
              'Доставка по всему Узбекистану',
              'Возврат товара в течение 14 дней',
              'Более 50 000 товаров в каталоге',
              'Поддержка клиентов 24/7',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Team */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Наши отделы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {TEAM.map((t) => (
          <div key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <div className="text-4xl mb-3">{t.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{t.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Готовы сделать покупку?</h2>
        <p className="text-gray-500 mb-5">Тысячи товаров по лучшим ценам ждут вас</p>
        <Link
          to="/catalog"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
