import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Check, Info, QrCode as QrIcon } from 'lucide-react';
import { motion } from 'motion/react';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';

// Imports from new files
import { TextToHtml, LoremIpsum, IcaoTranslit, TextDiff, TextExtract, ReadTime, ListGenerator, TextMinify, SyllablesStressSynonyms } from '../components/tools/TextTools';
import { WorkDays, UnixTime, TimecodeGen, TimeBreakdown } from '../components/tools/TimeTools';
import { UuidGenerator, JsonCsv, PasswordStrength, SlugGen, HtmlEscape } from '../components/tools/DevTools';
import { TokenCalculator, StandaloneColumnCalc, PercentCalc, CreditCalc, TaxCalc } from '../components/tools/MathTools';
import { DummyWhois, DnsCheck, IpInfo, UtmGen } from '../components/tools/NetTools';
import { RandNumber, WheelOfFortune, OldRussianUnits, PhraseGenerator, RandItem, CookingConverter, DiceRoller, SysInfo, FileAnalyzer, TravelChecklist, KanbanBoard } from '../components/tools/LifeTools';
import { SmartNotepad, ColumnCalc } from '../components/tools/AppTools';

// --- TYPES & HELPERS ---
const ToolHeader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3d2b20]">
    <Link to="/tools" className="flex items-center gap-2 text-[#856a54] hover:text-[#d4af37] transition-colors text-xs uppercase tracking-widest font-bold">
      <ArrowLeft size={16} /> Назад
    </Link>
    <h2 className="text-2xl uppercase tracking-widest text-[#f4ecd8] text-right">{name}</h2>
  </div>
);

// --- ORIGINAL COMPONENTS ---

const StdCalculator = () => {
    const [expr, setExpr] = useState('');
    const [result, setResult] = useState('');
    const calc = () => { try { const res = eval(expr.replace(/,/g, '.').replace(/[^-+/*0-9.]/g, '')); setResult(String(res)); } catch { setResult('Ошибка'); } };
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите выражение:</label>
            <input className="input-field text-xl font-mono" placeholder="Пример: 2 + 2 * 2" value={expr} onChange={e => setExpr(e.target.value)} onKeyDown={e => e.key === 'Enter' && calc()} />
            <button onClick={calc} className="btn-professional py-3 uppercase tracking-widest">Вычислить</button>
            {result && (
                <>
                    <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат:</label>
                    <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f4ecd8] text-3xl font-mono text-center">{result}</div>
                </>
            )}
        </div>
    );
};

const BitsCalculator = () => {
    const [bits, setBits] = useState(8);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <label className="text-xs uppercase text-[#d4af37] font-bold">Разрядность (1-86)</label>
                <input type="range" min="1" max="86" value={bits} onChange={e => setBits(Number(e.target.value))} className="flex-grow accent-[#d4af37]"/>
                <span className="text-[#f4ecd8] font-mono w-8">{bits}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[#856a54] text-[10px] uppercase mb-1">Макс. значение (Беззнаковое)</p><p className="text-[#f4ecd8] font-mono break-all">{(BigInt(2)**BigInt(bits) - 1n).toString()}</p></div>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[#856a54] text-[10px] uppercase mb-1">Макс. значение (Знаковое)</p><p className="text-[#f4ecd8] font-mono break-all">{(BigInt(2)**BigInt(bits-1) - 1n).toString()}</p></div>
            </div>
        </div>
    );
};

const SalaryCalculator = () => {
    const [amount, setAmount] = useState(100000);
    const [period, setPeriod] = useState('year');
    const rates = { year: 1, month: 12, week: 52, day: 260, hour: 2080, minute: 124800 };
    const baseYearly = amount * (rates as any)[period];
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Сумма</label>
                    <input type="number" className="input-field w-full" value={amount} onChange={e => setAmount(Number(e.target.value))}/>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Период дохода</label>
                    <select className="input-field w-full" value={period} onChange={e => setPeriod(e.target.value)}><option value="year">В год</option><option value="month">В месяц</option><option value="week">В неделю</option><option value="day">В день</option><option value="hour">В час</option></select>
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Эквивалент:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Object.keys(rates).map(r => <div key={r} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[#856a54] text-[10px] uppercase mb-1">{r}</p><p className="text-[#d4af37] font-mono">{(baseYearly / (rates as any)[r]).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</p></div>)}</div>
        </div>
    );
};

const SystemsCalculator = () => {
    const [val, setVal] = useState('255');
    const [base, setBase] = useState(10);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Значение</label>
                    <input className="input-field font-mono w-full" value={val} onChange={e => setVal(e.target.value)}/>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Исходная СС</label>
                    <select className="input-field w-full" value={base} onChange={e => setBase(Number(e.target.value))}>{[2, 8, 10, 16, 32, 36].map(b => <option key={b} value={b}>Основание {b}</option>)}</select>
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Результат перевода:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[2, 8, 10, 16].map(b => { let res = '---'; try { res = parseInt(val, base).toString(b).toUpperCase(); } catch {} return <div key={b} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[#856a54] text-[10px] uppercase mb-1">Base {b}</p><p className="text-[#f4ecd8] font-mono break-all">{res}</p></div>})}</div>
        </div>
    );
};

const PhysicsLawCalculator = ({ type }: { type: string }) => {
    const [inputs, setInputs] = useState<any>({ u: 220, r: 100, m: 10, a: 9.8, f: 10, d: 2, v: 0, t: 1 });
    const [res, setRes] = useState<any>(null);
    const calculate = () => { let val = 0; if (type === 'physics-ohm') val = inputs.u / inputs.r; if (type === 'physics-newton') val = inputs.m * inputs.a; if (type === 'physics-torque') val = inputs.f * (inputs.d || 1); if (type === 'calc-acceleration') val = inputs.v / inputs.t; setRes(val); };
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                {type === 'physics-ohm' && <><input type="number" className="input-field" placeholder="U" onChange={e => setInputs({...inputs, u: Number(e.target.value)})}/><input type="number" className="input-field" placeholder="R" onChange={e => setInputs({...inputs, r: Number(e.target.value)})}/></>}
                {type === 'physics-newton' && <><input type="number" className="input-field" placeholder="m" onChange={e => setInputs({...inputs, m: Number(e.target.value)})}/><input type="number" className="input-field" placeholder="a" onChange={e => setInputs({...inputs, a: Number(e.target.value)})}/></>}
                {type === 'physics-torque' && <><input type="number" className="input-field" placeholder="F" onChange={e => setInputs({...inputs, f: Number(e.target.value)})}/><input type="number" className="input-field" placeholder="d" onChange={e => setInputs({...inputs, d: Number(e.target.value)})}/></>}
                {type === 'calc-acceleration' && <><input type="number" className="input-field" placeholder="v" onChange={e => setInputs({...inputs, v: Number(e.target.value)})}/><input type="number" className="input-field" placeholder="t" onChange={e => setInputs({...inputs, t: Number(e.target.value)})}/></>}
            </div>
            <button onClick={calculate} className="btn-professional py-3">Вычислить</button>
            {res !== null && <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center text-[#d4af37] text-3xl font-mono">{res.toLocaleString()}</div>}
        </div>
    );
};

const UnitConverter = ({ type }: { type: string }) => {
    const [val, setVal] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const units: Record<string, Record<string, number>> = { length: { 'мм': 0.001, 'см': 0.01, 'м': 1, 'км': 1000, 'дюйм': 0.0254, 'фут': 0.3048 }, weight: { 'г': 0.001, 'кг': 1, 'т': 1000, 'фунт': 0.453592 }, area: { 'м²': 1, 'км²': 1000000, 'га': 10000 }, data: { 'Б': 1, 'КБ': 1024, 'МБ': 1024**2, 'ГБ': 1024**3 }, velocity: { 'м/с': 1, 'км/ч': 1/3.6 }, rings: { 'RU (16)': 16, 'US (7)': 17.3 } };
    const currentUnits = units[type] || units.length;
    const unitList = Object.keys(currentUnits);
    useEffect(() => { setFromUnit(unitList[0]); setToUnit(unitList[1] || unitList[0]); }, [type]);
    const convert = () => setResult((val * currentUnits[fromUnit]) / currentUnits[toUnit]);
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Значение</label>
                    <input type="number" className="input-field w-full" value={val} onChange={e => setVal(Number(e.target.value))}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Из единицы</label>
                    <select className="input-field w-full" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>{unitList.map(u => <option key={u} value={u}>{u}</option>)}</select>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">В единицу</label>
                    <select className="input-field w-full" value={toUnit} onChange={e => setToUnit(e.target.value)}>{unitList.map(u => <option key={u} value={u}>{u}</option>)}</select>
                </div>
            </div>
            <button onClick={convert} className="btn-professional py-3">Конвертировать</button>
            {result !== null && (
                <>
                    <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Результат:</label>
                    <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] text-3xl font-mono">{result.toLocaleString()} {toUnit}</p></div>
                </>
            )}
        </div>
    );
};

const CurrencyConverter = () => {
    const [val, setVal] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('RUB');
    // Extended currencies
    const rates: any = { RUB: 1, USD: 92.5, EUR: 98.2, GBP: 114.3, CNY: 12.8, JPY: 0.6, CHF: 101.5, CAD: 67.8, AUD: 60.1, KZT: 0.2 };
    const res = (val * rates[from]) / rates[to];
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Сумма конвертации</label>
                    <input type="number" className="input-field w-full" value={val} onChange={e => setVal(Number(e.target.value))}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Исходная валюта</label>
                    <select className="input-field w-full" value={from} onChange={e => setFrom(e.target.value)}>{Object.keys(rates).map(k => <option key={k} value={k}>{k}</option>)}</select>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">В какую валюту</label>
                    <select className="input-field w-full" value={to} onChange={e => setTo(e.target.value)}>{Object.keys(rates).map(k => <option key={k} value={k}>{k}</option>)}</select>
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Результат:</label>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] text-3xl font-mono">{res.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} {to}</p></div>
        </div>
    );
};

const CalorieCalculator = () => { // Updated to Harris-Benedict
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [age, setAge] = useState(30);
    const [sex, setSex] = useState('m');
    const bmr = sex === 'm' ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) : 447.59 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Укажите пол</label>
                    <div className="flex gap-2"><button className={`w-full py-2 border ${sex === 'm' ? 'bg-[#d4af37] text-[#1e130c]' : 'text-[#856a54]'}`} onClick={() => setSex('m')}>Муж.</button><button className={`w-full py-2 border ${sex === 'f' ? 'bg-[#d4af37] text-[#1e130c]' : 'text-[#856a54]'}`} onClick={() => setSex('f')}>Жен.</button></div>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Вес (кг)</label>
                    <input type="number" placeholder="Вес (кг)" className="input-field w-full" value={weight} onChange={e => setWeight(Number(e.target.value))}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Рост (см)</label>
                    <input type="number" placeholder="Рост (см)" className="input-field w-full" value={height} onChange={e => setHeight(Number(e.target.value))}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Возраст (лет)</label>
                    <input type="number" placeholder="Возраст" className="input-field w-full" value={age} onChange={e => setAge(Number(e.target.value))}/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#d4af37] uppercase px-1 font-bold">Базовый обмен веществ (BMR):</label>
                <div className="flex-1 p-6 bg-[#1e130c] border border-[#3d2b20] rounded flex flex-col justify-center text-center"><p className="text-[#d4af37] text-4xl font-mono">{Math.round(bmr)}</p><p className="text-[10px] text-[#856a54] mt-2 uppercase">Ккал/день (BMR)</p></div>
            </div>
        </div>
    );
};

const DateCalculator = () => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const diff = d1 && d2 ? Math.abs(new Date(d2).getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24) : 0;
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Начальная дата</label>
                    <input type="date" className="input-field w-full" onChange={e => setD1(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Конечная дата</label>
                    <input type="date" className="input-field w-full" onChange={e => setD2(e.target.value)}/>
                </div>
            </div>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center mt-2"><p className="text-[#f4ecd8] text-4xl font-mono">{Math.round(diff)}</p><p className="text-[#856a54] text-xs uppercase mt-2">Дней разницы</p></div>
        </div>
    );
};

const RomanConverter = () => {
    const [num, setNum] = useState('2024');
    const toRoman = (n: number) => { const map: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }; let res = ''; for (let i in map) { while (n >= map[i]) { res += i; n -= map[i]; } } return res; };
    return (
        <div className="flex flex-col gap-6">
            <div>
                <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Арабские цифры</label>
                <input type="number" className="input-field text-2xl text-center w-full" value={num} onChange={e => setNum(e.target.value)}/>
            </div>
            <div>
                <label className="text-[10px] text-[#d4af37] uppercase px-1 mb-1 block font-bold">Римские цифры</label>
                <div className="p-8 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded text-center text-[#d4af37] text-4xl font-serif tracking-widest">{toRoman(Number(num)) || '—'}</div>
            </div>
        </div>
    );
};

const ColorConverterExt = () => {
    const [hex, setHex] = useState('#d4af37');
    const [rgb, setRgb] = useState({ r: 212, g: 175, b: 55 });
    
    // Convert to HSL/CMYK
    const rL = rgb.r / 255; const gL = rgb.g / 255; const bL = rgb.b / 255;
    const max = Math.max(rL, gL, bL); const min = Math.min(rL, gL, bL);
    let h=0, s=0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) { case rL: h = (gL - bL) / d + (gL < bL ? 6 : 0); break; case gL: h = (bL - rL) / d + 2; break; case bL: h = (rL - gL) / d + 4; break; }
        h /= 6;
    }
    const hsl = `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
    
    const k = 1 - Math.max(rL, gL, bL);
    const c = (1 - rL - k) / (1 - k) || 0; const mC = (1 - gL - k) / (1 - k) || 0; const yC = (1 - bL - k) / (1 - k) || 0;
    const cmyk = `cmyk(${Math.round(c*100)}%, ${Math.round(mC*100)}%, ${Math.round(yC*100)}%, ${Math.round(k*100)}%)`;
    
    const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null; };
    const rgbToHex = (r: number, g: number, b: number) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">HEX Код цвета</label>
                <input className="input-field uppercase font-mono" value={hex} onChange={e => { setHex(e.target.value); const r = hexToRgb(e.target.value); if (r) setRgb(r); }}/>
                <div className="w-full h-24 rounded border border-[#3d2b20]" style={{ backgroundColor: hex }}></div>
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">RGB Значения</label>
                <div className="flex gap-2 w-full">{['r','g','b'].map(cc => <div key={cc} className="relative flex-1"><span className="absolute top-0 right-2 text-[8px] text-[#856a54] uppercase font-bold translate-y-1">{cc}</span><input className="input-field w-full pt-4" value={(rgb as any)[cc]} onChange={e => { const newRgb = { ...rgb, [cc]: Number(e.target.value) }; setRgb(newRgb); setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b)); }}/></div>)}</div>
                <div className="p-2 bg-[#1e130c] border border-[#3d2b20] text-center text-[#f4ecd8] font-mono text-xs mt-2">RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
                <div className="p-2 bg-[#1e130c] border border-[#3d2b20] text-center text-[#f4ecd8] font-mono text-xs">HSL: {hsl}</div>
                <div className="p-2 bg-[#1e130c] border border-[#3d2b20] text-center text-[#f4ecd8] font-mono text-xs">CMYK: {cmyk}</div>
            </div>
        </div>
    );
};

const TextTool = ({ type }: { type: string }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const translit = (text: string) => {
        const ru = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ".split("");
        const en = "a|b|v|g|d|e|e|zh|z|i|y|k|l|m|n|o|p|r|s|t|u|f|h|ts|ch|sh|shch||y||e|yu|ya|Y|Ts|U|K|E|N|G|Sh|Shch|Z|Kh||F|Y|V|A|P|R|O|L|D|Zh|E|Ya|Ch|S|M|I|T||B|Yu".split("|");
        return text.split("").map(c => { const i = ru.indexOf(c); return i !== -1 ? en[i] : c; }).join("");
    };
    const process = () => {
        switch (type) {
            case 'encoding-base64': setOutput(btoa(unescape(encodeURIComponent(input)))); break;
            case 'encoding-morse': 
                const morseMap: Record<string, string> = {
                  'А':'.-', 'Б':'-...', 'В':'.--', 'Г':'--.', 'Д':'-..', 'Е':'.', 'Ё':'.', 
                  'Ж':'...-', 'З':'--..', 'И':'..', 'Й':'.---', 'К':'-.-', 'Л':'.-..', 
                  'М':'--', 'Н':'-.', 'О':'---', 'П':'.--.', 'Р':'.-.', 'С':'...', 
                  'Т':'-', 'У':'..-', 'Ф':'..-.', 'Х':'....', 'Ц':'-.-.', 'Ч':'---.', 
                  'Ш':'----', 'Щ':'--.-', 'Ъ':'--.--', 'Ы':'-.--', 'Ь':'-..-', 'Э':'..-..', 
                  'Ю':'..--', 'Я':'.-.-',
                  'A':'.-', 'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.', 'F':'..-.', 'G':'--.',
                  'H':'....', 'I':'..', 'J':'.---', 'K':'-.-', 'L':'.-..', 'M':'--', 'N':'-.',
                  'O':'---', 'P':'.--.', 'Q':'--.-', 'R':'.-.', 'S':'...', 'T':'-', 'U':'..-',
                  'V':'...-', 'W':'.--', 'X':'-..-', 'Y':'-.--', 'Z':'--..',
                  '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', 
                  '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.',
                  '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '!':'-.-.--', 
                  '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...', 
                  ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '-':'-....-', '_':'..--.-', 
                  '"':'.-..-.', '$':'...-..-', '@':'.--.-.'
                };
                const mRev: Record<string, string> = {};
                for (const k in morseMap) mRev[morseMap[k]] = k;
                
                const val = input.trim();
                if (/^[.\- \n\t]+$/.test(val) && val !== '') {
                    // Decode Morse -> Text. Words are separated by 3 spaces or ' / '. Letters by 1 space.
                    const words = val.split(/   |\/|\n/);
                    setOutput(words.map(w => w.trim().split(/\s+/).map(t => mRev[t] || '?').join('')).join(' '));
                } else {
                    // Encode Text -> Morse.
                    setOutput(val.toUpperCase().split('').map(c => c === ' ' ? '   ' : (morseMap[c] || c)).join(' '));
                }
                break;
            case 'translit-ru-en': setOutput(translit(input)); break;
            case 'translit-pre-en':
                const oldToModernMap: any = { 'і': 'и', 'І': 'И', 'ѣ': 'е', 'Ѣ': 'Е', 'ѳ': 'ф', 'Ѳ': 'Ф', 'ѵ': 'и', 'Ѵ': 'И', 'ъ': '' };
                const modern = input.split('').map(c => oldToModernMap[c] || c).join('');
                setOutput(translit(modern)); break;
            case 'encoding-unicode': setOutput(input.split('').map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join(' ')); break;
            case 'encoding-hash': setOutput(`MD5: ${CryptoJS.MD5(input)}\nSHA-256: ${CryptoJS.SHA256(input)}`); break;
            case 'encoding-url': setOutput(encodeURIComponent(input)); break;
            case 'util-layout':
                const layoutMap: Record<string, string> = {
                  '`': 'ё', '~': 'Ё', '1': '1', '!': '!', '2': '2', '@': '"', '3': '3', '#': '№', '4': '4', '$': ';', '5': '5', '%': '%', '6': '6', '^': ':', '7': '7', '&': '?', '8': '8', '*': '*', '9': '9', '(': '(', '0': '0', ')': ')', '-': '-', '_': '_', '=': '=', '+': '+',
                  'q': 'й', 'Q': 'Й', 'w': 'ц', 'W': 'Ц', 'e': 'у', 'E': 'У', 'r': 'к', 'R': 'К', 't': 'е', 'T': 'Е', 'y': 'н', 'Y': 'Н', 'u': 'г', 'U': 'Г', 'i': 'ш', 'I': 'Ш', 'o': 'щ', 'O': 'Щ', 'p': 'з', 'P': 'З', '[': 'х', '{': 'Х', ']': 'ъ', '}': 'Ъ', '\\': '\\', '|': '/',
                  'a': 'ф', 'A': 'Ф', 's': 'ы', 'S': 'Ы', 'd': 'в', 'D': 'В', 'f': 'а', 'F': 'А', 'g': 'п', 'G': 'П', 'h': 'р', 'H': 'Р', 'j': 'о', 'J': 'О', 'k': 'л', 'K': 'Л', 'l': 'д', 'L': 'Д', ';': 'ж', ':': 'Ж', "'": 'э', '"': 'Э',
                  'z': 'я', 'Z': 'Я', 'x': 'ч', 'X': 'Ч', 'c': 'с', 'C': 'С', 'v': 'м', 'V': 'М', 'b': 'и', 'B': 'И', 'n': 'т', 'N': 'Т', 'm': 'ь', 'M': 'Ь', ',': 'б', '<': 'Б', '.': 'ю', '>': 'Ю', '/': '.', '?': ','
                };
                const reverseMap: Record<string, string> = {};
                for (const k in layoutMap) reverseMap[layoutMap[k]] = k;

                let rCount = 0, eCount = 0;
                for (const ch of input) { 
                    if (/[а-яёА-ЯЁ№]/.test(ch)) rCount++; 
                    else if (/[a-zA-Z]/.test(ch)) eCount++; 
                }
                const toRu = eCount >= rCount;
                
                setOutput(input.split('').map(c => toRu ? (layoutMap[c] || c) : (reverseMap[c] || c)).join('')); 
                break;
            case 'util-cipher':
                setOutput(input.split('').reverse().join('')); break;
        }
    };
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите оригинальный текст (или шифр):</label>
            <textarea className="input-field h-40" placeholder="Пример: привет мир" value={input} onChange={e => setInput(e.target.value)}/>
            <button onClick={process} className="btn-professional py-3 uppercase">Преобразовать</button>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат обработки:</label>
            <div className="relative"><textarea className="w-full input-field h-40 font-mono text-[#d4af37]" readOnly placeholder="Здесь будет результат..." value={output}/><button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-2 right-2 p-2 text-[#856a54] hover:text-[#d4af37]" title="Скопировать"><Copy size={16} /></button></div>
        </div>
    );
};

const QrGenerator = () => {
    const [text, setText] = useState('https://yiat.vercel.app');
    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full">
                <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Текст или ссылка</label>
                <input className="input-field w-full" value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-2xl relative">
                <QRCodeSVG value={text} size={256} />
            </div>
        </div>
    );
};

const ShoeSizeConverter = () => {
    const [size, setSize] = useState(42);
    const [type, setType] = useState('eu');
    const res: any = { eu: size, us: size - 31, uk: size - 31.5, cm: (size + 3) / 1.5, ru: size - 1 };
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Размер</label>
                    <input type="number" className="input-field w-full" value={size} onChange={e => setSize(Number(e.target.value))}/>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Исходный стандарт</label>
                    <select className="input-field w-full" value={type} onChange={e => setType(e.target.value)}><option value="eu">EU</option><option value="us">US</option><option value="uk">UK</option><option value="cm">CM</option><option value="ru">RU</option></select>
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Трансляция размеров:</label>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{Object.keys(res).map(k => <div key={k} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[10px] text-[#856a54] uppercase mb-1">{k}</p><p className="text-[#f4ecd8] text-2xl font-mono">{Number(res[k]).toFixed(1).replace('.0', '')}</p></div>)}</div>
        </div>
    );
};

// --- REGISTRY DEFINITION ---
const toolsMetadata: Record<string, { name: string; component: React.ReactNode }> = {
    // Math & Physics (Original)
    'physics-ohm': { name: 'Закон Ома', component: <PhysicsLawCalculator type="physics-ohm" /> },
    'physics-newton': { name: 'II Закон Ньютона', component: <PhysicsLawCalculator type="physics-newton" /> },
    'physics-torque': { name: 'Момент силы', component: <PhysicsLawCalculator type="physics-torque" /> },
    'calc-acceleration': { name: 'Ускорение', component: <PhysicsLawCalculator type="calc-acceleration" /> },
    'math-std': { name: 'Калькулятор', component: <StdCalculator /> },
    'calc-std': { name: 'Калькулятор', component: <StdCalculator /> },
    'calc-bits': { name: 'Биты (1-86)', component: <BitsCalculator /> },
    'calc-salary': { name: 'Зарплата', component: <SalaryCalculator /> },
    'calc-systems': { name: 'Системы счисления', component: <SystemsCalculator /> },
    'calc-tokens': { name: 'Токены GPT', component: <TokenCalculator /> },
    'calc-calories': { name: 'Калории', component: <CalorieCalculator /> },
    'calc-dates': { name: 'Даты', component: <DateCalculator /> },
    'conv-currency': { name: 'Валюты', component: <CurrencyConverter /> },
    'conv-units': { name: 'Единицы изм.', component: <UnitConverter type="length" /> },
    'conv-shoes': { name: 'Размер обуви / одежды', component: <ShoeSizeConverter /> },
    'conv-rings': { name: 'Размер колец', component: <UnitConverter type="rings" /> },
    'conv-roman': { name: 'Римские цифры', component: <RomanConverter /> },
    'calc-weight': { name: 'Вес / Масса', component: <UnitConverter type="weight" /> },
    'calc-length': { name: 'Длина', component: <UnitConverter type="length" /> },
    'calc-area': { name: 'Площадь', component: <UnitConverter type="area" /> },
    'calc-data': { name: 'Объем данных', component: <UnitConverter type="data" /> },
    'calc-speed': { name: 'Скорость', component: <UnitConverter type="velocity" /> },
    'conv-colors': { name: 'Цветовая палитра', component: <ColorConverterExt /> },
    
    // Tools (Original Text)
    'encoding-base64': { name: 'Base64', component: <TextTool type="encoding-base64" /> },
    'encoding-morse': { name: 'Азбука Морзе', component: <TextTool type="encoding-morse" /> },
    'encoding-hash': { name: 'Хеширование', component: <TextTool type="encoding-hash" /> },
    'encoding-url': { name: 'URL Encoder', component: <TextTool type="encoding-url" /> },
    'encoding-unicode': { name: 'Unicode коды', component: <TextTool type="encoding-unicode" /> },
    'util-layout': { name: 'Смена раскладки', component: <TextTool type="util-layout" /> },
    'util-qrcode': { name: 'QR-код', component: <QrGenerator /> },
    'util-cipher': { name: 'Простой шифр', component: <TextTool type="util-cipher" /> },
    'translit-ru-en': { name: 'Транслит (Rus/Eng)', component: <TextTool type="translit-ru-en" /> },
    'translit-pre-en': { name: 'Транслит (Дореф/Eng)', component: <TextTool type="translit-pre-en" /> },
    'conv-binary': { name: 'В двоичный', component: <SystemsCalculator /> },
    
    // 1. Text and Docs
    'text-lorem': { name: 'Генератор Lorem Ipsum', component: <LoremIpsum /> },
    'text-icao': { name: 'ICAO Транслит', component: <IcaoTranslit /> },
    'text-diff': { name: 'Сравнение текста', component: <TextDiff /> },
    'text-extract': { name: 'Извлечение', component: <TextExtract /> },
    'text-readtime': { name: 'Счетчик чтения', component: <ReadTime /> },
    'text-list': { name: 'Генератор списков', component: <ListGenerator /> },
    'text-minify': { name: 'Сжатие Кода', component: <TextMinify /> },
    'text-syllab': { name: 'Слоги, Синонимы, Ударение', component: <SyllablesStressSynonyms /> },
    
    // 2. Time
    'time-workdays': { name: 'Рабочие дни', component: <WorkDays /> },
    'time-unix': { name: 'Unix Timestamp', component: <UnixTime /> },
    'time-timecode': { name: 'Тайм-коды', component: <TimecodeGen /> },
    'time-breakdown': { name: 'Отсчет времени', component: <TimeBreakdown /> },
    
    // 3. Tech and Dev
    'dev-uuid': { name: 'Генератор UUID', component: <UuidGenerator /> },
    'dev-jsoncsv': { name: 'JSON <-> CSV', component: <JsonCsv /> },
    'dev-password': { name: 'Надежность пароля', component: <PasswordStrength /> },
    'dev-slug': { name: 'ЧПУ генератор', component: <SlugGen /> },
    'dev-htmlescape': { name: 'HTML Escape', component: <HtmlEscape /> },
    
    // 4. Math and Business
    'math-percent': { name: 'Проценты', component: <PercentCalc /> },
    'math-credit': { name: 'Ипотека / Кредит', component: <CreditCalc /> },
    'math-tax': { name: 'Калькулятор НДС', component: <TaxCalc /> },
    
    // 5. Net and Security
    'net-whois': { name: 'Whois домена', component: <DummyWhois /> },
    'net-dns': { name: 'DNS Инфо', component: <DnsCheck /> },
    'net-ip': { name: 'Мой IP', component: <IpInfo /> },
    'net-utm': { name: 'UTM Генератор', component: <UtmGen /> },
    
    // 6. Life and Misc
    'rand-number': { name: 'Рандомайзер чисел', component: <RandNumber /> },
    'rand-item': { name: 'Случайный элемент', component: <RandItem /> },
    'conv-cooking': { name: 'Кулинарные меры', component: <CookingConverter /> },
    'rand-dice': { name: 'Бросатель кубиков (Dice)', component: <DiceRoller /> },
    'sys-info': { name: 'Системная информация', component: <SysInfo /> },
    'sys-file': { name: 'Анализатор файла', component: <FileAnalyzer /> },
    'life-fortune': { name: 'Колесо Фортуны', component: <WheelOfFortune /> },
    'life-units': { name: 'Старорусские меры', component: <OldRussianUnits /> },
    'life-phrases': { name: 'Генератор фраз', component: <PhraseGenerator /> },
    'life-checklist': { name: 'Чек-лист для поездок', component: <TravelChecklist /> },
    'life-kanban': { name: 'Канбан доска (Local)', component: <KanbanBoard /> },
    
    // App Tools
    'app-notepad': { name: 'Продвинутый блокнот', component: <SmartNotepad /> },
    'app-column-calc': { name: 'Математика шагами', component: <ColumnCalc /> },
    'math-column': { name: 'Калькулятор столбиком', component: <StandaloneColumnCalc /> },
    'text-html': { name: 'Текст -> HTML (MD)', component: <TextToHtml /> }
};

export default function ToolDetails() {
    const { id } = useParams<{ id: string }>();
    const tool = id ? toolsMetadata[id] : null;

    if (!tool) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#856a54]">
                <h2 className="text-xl uppercase tracking-widest mb-4">Инструмент не найден</h2>
                <Link to="/tools" className="text-[#d4af37] hover:underline uppercase text-xs font-bold tracking-widest">Вернуться к списку</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <ToolHeader name={tool.name} />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tool-card shadow-2xl relative">
                <div className="ornament-mini opacity-20"></div>
                {tool.component}
            </motion.div>
        </div>
    );
}
