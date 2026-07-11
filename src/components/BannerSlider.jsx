import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const STATIC_BANNERS = [
  { id: 1, image: 'https://olcha.uz/image/1400x460/sliders/ru/cdn_1/2026-03-26/PXYC8qjBTJRfZvPo07NG90MwPv47mgptqF9yZNPVguwBWqbXAF7nJg5m4xG7.png', url: '/catalog' },
  { id: 2, image: 'https://olcha.uz/image/1400x460/sliders/ru/iuuXk0JufCY1V2d8xp9v6bccNmawQPLy0qVlyoVQrt6d20xLzS4XZR8QyXNg.jpg', url: '/catalog' },
  { id: 3, image: 'https://olcha.uz/image/1400x460/sliders/ru/cdn_1/2026-02-05/4o9LAWRolLHeHsi8r3SflevBTD0Z3VpgfB8TshsRrg50DbfWG9Xwt62rXYtw.jpg', url: '/catalog' },
  { id: 4, image: 'https://olcha.uz/image/1400x460/sliders/ru/cdn_1/2026-02-17/Cgx19DTWjDG7UCKgDvOgODQJwbigYWj3svEITjmgVynLhoY1ylf3zjbKvdZH.jpg', url: '/catalog' },
  { id: 5, image: 'https://olcha.uz/image/1400x460/sliders/ru/cdn_1/2026-02-04/OhqP8k9ewrrZOpgIcfDpF19RHGbxb7btCCllJNvRJIqzqFUYstCbDK3FtZMk.jpg', url: '/catalog' },
  { id: 6, image: 'https://olcha.uz/image/1400x460/sliders/ru/cdn_1/2025-12-18/oNNjhDUhfuKVxH7vYiOy9gR5bIGN6sNPdK7rzRTM6MyvmqZIIGhg1Cn72nbr.jpg', url: '/catalog' },
];

export default function BannerSlider({ banners = [] }) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const slides = STATIC_BANNERS;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Нет баннеров — показываем заглушку
  if (slides.length === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center w-full"
        style={{ height: '360px' }}
      >
        <div className="text-white text-center px-8">
          <p className="text-3xl md:text-4xl font-bold mb-2">Лучшие цены на технику</p>
          <p className="text-lg opacity-80 mb-4">Доставка по всему Узбекистану</p>
          <Link
            to="/catalog"
            className="inline-block bg-white text-red-700 font-bold px-8 py-2.5 rounded-full hover:bg-red-50 transition-colors"
          >
            Смотреть каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-gray-100 select-none w-full"
      style={{ height: '360px' }}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((banner, i) => {
          const img = banner.image || banner.image_url_ru || banner.image_url || '';
          const href = banner.url
            ? banner.url.startsWith('/')
              ? banner.url
              : `/catalog?q=${banner.url}`
            : '/catalog';

          return (
            <div key={banner.id || i} className="min-w-full h-full flex-shrink-0 relative">
              {img && !imgErrors[i] ? (
                <Link to={href} className="block w-full h-full">
                  <img
                    src={img}
                    alt={`Баннер ${i + 1}`}
                    className="w-full h-full object-fill"
                    onError={() =>
                      setImgErrors((e) => ({ ...e, [i]: true }))
                    }
                  />
                </Link>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-red-700 to-red-500 flex items-center justify-center">
                  <div className="text-white text-center px-8">
                    <p className="text-3xl font-bold mb-2">Лучшие цены</p>
                    <p className="text-lg opacity-80">Доставка по всему Узбекистану</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all hover:scale-110 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all hover:scale-110 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
