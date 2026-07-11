import { Link } from 'react-router-dom';

const REGIONS = [
  { name: 'Ташкент (город)', time: '1–3 рабочих дня', price: 'Бесплатно от 200 000 сум' },
  { name: 'Ташкентская область', time: '2–4 рабочих дня', price: 'Бесплатно от 300 000 сум' },
  { name: 'Самарканд', time: '3–5 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Бухара', time: '3–6 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Андижан', time: '3–5 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Фергана', time: '3–5 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Наманган', time: '3–5 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Навои', time: '4–6 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Карши', time: '4–6 рабочих дней', price: 'Бесплатно от 500 000 сум' },
  { name: 'Нукус', time: '5–7 рабочих дней', price: 'Бесплатно от 700 000 сум' },
  { name: 'Термез', time: '5–7 рабочих дней', price: 'Бесплатно от 700 000 сум' },
  { name: 'Ургенч', time: '5–7 рабочих дней', price: 'Бесплатно от 700 000 сум' },
];

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Доставка и оплата</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Доставка и оплата</h1>

      {/* Delivery types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '🚚', title: 'Курьерская доставка', desc: 'Доставим прямо до вашей двери. Курьер позвонит за 30 минут до приезда.' },
          { icon: '🏪', title: 'Самовывоз', desc: 'Заберите заказ из нашего пункта выдачи в удобное для вас время.' },
          { icon: '📦', title: 'Почта Узбекистана', desc: 'Доставка в отдалённые районы через Почту Узбекистана.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Regions table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-10">
        <div className="bg-red-600 text-white px-6 py-4">
          <h2 className="font-bold text-lg">Сроки и стоимость доставки по регионам</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Регион</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Срок доставки</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((r, i) => (
                <tr key={r.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="px-6 py-3 text-gray-600">{r.time}</td>
                  <td className="px-6 py-3 text-green-600 font-medium">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Способы оплаты</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: '💳', title: 'Банковская карта', desc: 'Visa, MasterCard, Uzcard, Humo' },
          { icon: '💵', title: 'Наличными', desc: 'При получении заказа курьеру' },
          { icon: '📱', title: 'Click / Payme', desc: 'Оплата через мобильные приложения' },
          { icon: '🏦', title: 'Рассрочка 0%', desc: 'До 24 месяцев без переплат' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Installment */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Рассрочка 0%</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Оформите рассрочку прямо на сайте без визита в банк. Нужен только паспорт и банковская карта.
          Срок рассрочки — до 24 месяцев, без пени за просрочку.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', text: 'Выберите товар и нажмите «В рассрочку»' },
            { step: '2', text: 'Введите данные паспорта и карты' },
            { step: '3', text: 'Получите одобрение за 2 минуты' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</span>
              <p className="text-sm text-gray-700">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
