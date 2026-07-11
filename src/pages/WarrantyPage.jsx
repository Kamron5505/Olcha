import { Link } from 'react-router-dom';

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Гарантия</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Гарантия на товары</h1>

      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white mb-10">
        <h2 className="text-2xl font-bold mb-3">Мы гарантируем качество</h2>
        <p className="opacity-90 max-w-xl">
          Все товары на olcha.uz — оригинальные, с официальной гарантией производителя. 
          Мы работаем только с авторизованными поставщиками.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Гарантийные сроки</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {[
                ['Смартфоны', '12 месяцев'],
                ['Ноутбуки', '12 месяцев'],
                ['Телевизоры', '24 месяца'],
                ['Холодильники', '24 месяца'],
                ['Стиральные машины', '24 месяца'],
                ['Мелкая техника', '12 месяцев'],
                ['Аксессуары', '6 месяцев'],
              ].map(([cat, period]) => (
                <tr key={cat}>
                  <td className="py-2.5 text-gray-600">{cat}</td>
                  <td className="py-2.5 text-green-600 font-semibold text-right">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Что покрывает гарантия</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Заводской брак и производственные дефекты',
              'Неисправности, возникшие при нормальной эксплуатации',
              'Выход из строя комплектующих',
              'Программные сбои (для электроники)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <h2 className="font-bold text-gray-900 mt-5 mb-3">Гарантия не распространяется на</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Механические повреждения (удары, падения)',
              'Попадание жидкости',
              'Самостоятельный ремонт или модификации',
              'Нарушение правил эксплуатации',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">Как воспользоваться гарантией</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: 1, text: 'Позвоните на горячую линию или напишите в чат' },
            { step: 2, text: 'Опишите проблему, укажите номер заказа' },
            { step: 3, text: 'Мы организуем ремонт или замену товара' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{s.step}</span>
              <p className="text-sm text-gray-600 pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
