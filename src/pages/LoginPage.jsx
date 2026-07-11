import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEP = { PHONE: 'phone', OTP: 'otp', NAME: 'name' };

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState(STEP.PHONE);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSendOtp(e) {
    e?.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) { setError('Введите корректный номер телефона'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(STEP.OTP);
      startCountdown(60);
    }, 800);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Введите 6-значный код'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (tab === 'register') { setStep(STEP.NAME); }
      else { finishLogin({ name: 'Пользователь', phone }); }
    }, 800);
  }

  function handleFinishRegister(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Введите имя'); return; }
    finishLogin({ name: name.trim(), phone });
  }

  function finishLogin(userData) {
    login({ ...userData, loginMethod: 'phone', loginAt: new Date().toISOString() });
    navigate('/');
  }

  function startCountdown(sec) {
    setCountdown(sec);
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  }

  function handleOtpChange(val, idx) {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...otp]; next[idx] = v; setOtp(next);
    if (v && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  }

  function handleOtpKeyDown(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  }

  function handleOtpPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) { setOtp(text.split('')); e.preventDefault(); }
  }

  function resetToPhone() {
    setStep(STEP.PHONE); setOtp(['', '', '', '', '', '']); setError('');
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-red-600 px-8 py-6 text-center">
          <Link to="/">
            <svg viewBox="0 0 200 60" className="h-9 w-auto mx-auto" fill="none">
              <text x="0" y="50" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="58" fill="white" letterSpacing="-2">olcha</text>
            </svg>
          </Link>
          <p className="text-red-100 text-sm mt-1">Интернет-магазин №1 в Узбекистане</p>
        </div>

        <div className="p-8">
          {step === STEP.PHONE && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
              {['login', 'register'].map((t) => (
                <button key={t} onClick={() => { setTab(t); setError(''); }}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === t ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {t === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>
          )}

          {step === STEP.PHONE && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Номер телефона</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-600 font-medium">🇺🇿 +998</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="90 123 45 67" maxLength={12} autoFocus
                    className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors" />
                </div>
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                {loading && <Spinner />}{loading ? 'Отправка...' : 'Получить код'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link to="/terms" className="text-red-600 hover:underline">условиями</Link>
              </p>
            </form>
          )}

          {step === STEP.OTP && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-bold text-gray-800 text-lg">Введите код</h2>
                <p className="text-sm text-gray-500 mt-1">Код отправлен на <span className="font-medium text-gray-700">+998 {phone}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">Введите любой 6-значный код</p>
              </div>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric"
                    maxLength={1} value={digit} autoFocus={idx === 0}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-colors ${digit ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-400'}`} />
                ))}
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading || otp.join('').length < 6}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                {loading && <Spinner />}{loading ? 'Проверка...' : 'Подтвердить'}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={resetToPhone} className="text-gray-500 hover:text-gray-700">← Изменить номер</button>
                {countdown > 0
                  ? <span className="text-gray-400">Повторить через {countdown}с</span>
                  : <button type="button" onClick={() => { setOtp(['','','','','','']); handleSendOtp(); }} className="text-red-600 hover:underline font-medium">Отправить снова</button>}
              </div>
            </form>
          )}

          {step === STEP.NAME && (
            <form onSubmit={handleFinishRegister} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="font-bold text-gray-800 text-lg">Как вас зовут?</h2>
                <p className="text-sm text-gray-500 mt-1">Введите имя для завершения регистрации</p>
              </div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя" autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors" />
              {error && <ErrorBox message={error} />}
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors">
                Завершить регистрацию
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
