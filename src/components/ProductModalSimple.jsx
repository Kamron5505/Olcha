import { useState, useEffect } from 'react';
import { getProductById, normalizeProduct } from '../services/api/olchaApi';
import { useCartContext } from '../context/CartContext';

function formatPrice(price) {
  if (!price) return '0';
  return Number(price).toLocaleString('ru-RU');
}

export default function ProductModalSimple({ productId, isOpen, onClose }) {
  const { addItem } = useCartContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      console.log('ProductModalSimple: Loading product', productId);
      setLoading(true);
      // Для теста создаем mock продукт
      const mockProduct = {
        id: productId,
        name: 'Тестовый товар ' + productId,
        price: 1000000,
        description: 'Это тестовое описание товара для проверки работы модального окна.',
        image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Test+Product',
        in_stock: true,
        attributes: [
          { name: 'Бренд', value: 'Test Brand' },
          { name: 'Цвет', value: 'Черный' },
          { name: 'Гарантия', value: '12 месяцев' }
        ]
      };
      
      setTimeout(() => {
        setProduct(mockProduct);
        setLoading(false);
        console.log('ProductModalSimple: Product loaded', mockProduct);
      }, 500);
    } else {
      setProduct(null);
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Быстрый просмотр (тест)</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : product ? (
            <div className="space-y-4">
              {/* Image */}
              <div className="bg-gray-50 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              {/* Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)} сум</span>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                
                {product.description && (
                  <p className="text-gray-600 mb-4">{product.description}</p>
                )}
                
                {product.attributes && product.attributes.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Характеристики</h4>
                    <div className="space-y-2">
                      {product.attributes.map((spec, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500">{spec.name}</span>
                          <span className="text-gray-800 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Товар не найден</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Закрыть
            </button>
            
            {product && (
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
              >
                Добавить в корзину
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}