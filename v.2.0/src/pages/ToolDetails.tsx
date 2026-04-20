import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Check, Info, QrCode as QrIcon } from 'lucide-react';
import { motion } from 'motion/react';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';

// --- TYPES & HELPERS ---

const ToolHeader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3d2b20]">
    <Link to="/tools" className="flex items-center gap-2 text-[#856a54] hover:text-[#d4af37] transition-colors text-xs uppercase tracking-widest font-bold">
      <ArrowLeft size={16} /> Назад
    </Link>
    <h2 className="text-2xl uppercase tracking-widest text-[#f4ecd8] text-right">{name}</h2>
  </div>
);

// --- COMPONENTS ---

const StdCalculator = () => {
    const [expr, setExpr] = useState('');
    const [result, setResult] = useState('');
    const calc = () => { 
        try { 
            // eslint-disable-next-line no-eval
            const res = eval(expr.replace(/,/g, '.').replace(/[^-+/*0-9.]/g, ''));
            setResult(String(res));
        } catch { setResult('Ошибка'); } 
    };
    return (
        <div className="flex flex-col gap-4">
            <input 
                className="input-field text-xl font-mono"
                placeholder="2 + 2 * 2"
                value={expr}
                onChange={e => setExpr(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && calc()}
            />
            <button onClick={calc} className="btn-professional py-3 uppercase tracking-widest">Вычислить</button>
            {result && <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f4ecd8] text-3xl font-mono text-center">{result}</div>}
        </div>
    );
};

const BitsCalculator = () => {
    const [bits, setBits] = useState(8);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <label className="text-xs uppercase text-[#d4af37] font-bold">Разрядность (1-86)</label>
                <input 
                    type="range" min="1" max="86" value={bits} 
                    onChange={e => setBits(Number(e.target.value))}
                    className="flex-grow accent-[#d4af37]"
                />
                <span className="text-[#f4ecd8] font-mono w-8">{bits}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
                    <p className="text-[#856a54] text-[10px] uppercase mb-1">Макс. значение (Беззнаковое)</p>
                    <p className="text-[#f4ecd8] font-mono break-all">{(BigInt(2)**BigInt(bits) - 1n).toString()}</p>
                </div>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
                    <p className="text-[#856a54] text-[10px] uppercase mb-1">Макс. значение (Знаковое)</p>
                    <p className="text-[#f4ecd8] font-mono break-all">{(BigInt(2)**BigInt(bits-1) - 1n).toString()}</p>
                </div>
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
                <input type="number" className="input-field grow" value={amount} onChange={e => setAmount(Number(e.target.value))}/>
                <select className="input-field" value={period} onChange={e => setPeriod(e.target.value)}>
                    <option value="year">В год</option>
                    <option value="month">В месяц</option>
                    <option value="week">В неделю</option>
                    <option value="day">В день</option>
                    <option value="hour">В час</option>
                </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(rates).map(r => (
                    <div key={r} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
                        <p className="text-[#856a54] text-[10px] uppercase mb-1">{r}</p>
                        <p className="text-[#d4af37] font-mono">{(baseYearly / (rates as any)[r]).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SystemsCalculator = () => {
    const [val, setVal] = useState('255');
    const [base, setBase] = useState(10);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <input className="input-field font-mono grow" value={val} onChange={e => setVal(e.target.value)}/>
                <select className="input-field" value={base} onChange={e => setBase(Number(e.target.value))}>
                    {[2, 8, 10, 16, 32, 36].map(b => <option key={b} value={b}>Основание {b}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[2, 8, 10, 16].map(b => {
                    let res = '---';
                    try { res = parseInt(val, base).toString(b).toUpperCase(); } catch {}
                    return (
                        <div key={b} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
                            <p className="text-[#856a54] text-[10px] uppercase mb-1">Base {b}</p>
                            <p className="text-[#f4ecd8] font-mono break-all">{res}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PhysicsLawCalculator = ({ type }: { type: string }) => {
    const [inputs, setInputs] = useState<any>({ u: 220, r: 100, m: 10, a: 9.8, f: 10, d: 2, v: 0, t: 1 });
    const [res, setRes] = useState<any>(null);
    const calculate = () => {
        let val = 0;
        if (type === 'physics-ohm') val = inputs.u / inputs.r;
        if (type === 'physics-newton') val = inputs.m * inputs.a;
        if (type === 'physics-torque') val = inputs.f * (inputs.d || 1);
        if (type === 'calc-acceleration') val = inputs.v / inputs.t;
        setRes(val);
    };
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                {type === 'physics-ohm' && (
                  <>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">U (Вольт)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, u: Number(e.target.value)})}/></div>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">R (Ом)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, r: Number(e.target.value)})}/></div>
                  </>
                )}
                {type === 'physics-newton' && (
                  <>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">m (кг)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, m: Number(e.target.value)})}/></div>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">a (м/с²)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, a: Number(e.target.value)})}/></div>
                  </>
                )}
                {type === 'physics-torque' && (
                  <>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">F (Ньютон)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, f: Number(e.target.value)})}/></div>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">d (метр)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, d: Number(e.target.value)})}/></div>
                  </>
                )}
                {type === 'calc-acceleration' && (
                  <>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">v (м/с)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, v: Number(e.target.value)})}/></div>
                    <div><label className="text-[10px] text-[#856a54] uppercase px-1">t (сек)</label><input type="number" className="input-field w-full" onChange={e => setInputs({...inputs, t: Number(e.target.value)})}/></div>
                  </>
                )}
            </div>
            <button onClick={calculate} className="btn-professional py-3 uppercase tracking-widest font-bold">Вычислить</button>
            {res !== null && <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center text-[#d4af37] text-3xl font-mono">{res.toLocaleString('ru-RU', { maximumFractionDigits: 4 })}</div>}
        </div>
    );
};

const UnitConverter = ({ type }: { type: string }) => {
    const [val, setVal] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const units: Record<string, Record<string, number>> = {
        length: { 'мм': 0.001, 'см': 0.01, 'м': 1, 'км': 1000, 'дюйм': 0.0254, 'фут': 0.3048, 'аршин': 0.7112, 'верста': 1066.8 },
        weight: { 'г': 0.001, 'кг': 1, 'т': 1000, 'фунт': 0.453592, 'пуд': 16.3807 },
        area: { 'м²': 1, 'км²': 1000000, 'га': 10000, 'ар': 100, 'акр': 4046.86, 'десятина': 10925.4 },
        data: { 'Б': 1, 'КБ': 1024, 'МБ': 1024**2, 'ГБ': 1024**3, 'ТБ': 1024**4 },
        velocity: { 'м/с': 1, 'км/ч': 1/3.6, 'узел': 0.514444, 'маха': 343 },
        rings: { 'RU (16)': 16, 'RU (17)': 17, 'RU (18)': 18, 'US (6)': 16.5, 'US (7)': 17.3, 'UK (L)': 16.4 }
    };

    const currentUnits = units[type] || units.length;
    const unitList = Object.keys(currentUnits);
    useEffect(() => { setFromUnit(unitList[0]); setToUnit(unitList[1] || unitList[0]); }, [type]);
    const convert = () => setResult((val * currentUnits[fromUnit]) / currentUnits[toUnit]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" className="input-field" value={val} onChange={e => setVal(Number(e.target.value))}/>
                <select className="input-field" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>{unitList.map(u => <option key={u} value={u}>{u}</option>)}</select>
                <select className="input-field" value={toUnit} onChange={e => setToUnit(e.target.value)}>{unitList.map(u => <option key={u} value={u}>{u}</option>)}</select>
            </div>
            <button onClick={convert} className="btn-professional py-3 uppercase tracking-widest">Конвертировать</button>
            {result !== null && (
                <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center">
                    <p className="text-[#856a54] text-xs uppercase mb-2">Результат</p>
                    <p className="text-[#f4ecd8] text-3xl font-mono">{result.toLocaleString('ru-RU', { maximumFractionDigits: 6 })} {toUnit}</p>
                </div>
            )}
        </div>
    );
};

const CurrencyConverter = () => {
    const [val, setVal] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('RUB');
    const rates: any = { RUB: 1, USD: 92.5, EUR: 98.2, GBP: 114.3, CNY: 12.8 };
    const res = (val * rates[from]) / rates[to];
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" className="input-field" value={val} onChange={e => setVal(Number(e.target.value))}/>
                <select className="input-field" value={from} onChange={e => setFrom(e.target.value)}>{Object.keys(rates).map(k => <option key={k} value={k}>{k}</option>)}</select>
                <select className="input-field" value={to} onChange={e => setTo(e.target.value)}>{Object.keys(rates).map(k => <option key={k} value={k}>{k}</option>)}</select>
            </div>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center">
                <p className="text-[#f4ecd8] text-3xl font-mono">{res.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} {to}</p>
                <p className="text-[10px] text-[#856a54] mt-2 italic">Курс условный</p>
            </div>
        </div>
    );
};

const TokenCalculator = () => {
    const [text, setText] = useState('');
    const tokens = text.length > 0 ? Math.ceil(text.length / 3.5) : 0;
    return (
        <div className="flex flex-col gap-4">
            <textarea className="input-field h-40 resize-none" placeholder="Текст..." value={text} onChange={e => setText(e.target.value)}/>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-[#1e130c] rounded border border-[#3d2b20]"><p className="text-[10px] text-[#856a54] uppercase">Символов</p><p className="text-[#f4ecd8] font-mono text-xl">{text.length}</p></div>
                <div className="p-4 bg-[#1e130c] rounded border border-[#3d2b20]"><p className="text-[10px] text-[#856a54] uppercase">Токенов</p><p className="text-[#d4af37] font-mono text-xl">{tokens}</p></div>
            </div>
        </div>
    );
};

const CalorieCalculator = () => {
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [age, setAge] = useState(30);
    const [sex, setSex] = useState('m');
    const bmr = sex === 'm' ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) : 447.59 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <button className={`w-full py-2 rounded border ${sex === 'm' ? 'bg-[#d4af37] text-[#1e130c]' : 'border-[#3d2b20] text-[#856a54]'}`} onClick={() => setSex('m')}>Муж.</button>
                    <button className={`w-full py-2 rounded border ${sex === 'f' ? 'bg-[#d4af37] text-[#1e130c]' : 'border-[#3d2b20] text-[#856a54]'}`} onClick={() => setSex('f')}>Жен.</button>
                </div>
                <input type="number" placeholder="Вес (кг)" className="input-field" value={weight} onChange={e => setWeight(Number(e.target.value))}/><input type="number" placeholder="Рост (см)" className="input-field" value={height} onChange={e => setHeight(Number(e.target.value))}/><input type="number" placeholder="Возраст" className="input-field" value={age} onChange={e => setAge(Number(e.target.value))}/>
            </div>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded flex flex-col justify-center text-center">
                <p className="text-[#d4af37] text-4xl font-mono">{Math.round(bmr)}</p><p className="text-[10px] text-[#856a54] mt-2 uppercase">Ккал/день (BMR)</p>
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
            <div className="grid grid-cols-2 gap-4"><input type="date" className="input-field" onChange={e => setD1(e.target.value)}/><input type="date" className="input-field" onChange={e => setD2(e.target.value)}/></div>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] text-4xl font-mono">{Math.round(diff)}</p><p className="text-[#856a54] text-xs uppercase">Разница в днях</p></div>
        </div>
    );
};

const RomanConverter = () => {
    const [num, setNum] = useState('2024');
    const toRoman = (n: number) => {
        const map: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let res = '';
        for (let i in map) { while (n >= map[i]) { res += i; n -= map[i]; } }
        return res;
    };
    return (
        <div className="flex flex-col gap-6">
            <input type="number" className="input-field text-2xl text-center" value={num} onChange={e => setNum(e.target.value)}/>
            <div className="p-8 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded text-center text-[#d4af37] text-4xl font-serif tracking-widest">{toRoman(Number(num))}</div>
        </div>
    );
};

const ColorConverter = () => {
    const [hex, setHex] = useState('#d4af37');
    const [rgb, setRgb] = useState({ r: 212, g: 175, b: 55 });
    const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null; };
    const rgbToHex = (r: number, g: number, b: number) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4"><label className="text-xs uppercase text-[#d4af37] font-bold">HEX</label><input className="input-field font-mono" value={hex} onChange={e => { setHex(e.target.value); const r = hexToRgb(e.target.value); if (r) setRgb(r); }}/><div className="w-full h-24 rounded border border-[#3d2b20]" style={{ backgroundColor: hex }}></div></div>
            <div className="flex flex-col gap-4"><label className="text-xs uppercase text-[#d4af37] font-bold">RGB</label><div className="flex gap-2">{['r','g','b'].map(c => <input key={c} className="input-field font-mono w-full" value={(rgb as any)[c]} onChange={e => { const newRgb = { ...rgb, [c]: Number(e.target.value) }; setRgb(newRgb); setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b)); }}/>)}</div><div className="p-4 bg-[#1e130c] rounded border border-[#3d2b20]"><code className="text-[#f4ecd8]">rgb({rgb.r}, {rgb.g}, {rgb.b})</code></div></div>
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
                const morse: any = { 'а': '.-', 'б': '-...', 'в': '.--', 'г': '--.', 'д': '-..', 'е': '.', 'ж': '...-', 'з': '--..', 'и': '..', 'й': '.---', 'к': '-.-', 'л': '.-..', 'м': '--', 'н': '-.', 'о': '---', 'п': '.--.', 'р': '.-.', 'с': '...', 'т': '-', 'у': '..-', 'ф': '..-.', 'х': '....', 'ц': '-.-.', 'ч': '---.', 'ш': '----', 'щ': '--.-', 'ы': '-.--', 'ь': '-..-', 'э': '..-..', 'ю': '..--', 'я': '.-.-', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
                setOutput(input.toLowerCase().split('').map(c => morse[c] || c).join(' ')); break;
            case 'translit-ru-en': setOutput(translit(input)); break;
            case 'translit-pre-en':
                const oldToModernMap: any = { 'і': 'и', 'І': 'И', 'ѣ': 'е', 'Ѣ': 'Е', 'ѳ': 'ф', 'Ѳ': 'Ф', 'ѵ': 'и', 'Ѵ': 'И', 'ъ': '' };
                const modern = input.split('').map(c => oldToModernMap[c] || c).join('');
                setOutput(translit(modern)); break;
            case 'encoding-unicode': setOutput(input.split('').map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join(' ')); break;
            case 'encoding-hash': setOutput(`MD5: ${CryptoJS.MD5(input)}\nSHA-256: ${CryptoJS.SHA256(input)}`); break;
            case 'encoding-url': setOutput(encodeURIComponent(input)); break;
            case 'util-layout':
                const ruKey = "йцукенгшщзхъфывапролджэячсмитьбю.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,";
                const enKey = "qwertyuiop[]asdfghjkl;'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?";
                setOutput(input.split('').map(c => { const ri = ruKey.indexOf(c); if(ri !== -1) return enKey[ri]; const ei = enKey.indexOf(c); if(ei !== -1) return ruKey[ei]; return c; }).join('')); break;
            default: setOutput('В разработке');
        }
    };
    return (
        <div className="flex flex-col gap-4">
            <textarea className="input-field h-40 resize-none" placeholder="Входные данные..." value={input} onChange={e => setInput(e.target.value)}/>
            <button onClick={process} className="btn-professional py-3 uppercase tracking-widest">Преобразовать</button>
            <div className="relative"><textarea className="w-full input-field h-40 resize-none text-[#d4af37] font-mono text-sm" value={output} readOnly/><button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-2 right-2 p-2 bg-[#2b1d14] rounded border border-[#3d2b20] text-[#856a54] hover:text-[#d4af37]"><Copy size={16} /></button></div>
        </div>
    );
};

const QrGenerator = () => {
    const [text, setText] = useState('https://yiat.vercel.app');
    return (
        <div className="flex flex-col items-center gap-6"><input className="input-field w-full" value={text} onChange={e => setText(e.target.value)} placeholder="Текст..."/><div className="p-4 bg-white rounded-lg shadow-2xl"><QRCodeSVG value={text} size={256} /></div><p className="text-[#856a54] text-xs italic">Отсканируйте код камерой</p></div>
    );
};

const ShoeSizeConverter = () => {
    const [size, setSize] = useState(42);
    const [type, setType] = useState('eu');
    const res: any = { eu: size, us: size - 31, uk: size - 31.5, cm: (size + 3) / 1.5 };
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4"><input type="number" className="input-field" value={size} onChange={e => setSize(Number(e.target.value))}/><select className="input-field" value={type} onChange={e => setType(e.target.value)}><option value="eu">EU</option><option value="us">US</option><option value="uk">UK</option><option value="cm">CM</option></select></div>
            <div className="grid grid-cols-2 gap-4">{Object.keys(res).map(k => <div key={k} className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[10px] text-[#856a54] uppercase mb-1">{k}</p><p className="text-[#f4ecd8] text-2xl font-mono">{Number(res[k]).toFixed(1)}</p></div>)}</div>
        </div>
    );
};

const CipherTool = () => {
    const [input, setInput] = useState('');
    const [mapStr, setMapStr] = useState('а=я, б=ю, в=э');
    const [output, setOutput] = useState('');
    const apply = () => {
        const rules = mapStr.split(',').map(r => r.trim().split('='));
        const map: any = {};
        rules.forEach(([k, v]) => { if(k && v) map[k.toLowerCase()] = v.toLowerCase(); });
        setOutput(input.toLowerCase().split('').map(c => map[c] || c).join(''));
    };
    return (
        <div className="flex flex-col gap-4">
            <textarea className="input-field h-32 resize-none" placeholder="Текст..." value={input} onChange={e => setInput(e.target.value)}/>
            <div className="flex flex-col gap-1 tracking-widest"><label className="text-[10px] text-[#d4af37] uppercase px-1">Алфавит</label><input className="input-field font-mono text-sm" value={mapStr} onChange={e => setMapStr(e.target.value)}/></div>
            <button onClick={apply} className="btn-professional py-3">Шифровать</button>
            <textarea className="input-field h-32 resize-none text-[#d4af37] font-mono" readOnly value={output}/>
        </div>
    );
};

// --- MAIN PAGE ---

const toolsMetadata: Record<string, { name: string; component: React.ReactNode }> = {
    'physics-ohm': { name: 'Закон Ома', component: <PhysicsLawCalculator type="physics-ohm" /> },
    'physics-newton': { name: 'II Закон Ньютона', component: <PhysicsLawCalculator type="physics-newton" /> },
    'physics-torque': { name: 'Момент силы', component: <PhysicsLawCalculator type="physics-torque" /> },
    'calc-acceleration': { name: 'Ускорение', component: <PhysicsLawCalculator type="physics-acceleration" /> },
    'calc-std': { name: 'Калькулятор', component: <StdCalculator /> },
    'calc-bits': { name: 'Биты (1-86)', component: <BitsCalculator /> },
    'calc-salary': { name: 'Зарплата', component: <SalaryCalculator /> },
    'calc-systems': { name: 'Системы счисления', component: <SystemsCalculator /> },
    'calc-tokens': { name: 'Токены', component: <TokenCalculator /> },
    'calc-calories': { name: 'Калории', component: <CalorieCalculator /> },
    'calc-dates': { name: 'Даты', component: <DateCalculator /> },
    'conv-currency': { name: 'Валюты', component: <CurrencyConverter /> },
    'conv-units': { name: 'Единицы изм.', component: <UnitConverter type="length" /> },
    'conv-shoes': { name: 'Размер обуви', component: <ShoeSizeConverter /> },
    'conv-rings': { name: 'Размер колец', component: <UnitConverter type="rings" /> },
    'conv-roman': { name: 'Римские цифры', component: <RomanConverter /> },
    'calc-weight': { name: 'Вес / Масса', component: <UnitConverter type="weight" /> },
    'calc-length': { name: 'Длина', component: <UnitConverter type="length" /> },
    'calc-area': { name: 'Площадь', component: <UnitConverter type="area" /> },
    'calc-data': { name: 'Объем данных', component: <UnitConverter type="data" /> },
    'calc-speed': { name: 'Скорость', component: <UnitConverter type="velocity" /> },
    'conv-colors': { name: 'Цветовая палитра', component: <ColorConverter /> },
    'encoding-base64': { name: 'Base64', component: <TextTool type="encoding-base64" /> },
    'encoding-morse': { name: 'Азбука Морзе', component: <TextTool type="encoding-morse" /> },
    'encoding-hash': { name: 'Хеширование', component: <TextTool type="encoding-hash" /> },
    'encoding-url': { name: 'URL Encoder', component: <TextTool type="encoding-url" /> },
    'encoding-unicode': { name: 'Unicode коды', component: <TextTool type="encoding-unicode" /> },
    'util-layout': { name: 'Смена раскладки', component: <TextTool type="util-layout" /> },
    'util-qrcode': { name: 'QR-код', component: <QrGenerator /> },
    'util-cipher': { name: 'Шифр', component: <CipherTool /> },
    'translit-ru-en': { name: 'Транслит (Rus/Eng)', component: <TextTool type="translit-ru-en" /> },
    'translit-pre-en': { name: 'Транслит (Дореф/Eng)', component: <TextTool type="translit-pre-en" /> },
    'conv-binary': { name: 'В двоичный', component: <SystemsCalculator /> },
};

export default function ToolDetails() {
    const { id } = useParams<{ id: string }>();
    const tool = id ? toolsMetadata[id] : null;

    if (!tool) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#856a54]">
                <Ban size={48} className="mb-4 opacity-30" />
                <h2 className="text-xl uppercase tracking-widest mb-4">Инструмент не найден</h2>
                <Link to="/tools" className="text-[#d4af37] hover:underline uppercase text-xs font-bold tracking-widest">Вернуться к списку</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <ToolHeader name={tool.name} />
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="tool-card shadow-2xl relative"
            >
                <div className="ornament-mini opacity-20"></div>
                {tool.component}
            </motion.div>
            <div className="mt-8 p-4 bg-[#1e130c] border border-[#d4af37]/20 rounded-lg flex items-start gap-3 shadow-lg">
                <Info size={16} className="text-[#d4af37] mt-1 shrink-0" />
                <p className="text-[#856a54] text-xs italic">
                    Если вам не хватает какого-то функционала или вы нашли ошибку — напишите нам через форму обратной связи в подвале сайта.
                </p>
            </div>
        </div>
    );
}

const Ban = ({ size, className }: { size: number; className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
);
