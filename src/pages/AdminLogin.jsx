import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../services/api/adminApi';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminApi.auth.login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Произошла ошибка при подключении к серверу');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Админ-панель Olcha</h1>
          <p className="text-red-100 mt-1">Управление магазином</p>
        </div>

        {/* Login form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email адрес
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="admin@olcha.uz"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Вход...</span>
                </div>
              ) : 'Войти в админ-панель'}
            </button>
          </form>

          {/* Test credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Тестовые учетные данные:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <code className="font-mono bg-gray-100 px-2 py-1 rounded">admin@olcha.uz</code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Пароль:</span>
                <code className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</code>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Вернуться на сайт
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Olcha.uz • Админ-панель v1.0
          </p>
        </div>
      </div>
    </div>
  );
}