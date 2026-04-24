import React, { useState, useEffect } from 'react';

export const RandNumber = () => {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [res, setRes] = useState<number[]>([]);
    
    const gen = () => {
        if (min > max) return;
        setRes(prev => [Math.floor(Math.random() * (max - min + 1)) + min, ...prev].slice(0, 5));
    };
    
    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4">
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">От (Включительно)</label><input type="number" className="input-field w-24 text-center" value={min} onChange={e=>setMin(Number(e.target.value))}/></div>
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">До (Включительно)</label><input type="number" className="input-field w-24 text-center" value={max} onChange={e=>setMax(Number(e.target.value))}/></div>
            </div>
            <button onClick={gen} className="btn-professional py-3 w-48 uppercase">Сгенерировать</button>
            {res.length > 0 && <div className="text-[5rem] text-[#d4af37] font-mono leading-none">{res[0]}</div>}
            {res.length > 1 && <div className="text-[#856a54] font-mono flex gap-4">{res.slice(1).map((n,i) => <span key={i}>{n}</span>)}</div>}
        </div>
    );
};

export const OldRussianUnits = () => {
    const [val, setVal] = useState<number>(1);
    const [unit, setUnit] = useState('верста');
    
    const units: Record<string, number> = {
        'верста': 1066.8,
        'сажень': 2.1336,
        'аршин': 0.7112,
        'вершок': 0.04445,
        'фут': 0.3048,
        'дюйм': 0.0254
    };

    const meters = val * (units[unit] || 0);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <input type="number" className="input-field" value={val} onChange={e=>setVal(Number(e.target.value))} />
                <select className="input-field" value={unit} onChange={e=>setUnit(e.target.value)}>
                    {Object.keys(units).map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                </select>
            </div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
                <p className="text-[10px] text-[#856a54] uppercase font-bold mb-2">В метрической системе:</p>
                <div className="grid grid-cols-2 gap-2 text-[#f4ecd8] font-mono text-sm">
                    <div>Метры: <span className="text-[#d4af37]">{meters.toFixed(4)}</span></div>
                    <div>Км: <span className="text-[#d4af37]">{(meters/1000).toFixed(4)}</span></div>
                    <div>См: <span className="text-[#d4af37]">{(meters*100).toFixed(2)}</span></div>
                    <div>Арш: <span className="text-[#d4af37]">{(meters/units['аршин']).toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
};

export const PhraseGenerator = () => {
    const [length, setLength] = useState(4);
    const [result, setResult] = useState('');
    
    const words = ["слово", "время", "быль", "жизнь", "свет", "душа", "мир", "небо", "земля", "ветер", "огонь", "вода", "путь", "сила", "честь"];

    const generate = () => {
        let p = [];
        for(let i=0; i<length; i++) p.push(words[Math.floor(Math.random()*words.length)]);
        setResult(p.join('-') + Math.floor(Math.random()*100));
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase font-bold">Количество слов: {length}</label>
            <input type="range" min="2" max="8" value={length} onChange={e=>setLength(Number(e.target.value))} className="accent-[#d4af37]" />
            <button onClick={generate} className="btn-professional py-3 uppercase text-xs font-bold">Создать фразу</button>
            {result && <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-[#d4af37] font-mono text-center select-all">{result}</div>}
        </div>
    );
};

export const WheelOfFortune = () => {
    const [options, setOptions] = useState(['Да', 'Нет', 'Может быть', 'Завтра', 'Никогда']);
    const [newOpt, setNewOpt] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);
        const extraDegrees = Math.floor(Math.random() * 360) + 1440;
        const newRotation = rotation + extraDegrees;
        setRotation(newRotation);
        
        setTimeout(() => {
            setSpinning(false);
            const actualDegree = newRotation % 360;
            const sectorDegree = 360 / options.length;
            const index = Math.floor((360 - actualDegree) / sectorDegree) % options.length;
            setResult(options[index]);
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="relative w-64 h-64 overflow-visible">
                <div className="absolute top-0 left-1/2 -ml-2 -mt-4 w-4 h-8 bg-red-500 z-20" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
                <div 
                    className="w-full h-full rounded-full border-4 border-[#3d2b20] relative overflow-hidden transition-transform duration-[3000ms] ease-out"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        background: `conic-gradient(${options.map((_, i) => `${i % 2 === 0 ? '#1e130c' : '#3d2b20'} ${i * (360/options.length)}deg ${(i+1) * (360/options.length)}deg`).join(', ')})`
                    }}
                >
                    {options.map((opt, i) => (
                        <div 
                            key={i} 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-[#d4af37] w-full text-center"
                            style={{ transform: `translate(-50%, -50%) rotate(${(i * (360/options.length)) + (180/options.length)}deg) translateY(-80px)` }}
                        >
                            <span className="inline-block" style={{ transform: 'rotate(-90deg)' }}>{opt}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={spin} disabled={spinning} className="btn-professional w-full py-4 uppercase font-black text-sm tracking-widest disabled:opacity-50">
                {spinning ? 'Крутим...' : 'Испытать судьбу'}
            </button>

            {result && <div className="text-2xl font-bold text-[#d4af37] animate-bounce">Результат: {result}</div>}

            <div className="w-full space-y-2 mt-4">
                <div className="flex gap-2">
                    <input className="input-field flex-1" value={newOpt} onChange={e=>setNewOpt(e.target.value)} placeholder="Добавить вариант..." onKeyDown={e=>e.key==='Enter' && (setOptions([...options, newOpt]), setNewOpt(''))}/>
                    <button onClick={()=>{if(newOpt){setOptions([...options, newOpt]); setNewOpt('');}}} className="px-4 bg-[#3d2b20] text-[#d4af37] rounded">+</button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-auto p-2">
                    {options.map((opt, i) => (
                        <span key={i} className="text-[10px] bg-[#1e130c] border border-[#3d2b20] text-[#856a54] px-2 py-1 rounded flex items-center gap-2">
                            {opt} <button onClick={()=>setOptions(options.filter((_, idx)=>idx!==i))} className="text-red-500 hover:text-red-400">×</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const RandItem = () => {
    const [input, setInput] = useState('Орел\nРешка');
    const [res, setRes] = useState('');
    
    const pick = () => {
        const items = input.split('\n').filter(i => i.trim() !== '');
        if (items.length > 0) setRes(items[Math.floor(Math.random() * items.length)]);
    };
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Список элементов:</label>
            <textarea className="input-field h-32" placeholder="Элементы (каждый с новой строки)" value={input} onChange={e=>setInput(e.target.value)} />
            <button onClick={pick} className="btn-professional py-3 uppercase">Выбрать случайный</button>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Случайный результат:</label>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded min-h-[100px] flex items-center justify-center text-center">
                <span className="text-[#d4af37] text-2xl uppercase tracking-widest">{res || '...'}</span>
            </div>
        </div>
    );
};

export const CookingConverter = () => {
    const [val, setVal] = useState(1);
    const [type, setType] = useState('water');
    const [from, setFrom] = useState('cup250');
    
    // Grams in 1 full unit
    const db: any = {
        water: { name: 'Вода / Молоко', glass250: 250, spoon_table: 15, spoon_tea: 5 },
        flour: { name: 'Мука', glass250: 160, spoon_table: 25, spoon_tea: 8 },
        sugar: { name: 'Сахар', glass250: 200, spoon_table: 25, spoon_tea: 8 },
        salt: { name: 'Соль', glass250: 320, spoon_table: 30, spoon_tea: 10 },
        oil: { name: 'Масло растит.', glass250: 230, spoon_table: 17, spoon_tea: 5 }
    };
    const c = db[type];
    const grams = val * (from === 'g' ? 1 : c[from]);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Количество</label>
                    <input type="number" className="input-field w-full" value={val} onChange={e=>setVal(Number(e.target.value))} />
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Мера</label>
                    <select className="input-field w-full" value={from} onChange={e=>setFrom(e.target.value)}><option value="glass250">Стакан (250мл)</option><option value="spoon_table">Ст. ложка</option><option value="spoon_tea">Ч. ложка</option><option value="g">Грамм / Мл</option></select>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Продукт</label>
                    <select className="input-field w-full" value={type} onChange={e=>setType(e.target.value)}>{Object.keys(db).map(k => <option key={k} value={k}>{db[k].name}</option>)}</select>
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Результат в граммах/миллилитрах:</label>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center">
                <p className="text-[#f4ecd8] text-4xl font-mono">{grams}</p>
                <p className="text-[#856a54] text-xs uppercase mt-2">Грамм / Миллилитров</p>
            </div>
        </div>
    );
};

export const DiceRoller = () => {
    const [sides, setSides] = useState(6);
    const [count, setCount] = useState(1);
    const [rolls, setRolls] = useState<number[]>([]);
    
    const roll = () => {
        const r = [];
        for(let i=0; i<count; i++) r.push(Math.floor(Math.random() * sides) + 1);
        setRolls(r);
    };
    
    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4">
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">Грани (Тип куба)</label><select className="input-field w-32" value={sides} onChange={e=>setSides(Number(e.target.value))}><option value={4}>4 (D4)</option><option value={6}>6 (D6)</option><option value={8}>8 (D8)</option><option value={10}>10 (D10)</option><option value={12}>12 (D12)</option><option value={20}>20 (D20)</option><option value={100}>100 (D100)</option></select></div>
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">Количество</label><input type="number" min="1" max="100" className="input-field w-24 text-center" value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
            </div>
            <button onClick={roll} className="btn-professional py-3 w-48 uppercase font-bold tracking-widest">Бросить кубы</button>
            {rolls.length > 0 && (
                <div className="flex flex-col items-center mt-4">
                    <p className="text-[#856a54] uppercase text-[10px] mb-2 cursor-pointer font-bold tracking-widest text-center">Отдельно: {rolls.join(' + ')}</p>
                    <div className="text-[4rem] text-[#d4af37] font-mono leading-none" title="Сумма броска">{rolls.reduce((a,b)=>a+b, 0)}</div>
                </div>
            )}
        </div>
    );
};

export const SysInfo = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Браузер (UserAgent)</p><p className="text-[#f4ecd8] font-mono text-xs break-words">{navigator.userAgent}</p></div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Разрешение экрана</p><p className="text-[#d4af37] font-mono text-xl">{window.screen.width} × {window.screen.height}</p></div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Платформа</p><p className="text-[#f4ecd8] font-mono text-lg">{navigator.platform}</p></div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Язык</p><p className="text-[#f4ecd8] font-mono text-lg">{navigator.language}</p></div>
        </div>
    );
};

export const FileAnalyzer = () => {
    const [file, setFile] = useState<File | null>(null);
    return (
        <div className="flex flex-col gap-6">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-4 font-bold">Выберите файл для анализа:</label>
            <div className="border-2 border-dashed border-[#3d2b20] p-8 text-center rounded relative hover:bg-[#1e130c] transition-colors">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
                <p className="text-[#856a54] pointer-events-none uppercase tracking-widest">{file ? file.name : 'Нажмите или перетащите файл сюда'}</p>
            </div>
            {file && (
                <>
                    <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Свойства файла:</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Размер</p><p className="text-[#d4af37] font-mono">{(file.size / 1024 / 1024).toFixed(3)} MB</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Тип MIME</p><p className="text-[#f4ecd8] font-mono">{file.type || 'Неизвестен'}</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded col-span-2"><p className="text-[10px] text-[#856a54] uppercase mb-1">Дата изменения</p><p className="text-[#f4ecd8] font-mono">{new Date(file.lastModified).toLocaleString()}</p></div>
                    </div>
                </>
            )}
        </div>
    );
};

export const TravelChecklist = () => {
    const defaultList = [
        { id: 1, text: 'Паспорт / Документы', done: false }, { id: 2, text: 'Билеты', done: false },
        { id: 3, text: 'Деньги / Карты', done: false }, { id: 4, text: 'Зарядка для телефона', done: false },
        { id: 5, text: 'Аптечка (базовая)', done: false }, { id: 6, text: 'Зубная щетка / паста', done: false },
        { id: 7, text: 'Белье / Носки', done: false }, { id: 8, text: 'Обувь (удобная)', done: false }
    ];
    
    // Attempt local storage
    const [items, setItems] = useState<{id:number,text:string,done:boolean}[]>(() => {
        try { const j = localStorage.getItem('yat_travel'); if (j) return JSON.parse(j); } catch{}
        return defaultList;
    });
    const [newItem, setNewItem] = useState('');
    
    useEffect(() => { localStorage.setItem('yat_travel', JSON.stringify(items)); }, [items]);
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Добавить вещь в список:</label>
            <div className="flex gap-2">
                <input className="input-field flex-grow" placeholder="Название вещи (например: Паспорт)" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && newItem.trim()) { setItems([{id:Date.now(), text:newItem, done:false}, ...items]); setNewItem(''); }}} />
                <button className="btn-professional px-4 uppercase font-bold tracking-widest" onClick={()=>{ if(newItem.trim()) { setItems([{id:Date.now(), text:newItem, done:false}, ...items]); setNewItem(''); }}}>Добавить</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Ваш список вещей (сохраняется в браузере):</label>
            <div className="flex flex-col gap-2 p-4 bg-[#1e130c] border border-[#3d2b20] rounded max-h-[400px] overflow-auto shadow-inner mt-2">
                {items.map(i => (
                    <div key={i.id} className="flex gap-3 items-center p-2 hover:bg-[#2b1d14] rounded group border border-transparent hover:border-[#3d2b20] transition-colors">
                        <input type="checkbox" checked={i.done} onChange={()=>setItems(items.map(it=>it.id===i.id?{...it,done:!it.done}:it))} className="accent-[#d4af37] w-4 h-4 cursor-pointer" />
                        <span className={`flex-grow cursor-pointer ${i.done ? 'line-through text-[#856a54]' : 'text-[#f4ecd8]'}`} onClick={()=>setItems(items.map(it=>it.id===i.id?{...it,done:!it.done}:it))}>{i.text}</span>
                        <button onClick={()=>setItems(items.filter(it=>it.id!==i.id))} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 uppercase text-[10px] font-bold tracking-widest">Удал.</button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center text-[#856a54] italic text-sm py-4">Список пуст</p>}
            </div>
            <button onClick={()=>setItems(defaultList)} className="text-[#856a54] hover:text-[#d4af37] text-[10px] uppercase tracking-widest text-right mt-2 transition-colors">Сбросить к стандарту</button>
        </div>
    );
};

export const KanbanBoard = () => {
    const init = { todo: [], progress: [], done: [] };
    const [cols, setCols] = useState<{todo:string[], progress:string[], done:string[]}>(() => {
        try { const j = localStorage.getItem('yat_kanban'); if (j) return JSON.parse(j); } catch{}
        return init;
    });
    
    useEffect(() => { localStorage.setItem('yat_kanban', JSON.stringify(cols)); }, [cols]);
    
    const addTask = (c: keyof typeof cols) => {
        const t = prompt('Новая задача:');
        if (t) setCols({...cols, [c]: [...cols[c], t]});
    };
    
    const move = (cFrom: keyof typeof cols, i: number, cTo: keyof typeof cols) => {
        const item = cols[cFrom][i];
        const nFrom = [...cols[cFrom]]; nFrom.splice(i, 1);
        const nTo = [...cols[cTo], item];
        setCols({...cols, [cFrom]: nFrom, [cTo]: nTo});
    };
    
    const del = (c: keyof typeof cols, i: number) => {
        const nf = [...cols[c]]; nf.splice(i, 1);
        setCols({...cols, [c]: nf});
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['todo', 'progress', 'done'] as const).map(c => (
                <div key={c} className="bg-[#1e130c] border border-[#3d2b20] rounded p-4 flex flex-col gap-3 min-h-[300px]">
                    <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs flex justify-between items-center">
                        {c === 'todo' ? 'Задачи' : c === 'progress' ? 'В работе' : 'Готово'}
                        <button onClick={()=>addTask(c)} className="text-xl leading-none text-[#856a54] hover:text-[#d4af37]">+</button>
                    </h4>
                    {cols[c].map((item, idx) => (
                        <div key={idx} className="bg-[#2b1d14] p-3 rounded text-sm text-[#f4ecd8] border border-[#3d2b20] flex flex-col gap-2 relative group">
                            <span className="pr-4">{item}</span>
                            <div className="flex justify-between mt-2 pt-2 border-t border-[#3d2b20] opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={()=>del(c, idx)} className="text-red-500/50 hover:text-red-500 text-[10px] uppercase">Удал.</button>
                                <div className="flex gap-2">
                                    {c !== 'todo' && <button onClick={()=>move(c, idx, c==='done'?'progress':'todo')} className="text-[#856a54] hover:text-[#d4af37] text-[10px] uppercase">←</button>}
                                    {c !== 'done' && <button onClick={()=>move(c, idx, c==='todo'?'progress':'done')} className="text-[#856a54] hover:text-[#d4af37] text-[10px] uppercase">→</button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
