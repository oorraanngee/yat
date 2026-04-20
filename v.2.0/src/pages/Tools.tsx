import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Scale, MoveRight, Maximize2, Cpu, Hash, Database, 
  Coins, Flame, Calendar, Banknote, Timer, Zap, Activity, Info,
  RefreshCw, DollarSign, Type, Palette, Ruler, Binary, Languages, 
  FileCode, QrCode, Lock, Keyboard, LayoutGrid, Code, Link2 as LinkIcon
} from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  {
    title: 'Популярное и Полезное',
    icon: <Zap className="text-[#d4af37]" />,
    tools: [
      { id: 'calc-std', name: 'Калькулятор', icon: <Calculator size={18} /> },
      { id: 'util-layout', name: 'Раскладка', icon: <Keyboard size={18} /> },
      { id: 'util-cipher', name: 'Шифр', icon: <Lock size={18} /> },
      { id: 'conv-units', name: 'Единицы изм.', icon: <Ruler size={18} /> },
      { id: 'conv-currency', name: 'Валюты', icon: <DollarSign size={18} /> },
      { id: 'calc-dates', name: 'Даты', icon: <Calendar size={18} /> },
      { id: 'conv-colors', name: 'Цвета (HEX/RGB)', icon: <Palette size={18} /> },
    ]
  },
  {
    title: 'Калькуляторы',
    icon: <Calculator className="text-[#d4af37]" />,
    tools: [
      { id: 'calc-weight', name: 'Вес', icon: <Scale size={18} /> },
      { id: 'calc-length', name: 'Длина', icon: <MoveRight size={18} /> },
      { id: 'calc-area', name: 'Площадь', icon: <Maximize2 size={18} /> },
      { id: 'calc-bits', name: 'Биты (1-86)', icon: <Cpu size={18} /> },
      { id: 'calc-systems', name: 'Системы счисления', icon: <Hash size={18} /> },
      { id: 'calc-data', name: 'Объем данных', icon: <Database size={18} /> },
      { id: 'calc-tokens', name: 'Токены', icon: <Coins size={18} /> },
      { id: 'calc-calories', name: 'Калории', icon: <Flame size={18} /> },
      { id: 'calc-salary', name: 'Зарплата', icon: <Banknote size={18} /> },
    ]
  },
  {
    title: 'Физика и Законы',
    icon: <Activity className="text-[#d4af37]" />,
    tools: [
      { id: 'calc-speed', name: 'Скорость/Путь', icon: <Timer size={18} /> },
      { id: 'calc-acceleration', name: 'Ускорение', icon: <Zap size={18} /> },
      { id: 'physics-ohm', name: 'Закон Ома', icon: <Zap size={18} /> },
      { id: 'physics-newton', name: 'II Закон Ньютона', icon: <Info size={18} /> },
      { id: 'physics-torque', name: 'Момент силы', icon: <RefreshCw size={18} /> },
    ]
  },
  {
    title: 'Прочие Конвертеры и Данные',
    icon: <Binary className="text-[#d4af37]" />,
    tools: [
      { id: 'conv-roman', name: 'Римские цифры', icon: <Type size={18} /> },
      { id: 'conv-shoes', name: 'Размер обуви', icon: <Ruler size={18} /> },
      { id: 'conv-rings', name: 'Размер колец', icon: <Ruler size={18} /> },
      { id: 'conv-binary', name: 'В двоичный', icon: <Binary size={18} /> },
      { id: 'translit-pre-en', name: 'Транслит (Дореф/Eng)', icon: <Languages size={18} /> },
      { id: 'translit-ru-en', name: 'Транслит (Rus/Eng)', icon: <Languages size={18} /> },
      { id: 'encoding-base64', name: 'Base64', icon: <FileCode size={18} /> },
      { id: 'encoding-morse', name: 'Азбука Морзе', icon: <Activity size={18} /> },
      { id: 'encoding-unicode', name: 'Unicode коды', icon: <Code size={18} /> },
      { id: 'encoding-url', name: 'URL Параметры', icon: <LinkIcon size={18} /> },
      { id: 'encoding-hash', name: 'Хеши (MD5/SHA)', icon: <Lock size={18} /> },
      { id: 'util-qrcode', name: 'QR Код', icon: <QrCode size={18} /> },
    ]
  }
];

export default function Tools() {
  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl uppercase tracking-[15px] text-[#f4ecd8] mb-4">Инструментарий</h2>
        <p className="text-[#856a54] italic mb-4">Набор полезных сервисов для ежедневной работы</p>
        <Link to="/articles/tools-overview" className="text-[#d4af37] text-xs uppercase tracking-widest hover:underline font-bold">
            Обзор всех инструментов →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => (
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
              {cat.tools.map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/tools/${tool.id}`}
                  className="flex items-center gap-3 p-3 bg-[#1e130c] border border-[#3d2b20] rounded text-[#856a54] hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition-all group"
                >
                  <span className="group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{tool.name}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-10 p-6 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg text-center">
        <p className="text-[#d4af37] text-sm italic">
          Все вычисления производятся локально в вашем браузере. Мы не сохраняем вводимые вами данные.
        </p>
      </div>
    </div>
  );
}
