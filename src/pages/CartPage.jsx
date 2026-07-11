import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

function formatPrice(price) {
  if (!price) return '0';
  return Number(price).toLocaleString('ru-RU');
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCartContext();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Корзина пуста</h2>
          <p className="text-gray-500 mb-8">Добавьте товары из каталога, чтобы оформить заказ</p>
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-red-600 transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-gray-800">Корзина</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Корзина <span className="text-gray-400 font-normal text-lg">({totalItems} товаров)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {/* Clear all */}
          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Очистить корзину
            </button>
          </div>

          {items.map((item) => {
            const price = item.price || item.min_price || 0;
            const image = item.image || item.images?.[0]?.image || item.images?.[0] || null;

            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
                {/* Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=?`; }}
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-800 hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </Link>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Qty control */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 text-lg"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(price * item.qty)} сум</p>
                      {item.qty > 1 && (
                        <p className="text-xs text-gray-400">{formatPrice(price)} × {item.qty}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="h-fit">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900">Итого</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Товары ({totalItems} шт.)</span>
                <span>{formatPrice(totalPrice)} сум</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span className="text-green-600 font-medium">Бесплатно</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>К оплате</span>
                <span className="text-red-600">{formatPrice(totalPrice)} сум</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors active:scale-95 text-center"
            >
              Оформить заказ
            </Link>

            <Link
              to="/catalog"
              className="block w-full text-center border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-600 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Продолжить покупки
            </Link>

            {/* Benefits */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Безопасная оплата
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Возврат в течение 14 дней
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Гарантия на все товары
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
