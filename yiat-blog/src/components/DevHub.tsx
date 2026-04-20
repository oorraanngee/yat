import React from 'react';

export default function DevHub() {
  const links = [
    { href: "https://yiat.vercel.app/api-setup", label: "Войти на yiat.vercel.app для API ключа Ять" },
    { href: "https://yiat.vercel.app/api-dashboard/download", label: "Скачать автономный перевод Ять" },
    { href: "https://yiat-blog.vercel.app", label: "Блог проекта" },
    { href: "https://github.com/oorraanngee/yat", label: "Github Ять" },
    { href: "https://yiat.vercel.app/feedback", label: "Обратная связь на yiat.vercel.app" },
    { href: "https://yiat.vercel.app/articles", label: "библиотека Ять включая документацию по Ять" },
    { href: "https://yiat.vercel.app/articles/about", label: "О сайте Ять" },
    { href: "https://yiat.vercel.app/tools", label: "Инструменты Ять" },
    { href: "https://yiat.vercel.app/translator", label: "Переводчик Ять" },
  ];

  return (
    <div className="flex-grow flex flex-col relative z-10 w-full mb-0 md:mb-0 pb-0">
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-[#d4af37] pb-4 mb-8 gap-4 relative z-10">
            <a className="flex items-center gap-5 hover:opacity-90 transition-opacity" href="https://yiat.vercel.app/">
                <div className="logo-icon">Ѣ</div>
                <div>
                    <h1 className="text-4xl md:text-5xl uppercase tracking-[8px] text-[#f4ecd8] mb-[-5px] font-serif">Ять</h1>
                    <p className="italic text-sm text-[#d4af37] opacity-80 font-serif">Навигация проекта</p>
                </div>
            </a>
        </header>

        <div className="flex flex-col gap-4 w-full md:px-8 mb-8 flex-grow items-center justify-center">
            <div className="text-center max-w-2xl mb-8">
                <h2 className="text-3xl font-serif text-[#d4af37] mb-4">Добро пожаловать в Ять</h2>
                <p className="text-lg leading-relaxed opacity-90 text-[#f4ecd8]">
                    Здесь собраны ссылки для доступа ко всем экосистемным проектам, API, блогу и переводчику.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none mt-2">Ять API</h3>
                    <p className="opacity-80 text-xs flex-grow text-[#f4ecd8]">Панель разработчика, ключи и автономная версия.</p>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/api-setup">Войти / API Ключ</a>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/api-dashboard/download">Скачать Перевод</a>
                </div>

                <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none mt-2">Экосистема Ять</h3>
                    <p className="opacity-80 text-xs flex-grow text-[#f4ecd8]">Сайт переводчика, инструменты и база знаний.</p>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/translator">Переводчик</a>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/tools">Инструменты</a>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/articles">Библиотека</a>
                </div>

                <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none mt-2">Дневник Разработки</h3>
                    <p className="opacity-80 text-xs flex-grow text-[#f4ecd8]">Лог разработки и журнал обновлений.</p>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat-blog.vercel.app">Блог Проекта</a>
                </div>
                
                <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none mt-2">Связь & Код</h3>
                    <p className="opacity-80 text-xs flex-grow text-[#f4ecd8]">Код проекта и форма связи.</p>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://github.com/oorraanngee/yat">GitHub Ять</a>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://gwab.vercel.app/">Все Проекты</a>
                    <a className="btn-professional px-8 py-2 mt-2 w-full text-xs text-center" href="https://yiat.vercel.app/feedback">Обратная связь</a>
                </div>
            </div>
        </div>

        <footer className="w-full border-t border-[#d4af37]/30 mt-12 pt-6 pb-2 text-center relative z-10 flex flex-col gap-3">
            <p className="text-[#d4af37] opacity-70 text-sm font-serif w-full flex justify-center">
                © {new Date().getFullYear()} Проект Ять.
            </p>
            <div className="flex justify-center gap-6 text-[10px] md:text-xs uppercase tracking-widest text-[#d4af37] opacity-80 font-bold flex-wrap">
                <a href="https://github.com/oorraanngee/yat" target="_blank" rel="noreferrer" className="hover:text-[#f4ecd8] transition-colors border-b border-transparent hover:border-[#f4ecd8]">GitHub</a>
                <a href="https://gwab.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-[#f4ecd8] transition-colors border-b border-transparent hover:border-[#f4ecd8]">Все проекты</a>
                <a href="https://yiat.vercel.app/feedback" className="hover:text-[#f4ecd8] transition-colors border-b border-transparent hover:border-[#f4ecd8]">Обратная связь</a>
            </div>
        </footer>
    </div>
  );
}

