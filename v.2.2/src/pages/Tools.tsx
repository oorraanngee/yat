import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Scale, MoveRight, Maximize2, Cpu, Hash, Database, 
  Coins, Flame, Calendar, Banknote, Timer, Zap, Activity, Info,
  RefreshCw, DollarSign, Type, Palette, Ruler, Binary, Languages, 
  FileCode, QrCode, Lock, Keyboard, LayoutGrid, Code, Link2 as LinkIcon,
  AlignLeft, Settings, Clock, CheckSquare, Dices, TextCursorInput, Search
} from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  {
    title: 'Популярное',
    icon: <Flame className="text-[#d4af37]" />,
    tools: [
      { id: 'app-notepad', name: 'Умный блокнот', icon: <AlignLeft size={18} /> },
      { id: 'math-tax', name: 'НДС / Налоги', icon: <Banknote size={18} /> },
      { id: 'calc-tokens', name: 'Токены GPT', icon: <Cpu size={18} /> },
      { id: 'life-fortune', name: 'Колесо Фортуны', icon: <Dices size={18} /> },
      { id: 'text-html', name: 'Текст -> HTML', icon: <FileCode size={18} /> },
      { id: 'util-layout', name: 'Смена раскладки', icon: <Keyboard size={18} /> },
    ]
  },
  {
    title: 'Текст и документы',
    icon: <AlignLeft className="text-[#d4af37]" />,
    tools: [
      { id: 'app-notepad', name: 'Умный блокнот', icon: <AlignLeft size={18} /> },
      { id: 'text-html', name: 'Текст -> HTML', icon: <FileCode size={18} /> },
      { id: 'util-layout', name: 'Смена раскладки', icon: <Keyboard size={18} /> },
      { id: 'text-lorem', name: 'Lorem Ipsum', icon: <Type size={18} /> },
      { id: 'text-icao', name: 'ICAO Транслит', icon: <Languages size={18} /> },
      { id: 'translit-ru-en', name: 'Транслит (Ru->En)', icon: <TextCursorInput size={18} /> },
      { id: 'translit-pre-en', name: 'Транслит (Дор->En)', icon: <TextCursorInput size={18} /> },
      { id: 'text-diff', name: 'Сравнение текста', icon: <Code size={18} /> },
      { id: 'text-extract', name: 'Извлечение (Mail/Url)', icon: <LayoutGrid size={18} /> },
      { id: 'text-readtime', name: 'Счетчик чтения', icon: <Timer size={18} /> },
      { id: 'text-list', name: 'Генератор списков', icon: <LayoutGrid size={18} /> },
      { id: 'text-minify', name: 'Сжатие (JSON/CSS/JS)', icon: <FileCode size={18} /> },
      { id: 'text-syllab', name: 'Слоги / Синонимы', icon: <Languages size={18} /> }
    ]
  },
  {
    title: 'Кодирование и Шифры',
    icon: <Lock className="text-[#d4af37]" />,
    tools: [
      { id: 'encoding-base64', name: 'Base64', icon: <Code size={18} /> },
      { id: 'encoding-hash', name: 'Хеширование (MD5/SHA)', icon: <Hash size={18} /> },
      { id: 'encoding-url', name: 'URL Encoder', icon: <LinkIcon size={18} /> },
      { id: 'encoding-unicode', name: 'Unicode коды', icon: <Hash size={18} /> },
      { id: 'encoding-morse', name: 'Азбука Морзе', icon: <LayoutGrid size={18} /> },
      { id: 'util-cipher', name: 'Простой шифр', icon: <Lock size={18} /> },
      { id: 'conv-binary', name: 'Двоичный код', icon: <Binary size={18} /> },
    ]
  },
  {
    title: 'Время и планирование',
    icon: <Clock className="text-[#d4af37]" />,
    tools: [
      { id: 'calc-dates', name: 'Калькулятор дат', icon: <Calendar size={18} /> },
      { id: 'time-workdays', name: 'Рабочие дни', icon: <Calendar size={18} /> },
      { id: 'time-unix', name: 'Unix Timestamp', icon: <Clock size={18} /> },
      { id: 'time-timecode', name: 'Тайм-коды', icon: <Timer size={18} /> },
      { id: 'time-breakdown', name: 'Отсчет времени', icon: <Clock size={18} /> }
    ]
  },
  {
    title: 'Технические / Разработка',
    icon: <Code className="text-[#d4af37]" />,
    tools: [
      { id: 'dev-uuid', name: 'Генератор UUID', icon: <Hash size={18} /> },
      { id: 'calc-tokens', name: 'Токены GPT', icon: <Cpu size={18} /> },
      { id: 'calc-bits', name: 'Битовая разрядность', icon: <Binary size={18} /> },
      { id: 'calc-systems', name: 'Системы счисления', icon: <Binary size={18} /> },
      { id: 'conv-colors', name: 'Конвертер цветов', icon: <Palette size={18} /> },
      { id: 'dev-jsoncsv', name: 'JSON <-> CSV', icon: <FileCode size={18} /> },
      { id: 'dev-password', name: 'Сила пароля', icon: <Lock size={18} /> },
      { id: 'dev-slug', name: 'ЧПУ (Slug)', icon: <LinkIcon size={18} /> },
      { id: 'dev-htmlescape', name: 'HTML Escape', icon: <Code size={18} /> }
    ]
  },
  {
    title: 'Математика и бизнес',
    icon: <Calculator className="text-[#d4af37]" />,
    tools: [
      { id: 'math-std', name: 'Калькулятор', icon: <Calculator size={18} /> },
      { id: 'math-column', name: 'Калькулятор столбиком', icon: <Calculator size={18} /> },
      { id: 'app-column-calc', name: 'Мат. шагами', icon: <Calculator size={18} /> },
      { id: 'math-percent', name: 'Проценты', icon: <Hash size={18} /> },
      { id: 'math-credit', name: 'Кредит / Ипотека', icon: <Banknote size={18} /> },
      { id: 'conv-currency', name: 'Конвертер валют', icon: <DollarSign size={18} /> },
      { id: 'math-tax', name: 'Калькулятор НДС', icon: <Banknote size={18} /> },
      { id: 'calc-salary', name: 'Зарплата', icon: <Coins size={18} /> },
      { id: 'calc-calories', name: 'Калории (BMR)', icon: <Flame size={18} /> },
    ]
  },
  {
    title: 'Сеть и безопасность',
    icon: <LinkIcon className="text-[#d4af37]" />,
    tools: [
      { id: 'net-whois', name: 'Whois', icon: <LinkIcon size={18} /> },
      { id: 'net-dns', name: 'Проверка DNS', icon: <Database size={18} /> },
      { id: 'net-ip', name: 'Мой IP', icon: <Zap size={18} /> },
      { id: 'net-utm', name: 'Генератор UTM', icon: <LinkIcon size={18} /> },
      { id: 'sys-info', name: 'Инфо о системе', icon: <Info size={18} /> },
      { id: 'sys-file', name: 'Анализатор файла', icon: <FileCode size={18} /> }
    ]
  },
  {
    title: 'Бытовые мелочи',
    icon: <CheckSquare className="text-[#d4af37]" />,
    tools: [
      { id: 'life-fortune', name: 'Колесо Фортуны', icon: <Dices size={18} /> },
      { id: 'life-units', name: 'Старорусские меры', icon: <Scale size={18} /> },
      { id: 'life-phrases', name: 'Генератор фраз', icon: <Hash size={18} /> },
      { id: 'rand-number', name: 'Случ. число', icon: <Dices size={18} /> },
      { id: 'rand-item', name: 'Рандом из списка', icon: <Dices size={18} /> },
      { id: 'rand-dice', name: 'Бросатель кубиков', icon: <Dices size={18} /> },
      { id: 'conv-shoes', name: 'Размеры одежды/обуви', icon: <Ruler size={18} /> },
      { id: 'conv-rings', name: 'Размеры колец', icon: <Ruler size={18} /> },
      { id: 'conv-cooking', name: 'Кулинарные меры', icon: <Scale size={18} /> },
      { id: 'life-checklist', name: 'Чек-лист для поездок', icon: <CheckSquare size={18} /> },
      { id: 'life-kanban', name: 'Канбан доска', icon: <LayoutGrid size={18} /> }
    ]
  },
  {
    title: 'Физика и конвертеры',
    icon: <Activity className="text-[#d4af37]" />,
    tools: [
      { id: 'conv-units', name: 'Единицы измерения', icon: <Ruler size={18} /> },
      { id: 'calc-weight', name: 'Вес / Масса', icon: <Scale size={18} /> },
      { id: 'calc-length', name: 'Длина / Расстояние', icon: <Ruler size={18} /> },
      { id: 'calc-area', name: 'Площадь', icon: <Maximize2 size={18} /> },
      { id: 'calc-data', name: 'Данные (МБ, ГБ)', icon: <Database size={18} /> },
      { id: 'calc-speed', name: 'Скорость/Путь', icon: <Timer size={18} /> },
      { id: 'calc-acceleration', name: 'Ускорение', icon: <Zap size={18} /> },
      { id: 'physics-ohm', name: 'Закон Ома', icon: <Zap size={18} /> },
      { id: 'physics-newton', name: 'II Закон Ньютона', icon: <Info size={18} /> },
      { id: 'physics-torque', name: 'Момент силы', icon: <RefreshCw size={18} /> },
      { id: 'conv-roman', name: 'Римские цифры', icon: <Type size={18} /> },
      { id: 'util-qrcode', name: 'QR Код', icon: <QrCode size={18} /> }
    ]
  }
];

export default function Tools() {
  const [search, setSearch] = useState('');

  const filterTools = (tools: any[]) => {
    return tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl uppercase tracking-[15px] text-[#f4ecd8] mb-4">Инструментарий</h2>
        <p className="text-[#856a54] italic mb-6">Набор полезных сервисов {">"} {categories.reduce((acc, c) => acc + c.tools.length, 0)} инструментов</p>
        
        <div className="max-w-md mx-auto relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d2b20] group-focus-within:text-[#d4af37] transition-colors" size={18} />
          <input 
            className="input-field pl-12 pr-6 py-3 w-full rounded-full transition-all focus:border-[#d4af37]/50"
            placeholder="Поиск инструмента... (напр. ять, токены, НДС)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Link to="/articles/tools-overview" className="text-[#d4af37] text-xs uppercase tracking-widest hover:underline font-bold">
            Гайд по всем инструментам →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((cat, idx) => {
            const filtered = filterTools(cat.tools);
            if (filtered.length === 0) return null;

            return (
              <motion.section 
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-[#3d2b20] pb-3">
                  {cat.icon}
                  <h3 className="text-xl uppercase tracking-widest text-[#f4ecd8]">{cat.title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map(tool => (
                    <Link 
                      key={tool.id} 
                      to={`/tools/${tool.id}`}
                      className="flex items-center gap-3 p-3 bg-[#1e130c] border border-[#3d2b20] rounded text-[#856a54] hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition-all group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{tool.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest leading-tight">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            );
        })}
      </div>

      <div className="mt-10 p-6 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg text-center">
        <p className="text-[#d4af37] text-sm italic">
          Все вычисления производятся локально в вашем браузере. Вы можете использовать их без интернета.
        </p>
      </div>
    </div>
  );
}
