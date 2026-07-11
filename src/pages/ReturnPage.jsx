import { Link } from 'react-router-dom';

export default function ReturnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Возврат товара</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Возврат товара</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '📅', title: '14 дней', desc: 'Срок возврата товара надлежащего качества' },
          { icon: '🔧', title: 'Гарантийный ремонт', desc: 'Бесплатный ремонт в течение гарантийного срока' },
          { icon: '💰', title: 'Полный возврат', desc: 'Возврат 100% стоимости при соблюдении условий' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Условия возврата</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Товар не был в употреблении',
              'Сохранены оригинальная упаковка и комплектация',
              'Сохранены все ярлыки и пломбы',
              'Есть чек или подтверждение заказа',
              'Прошло не более 14 дней с момента получения',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Как оформить возврат</h2>
          <ol className="space-y-3">
            {[
              'Позвоните на горячую линию +998 71 200-00-00',
              'Сообщите номер заказа и причину возврата',
              'Курьер заберёт товар в удобное время',
              'Деньги вернутся на карту в течение 3–5 дней',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
        <h3 className="font-semibold text-gray-800 mb-2">⚠️ Товары, не подлежащие возврату</h3>
        <p className="text-sm text-gray-600">
          Программное обеспечение, цифровые товары, товары личной гигиены, а также товары с нарушенной упаковкой 
          возврату не подлежат согласно законодательству Республики Узбекистан.
        </p>
      </div>
    </div>
  );
}
