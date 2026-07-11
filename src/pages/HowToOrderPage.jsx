import { Link } from 'react-router-dom';

export default function HowToOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Как сделать заказ</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Как сделать заказ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { step: 1, icon: '🔍', title: 'Найдите товар', desc: 'Используйте поиск или каталог для поиска нужного товара' },
          { step: 2, icon: '🛒', title: 'Добавьте в корзину', desc: 'Нажмите кнопку «В корзину» на странице товара' },
          { step: 3, icon: '📝', title: 'Оформите заказ', desc: 'Укажите адрес доставки и выберите способ оплаты' },
          { step: 4, icon: '📦', title: 'Получите товар', desc: 'Курьер доставит заказ в указанное время' },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-xl p-6 border border-gray-100 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {s.step}
            </div>
            <div className="text-4xl mt-2 mb-3">{s.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Способы оформления заказа</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              { icon: '💻', text: 'На сайте olcha.uz — самостоятельно' },
              { icon: '📱', text: 'В мобильном приложении olcha' },
              { icon: '📞', text: 'По телефону +998 71 200-00-00' },
              { icon: '💬', text: 'В онлайн-чате на сайте' },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Статусы заказа</h2>
          <ul className="space-y-3">
            {[
              { status: 'Принят', color: 'bg-blue-100 text-blue-700', desc: 'Заказ получен и обрабатывается' },
              { status: 'Собирается', color: 'bg-yellow-100 text-yellow-700', desc: 'Товар готовится к отправке' },
              { status: 'В пути', color: 'bg-orange-100 text-orange-700', desc: 'Курьер везёт ваш заказ' },
              { status: 'Доставлен', color: 'bg-green-100 text-green-700', desc: 'Заказ успешно получен' },
            ].map((item) => (
              <li key={item.status} className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.color}`}>{item.status}</span>
                <span className="text-gray-600">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
        <h2 className="font-bold text-gray-900 mb-2">Остались вопросы?</h2>
        <p className="text-gray-500 text-sm mb-4">Наши операторы готовы помочь вам 24/7</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="tel:+998712000000" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm">
            Позвонить
          </a>
          <Link to="/contacts" className="border border-red-200 hover:border-red-400 text-red-600 px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm">
            Написать
          </Link>
        </div>
      </div>
    </div>
  );
}
