import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Контакты</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Контакты</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-4">
          {[
            {
              icon: '📞',
              title: 'Телефон',
              lines: ['+998 71 200-00-00', '+998 71 200-00-01'],
              sub: 'Пн–Вс: 9:00 – 22:00',
            },
            {
              icon: '✉️',
              title: 'Email',
              lines: ['info@olcha.uz', 'support@olcha.uz'],
              sub: 'Ответим в течение 24 часов',
            },
            {
              icon: '📍',
              title: 'Адрес',
              lines: ['г. Ташкент, Узбекистан'],
              sub: 'Пункты выдачи по всему городу',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 flex gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                {item.lines.map((l) => (
                  <p key={l} className="text-gray-700 text-sm">{l}</p>
                ))}
                <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Мы в соцсетях</h3>
            <div className="flex gap-3">
              {[
                { name: 'Telegram', color: 'bg-blue-500', href: 'https://t.me/olchashop' },
                { name: 'Instagram', color: 'bg-pink-500', href: 'https://instagram.com/olcha.uz' },
                { name: 'Facebook', color: 'bg-blue-700', href: 'https://facebook.com/olcha.uz' },
                { name: 'YouTube', color: 'bg-red-600', href: 'https://youtube.com/@olcha' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${s.color} text-white text-xs font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Написать нам</h2>
          {sent ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-gray-800 mb-2">Сообщение отправлено!</h3>
              <p className="text-gray-500 text-sm">Мы свяжемся с вами в ближайшее время</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-red-600 text-sm hover:underline"
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Имя"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ваш вопрос или сообщение..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors"
              >
                Отправить
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
