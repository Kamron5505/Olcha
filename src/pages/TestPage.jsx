import { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function TestPage() {
  const [testProducts] = useState([
    {
      id: 1,
      name: 'Тестовый товар 1',
      price: 1000000,
      min_price: 1000000,
      image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Product+1',
      is_new: true,
      installment_price: 100000
    },
    {
      id: 2,
      name: 'Тестовый товар 2',
      price: 2000000,
      old_price: 2500000,
      image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Product+2',
      installment_price: 200000
    },
    {
      id: 3,
      name: 'Тестовый товар 3',
      price: '1 500 000', // Строка с пробелами
      image: null,
      images: [{ image: 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Product+3' }]
    },
    {
      id: 4,
      name: null,
      price: null,
      image: 'broken-image-url'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Тестовая страница</h1>
      <p className="text-gray-600 mb-8">
        Эта страница создана для тестирования компонента ProductCard и модального окна.
        Откройте консоль браузера (F12) для просмотра логов.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {testProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Инструкция по тестированию:</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Откройте консоль браузера (F12 → Console)</li>
          <li>Нажмите на кнопку "👁️ Быстрый просмотр" на любом товаре</li>
          <li>Проверьте, открывается ли модальное окно</li>
          <li>Проверьте, отображаются ли цены (не должны быть "0 сум")</li>
          <li>Проверьте, отображаются ли изображения</li>
          <li>Проверьте логи в консоли для отладки</li>
        </ol>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Ожидаемое поведение:</h3>
          <ul className="list-disc pl-5 text-yellow-700">
            <li>Кнопка "👁️ Быстрый просмотр" должна быть красной и всегда видимой</li>
            <li>При клике должно открываться модальное окно</li>
            <li>Цены должны отображаться с разделителями тысяч (1 000 000 сум)</li>
            <li>Изображения должны отображаться или показывать placeholder</li>
            <li>Названия товаров должны отображаться или "Без названия"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}