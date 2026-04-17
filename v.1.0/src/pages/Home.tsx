import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-serif text-[#d4af37] mb-4">Добро пожаловать въ ЯТЬ</h2>
        <p className="text-lg leading-relaxed opacity-90">
          Проектъ «ЯТЬ» — это сборникъ полезныхъ инструментовъ и интересныхъ статей на самыя разныя темы. 
          Отъ дореволюціонной орѳографіи до современныхъ технологій.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-4">
        
        {/* Translator Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <Feather size={48} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest">Переводчикъ</h3>
          <p className="opacity-80 text-sm flex-grow">
            Автоматическій переводъ современнаго русскаго текста въ дореформенную орѳографію съ соблюденіемъ историческихъ правилъ.
          </p>
          <Link to="/translator" className="btn-professional px-8 py-2 mt-2 inline-block">
            Открыть
          </Link>
        </div>

        {/* Articles Card */}
        <div className="glass-sidebar p-8 flex flex-col items-center text-center gap-4 hover:bg-[rgba(255,255,255,0.12)] transition-colors">
          <BookOpen size={48} className="mb-2 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-[#d4af37] uppercase tracking-widest">Статьи</h3>
          <p className="opacity-80 text-sm flex-grow">
            База знаній проекта. Здѣсь собраны статьи по исторіи, правиламъ языка, ИТ-технологіямъ и многому другому.
          </p>
          <Link to="/articles" className="btn-professional px-8 py-2 mt-2 inline-block">
            Читать
          </Link>
        </div>

      </div>

      {/* Dictionaries Section */}
      <section className="w-full max-w-4xl glass-sidebar mt-8 p-6 text-center">
        <h3 className="text-[#d4af37] text-lg uppercase mb-4 font-bold tracking-widest">
          Словари для провѣрки правописанія
        </h3>
        <p className="text-sm opacity-80 mb-6 max-w-2xl mx-auto">
          Если вамъ нужны словари дореволюціонной орѳографіи для интеграціи въ ваши программы (Hunspell, Aspell и другіе), 
          вы можете найти ихъ на сайтѣ нашихъ вдохновителей.
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
