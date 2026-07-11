import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EditProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Если не залогинен — редирект
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Войдите в аккаунт чтобы редактировать профиль</p>
        <Link to="/login" className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors">
          Войти
        </Link>
      </div>
    );
  }

  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    email: user.email || '',
    birthday: user.birthday || '',
    gender: user.gender || '',
    city: user.city || '',
  });
  const [avatar, setAvatar] = useState(user.picture || user.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите имя';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Некорректный email';
    }
    return e;
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const updated = {
      ...user,
      ...form,
      name: form.name.trim(),
      ...(avatar && { picture: avatar }),
    };
    login(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initials = form.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-red-600 transition-colors">Профиль</Link>
        <span>/</span>
        <span className="text-gray-800">Редактировать</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать профиль</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Фото профиля</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Аватар"
                  className="w-20 h-20 rounded-full object-cover border-2 border-red-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-red-100">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                Загрузить фото
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => { setAvatar(null); setAvatarFile(null); }}
                  className="ml-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Удалить
                </button>
              )}
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG до 5 МБ</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Личные данные</h2>

          {/* Name */}
          <Field label="Имя *" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ваше имя"
              className={inputCls(errors.name)}
            />
          </Field>

          {/* Phone */}
          <Field label="Номер телефона">
            <div className="flex">
              <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500">
                🇺🇿 +998
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="90 123 45 67"
                className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors"
              />
            </div>
          </Field>

          {/* Email */}
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@mail.com"
              className={inputCls(errors.email)}
            />
          </Field>

          {/* Birthday */}
          <Field label="Дата рождения">
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              className={inputCls()}
            />
          </Field>

          {/* Gender */}
          <Field label="Пол">
            <div className="flex gap-3">
              {[
                { value: 'male', label: '👨 Мужской' },
                { value: 'female', label: '👩 Женский' },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g.value })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                    form.gender === g.value
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Field>

          {/* City */}
          <Field label="Город">
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputCls()}
            >
              <option value="">Выберите город</option>
              {[
                'Ташкент', 'Самарканд', 'Бухара', 'Андижан',
                'Фергана', 'Наманган', 'Навои', 'Карши',
                'Нукус', 'Термез', 'Ургенч', 'Гулистан',
              ].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Сохранено!
              </>
            ) : 'Сохранить изменения'}
          </button>
          <Link
            to="/profile"
            className="px-6 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold transition-colors text-center"
          >
            Отмена
          </Link>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Выход из аккаунта</h2>
          <p className="text-sm text-gray-500 mb-4">Вы будете перенаправлены на главную страницу</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2.5 rounded-xl transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors bg-white`;
}
