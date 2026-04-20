import React, { useState, useEffect } from 'react';
import { translateToPreRevolutionary, translateToModern, initDictionary } from '../services/translator';
import { ArrowLeftRight } from 'lucide-react';

export default function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [direction, setDirection] = useState<'toOld' | 'toModern'>('toOld');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize the dictionary in the background when the component mounts
    initDictionary();
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    setError('');
    
    try {
      const result = direction === 'toOld' 
        ? await translateToPreRevolutionary(sourceText)
        : await translateToModern(sourceText);
      setTranslatedText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при переводе.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapDirection = () => {
    const newDir = direction === 'toOld' ? 'toModern' : 'toOld';
    setDirection(newDir);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center mb-8">
        <button 
          onClick={swapDirection}
          className="flex items-center gap-3 px-6 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] rounded-full hover:bg-[#d4af37]/20 transition-all group"
        >
          <span className="text-xs uppercase tracking-widest font-bold">
            {direction === 'toOld' ? 'На дореформенный язык' : 'На современный язык'}
          </span>
          <ArrowLeftRight size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="mb-6 p-3 bg-[rgba(212,175,55,0.03)] border border-[#d4af37]/10 rounded flex items-center justify-center gap-2">
        <span className="text-[#d4af37] opacity-60 text-[10px] uppercase font-bold tracking-[0.2em]">Внимание:</span>
        <p className="text-[#856a54] text-[11px] italic leading-none">
          Перевод может быть не точным. Мы постоянно работаем над улучшением алгоритмов.
        </p>
      </div>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        {/* Source Text */}
        <div className="flex flex-col gap-2 h-[450px]">
          <div className="flex justify-between text-xs uppercase tracking-widest text-[#d4af37] font-bold">
            <span>{direction === 'toOld' ? 'Современный русский' : 'Дореформенный'}</span>
            <span className="opacity-50">ОРИГИНАЛ</span>
          </div>
          <div className="text-area-container flex-grow flex flex-col">
            <textarea 
              className="flex-grow resize-none p-5 bg-transparent text-lg focus:outline-none relative z-10"
              placeholder={direction === 'toOld' ? "Введите текст для перевода..." : "Введите старый текст..."}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>
        </div>

        {/* Translated Text */}
        <div className="flex flex-col gap-2 h-[450px]">
          <div className="flex justify-between text-xs uppercase tracking-widest text-[#d4af37] font-bold">
            <span>{direction === 'toOld' ? 'Дореформенный' : 'Современный русский'}</span>
            <span className="opacity-50">РЕЗУЛЬТАТ</span>
          </div>
          <div className="text-area-container text-area-translated flex-grow flex flex-col">
            <textarea 
              className="flex-grow resize-none p-5 bg-transparent text-lg focus:outline-none relative z-10"
              placeholder="Результат появится здесь..."
              value={translatedText}
              readOnly
            />
          </div>
        </div>

      </main>

      {/* Translate Button */}
      <div className="flex flex-col items-center gap-4 py-8">
        <button 
          className="btn-professional text-sm px-10 py-3"
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
        >
          {isTranslating ? 'Перевод...' : direction === 'toOld' ? 'Перевести на дореформенный язык' : 'Вернуть на современный язык'}
        </button>
        {error && <p className="text-[#8b0000] font-bold bg-[#f4ecd8] px-4 py-1 rounded">{error}</p>}
      </div>

      <div className="mt-4 p-4 border border-[#d4af37]/20 bg-[#2b1d14] rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d4af37]/10 rounded border border-[#d4af37]/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
          <div>
            <p className="text-[#f4ecd8] text-sm font-bold uppercase tracking-widest">Хотите интегрировать наш переводчик?</p>
            <p className="text-[#856a54] text-xs italic">Используйте наш бесплатный API для ваших сайтов и программ.</p>
          </div>
        </div>
        <a href="/api-setup" className="btn-professional text-[10px] uppercase tracking-widest px-4 py-2">Получить API ключ</a>
      </div>
    </div>
  );
}
