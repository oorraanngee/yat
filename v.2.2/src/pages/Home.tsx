import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, BookOpen, Terminal, LayoutGrid, Dices, Cpu, FileCode, Banknote } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-serif text-[#d4af37] mb-4">Добро пожаловать в Ять</h2>
        <p className="text-lg leading-relaxed opacity-90">
          Проект «Ять» — это сборник полезных инструментов и интересных статей на самые разные темы. 
          От дореволюционной орфографии до современных технологий.
          <br />
          <Link to="/articles/about" className="text-[#d4af37] text-xs uppercase tracking-widest hover:underline mt-2 inline-block font-bold">
            Узнать больше о проекте →
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mt-4">
        
        {/* Translator Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <Feather size={40} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none">Переводчик</h3>
          <p className="opacity-80 text-xs flex-grow">
            Перевод современного русского в дореформенную орфографию с соблюдением исторических правил.
          </p>
          <Link to="/translator" className="btn-professional px-8 py-2 mt-2 w-full text-xs">
            Открыть
          </Link>
        </div>

        {/* Tools Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <LayoutGrid size={40} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none">Инструменты</h3>
          <p className="opacity-80 text-xs flex-grow">
            Десятки калькуляторов и конвертеров: от физических величин до транслитерации и QR-кодов.
          </p>
          <Link to="/tools" className="btn-professional px-8 py-2 mt-2 w-full text-xs text-[#1e130c]">
            Исследовать
          </Link>
        </div>

        {/* Articles Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <BookOpen size={40} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none">Статьи</h3>
          <p className="opacity-80 text-xs flex-grow">
            База знаний проекта: история, правила языка, ИТ-технологии и техническая документация API.
          </p>
          <Link to="/articles" className="btn-professional px-8 py-2 mt-2 w-full text-xs">
            Читать
          </Link>
        </div>

        {/* API Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <Terminal size={40} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest leading-none">Кабинет API</h3>
          <p className="opacity-80 text-xs flex-grow">
            Бесплатный API для разработчиков и возможность скачать автономную версию переводчика.
          </p>
          <Link to="/api-dashboard" className="btn-professional px-8 py-2 mt-2 w-full text-xs">
            Управлять
          </Link>
        </div>
      </div>

      {/* Dictionaries Section */}
      <section className="w-full max-w-4xl glass-sidebar mt-8 p-6 text-center">
        <h3 className="text-[#d4af37] text-lg uppercase mb-4 font-bold tracking-widest">
          Словари для проверки правописания
        </h3>
        <p className="text-sm opacity-80 mb-6 max-w-2xl mx-auto">
          Если вам нужны словари дореволюционной орфографии для интеграции в ваши программы (Hunspell, Aspell и другие), 
          вы можете найти их на сайте наших вдохновителей.
        </p>
        <a 
          href="https://slavenica.com/" 
          target="_blank" 
          rel="noreferrer"
          className="btn-professional px-8 py-2 inline-block"
        >
          Перейти на Славеницу
        </a>
      </section>
    </div>
  );
}
