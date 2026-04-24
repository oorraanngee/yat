import React, { useState } from 'react';
import { calcAddition, calcMult, calcDiv, GridCell } from '../../lib/mathUtils';

export const SmartNotepad = () => {
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');
    const [replace, setReplace] = useState('');
    const [caps, setCaps] = useState(false);
    const [eyo, setEyo] = useState(false);
    const [synonyms, setSynonyms] = useState(true);
    const [preReform, setPreReform] = useState(true);
    const [langs, setLangs] = useState(true);

    const getSynonyms = (word: string): string[] => {
        const dict: Record<string, string[]> = {
            'привет': ['hi', 'hello', 'здравствуй', 'привѣтъ', 'прив'],
            'человек': ['личность', 'персона', 'индивид', 'человѣкъ'],
            'работа': ['труд', 'занятие', 'служба', 'дѣло'],
            'ночь': ['нощь', 'night'],
            'слово': ['рѣчь', 'фраза', 'выражение', 'термин', 'понятие', 'словечко'],
        };
        const w = word.toLowerCase();
        return dict[w] || [];
    };

    const toPreReform = (word: string): string => {
        // Very basic mapping
        return word
            .replace(/е/g, 'ѣ')
            .replace(/и/g, 'і')
            .replace(/[ъ]$/g, 'ъ') // Simplified
            .replace(/ф/g, 'ѳ');
    };

    const highlightMatches = () => {
        if (!search || !text) return text;
        let pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const variations = new Set([search]);
        if (eyo) variations.add(search.replace(/[ё]/g, 'е').replace(/[Ё]/g, 'Е'));
        if (synonyms) getSynonyms(search).forEach(s => variations.add(s));
        if (preReform) variations.add(toPreReform(search));
        if (langs) { /* logic for EN/RU if search is one of them */ }

        // Construct Regex
        const flags = caps ? 'g' : 'gi';
        const finalPattern = Array.from(variations)
            .map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        
        try {
            const re = new RegExp(`(${finalPattern})`, flags);
            return text.split(re).map((part, i) => 
                re.test(part) ? <mark key={i} className="bg-yellow-400/50 text-black px-0.5 rounded">{part}</mark> : part
            );
        } catch { return text; }
    };

    const handleReplace = (all = false) => {
        if (!search) return;
        const flags = all ? (caps ? 'g' : 'gi') : (caps ? '' : 'i');
        try {
            const re = new RegExp(search, flags);
            setText(text.replace(re, replace));
        } catch {}
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap text-[10px] text-[#856a54] uppercase font-bold bg-[#1e130c] p-2 border border-[#3d2b20] rounded">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={caps} onChange={e=>setCaps(e.target.checked)} className="accent-[#d4af37] w-3 h-3"/> Регистр</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={eyo} onChange={e=>setEyo(e.target.checked)} className="accent-[#d4af37] w-3 h-3"/> Е/Ё</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={synonyms} onChange={e=>setSynonyms(e.target.checked)} className="accent-[#d4af37] w-3 h-3"/> Синонимы</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={preReform} onChange={e=>setPreReform(e.target.checked)} className="accent-[#d4af37] w-3 h-3"/> Дореформ.</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={langs} onChange={e=>setLangs(e.target.checked)} className="accent-[#d4af37] w-3 h-3"/> Языки</label>
            </div>
            
            <div className="relative">
                <textarea 
                    className="input-field h-64 font-mono text-sm leading-relaxed w-full bg-transparent relative z-10 text-transparent caret-[#f4ecd8]" 
                    placeholder="Начните писать..." 
                    value={text} 
                    onChange={e=>setText(e.target.value)} 
                />
                <div className="absolute inset-0 p-[0.75rem] font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-words text-[#f4ecd8] border border-transparent">
                    {highlightMatches()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">Найти</label>
                    <input className="input-field w-full" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">Заменить на</label>
                    <input className="input-field w-full" value={replace} onChange={e=>setReplace(e.target.value)} />
                </div>
            </div>
            
            <div className="flex gap-4">
                <button onClick={()=>handleReplace()} className="btn-professional flex-1 py-3 uppercase tracking-widest font-bold text-xs">Заменить</button>
                <button onClick={()=>handleReplace(true)} className="btn-professional flex-1 py-3 uppercase tracking-widest font-bold text-xs">Заменить Все</button>
            </div>
        </div>
    );
};

export const ColumnCalc = () => {
    const [vars, setVars] = useState<{name:string, value:string}[]>([{ name: 'x', value: '125' }, { name: 'y', value: '5' }]);
    const [steps, setSteps] = useState([{ id: 1, arg1: 'x', op: '/', arg2: 'y', mode: 'column', resultVar: 'z' }]);
    
    const resolve = (val: string, prevSteps: any[]) => {
        if (!val) return 0;
        const str = String(val).toLowerCase().trim();
        const v = vars.find(x => x.name.toLowerCase() === str);
        if (v) return Number(v.value) || 0;
        
        // Find if any step assigned its result to this name
        const stepWithVar = prevSteps.find(s => s.resultVar && s.resultVar.toLowerCase() === str);
        if (stepWithVar) return stepWithVar.result;

        if (str.startsWith('шаг') || str.startsWith('step')) {
            const num = parseInt(str.replace(/[^0-9]/g, ''));
            if (prevSteps[num-1]) return prevSteps[num-1].result;
        }
        return Number(val) || 0;
    };

    const compSteps: any[] = [];
    steps.forEach((st) => {
        const a = resolve(st.arg1, compSteps);
        const b = resolve(st.arg2, compSteps);
        let result = 0;
        if (st.op === '+') result = a + b;
        if (st.op === '-') result = a - b;
        if (st.op === '*') result = a * b;
        if (st.op === '/') result = b !== 0 ? a / b : 0;
        compSteps.push({ ...st, a, b, result });
    });

    const updateStep = (i: number, k: string, v: string) => {
        const nf = [...steps]; (nf[i] as any)[k] = v; setSteps(nf);
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-6 flex-col md:flex-row items-stretch">
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded md:w-1/3 text-sm flex flex-col gap-2">
                    <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-[10px] mb-2 flex justify-between items-center">
                        Таблица переменных
                        <button onClick={()=>setVars([...vars, {name:'z', value:'0'}])} className="text-xl text-[#856a54] hover:text-[#d4af37]">+</button>
                    </h4>
                    {vars.map((v, i) => (
                        <div key={i} className="flex gap-2">
                            <input className="input-field w-1/3 !p-1 text-center" value={v.name} onChange={e=>{const nv=[...vars]; nv[i].name=e.target.value; setVars(nv);}} />
                            <span className="text-[#856a54] self-center">=</span>
                            <input type="number" className="input-field grow !p-1 text-center" value={v.value} onChange={e=>{const nv=[...vars]; nv[i].value=e.target.value; setVars(nv);}} />
                            <button onClick={()=>{const nv=[...vars]; nv.splice(i,1); setVars(nv);}} className="text-red-500/50 hover:text-red-500 font-bold px-1">×</button>
                        </div>
                    ))}
                    <p className="text-[10px] text-[#856a54] mt-2 leading-tight italic">Вводите эти имена в поля аргументов ниже (например <b>x</b>).</p>
                </div>
                
                <div className="flex flex-col gap-4 grow">
                    <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-[10px] mb-2">Ход Решения</h4>
                    {compSteps.map((st, i) => {
                        let resGrid: GridCell[][] = [];
                        if (st.op === '+') resGrid = calcAddition(st.a, st.b, '+');
                        if (st.op === '-') resGrid = calcAddition(st.a, st.b, '-');
                        if (st.op === '*') resGrid = calcMult(st.a, st.b);
                        if (st.op === '/') resGrid = calcDiv(st.a, st.b);
                        
                        return (
                            <div key={i} className="flex flex-col gap-2 bg-[#1e130c]/50 p-3 border border-[#3d2b20] rounded relative group">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <span className="text-[#856a54] font-mono text-[10px] w-12 font-bold select-all">Шаг {i+1}</span>
                                    <input className="input-field w-20 text-center !p-1 font-mono text-[#d4af37]" value={st.arg1} onChange={e=>updateStep(i, 'arg1', e.target.value)}/>
                                    <select className="input-field w-12 text-center !p-1 bg-[#1e130c]" value={st.op} onChange={e=>updateStep(i, 'op', e.target.value)}>
                                        <option>+</option><option>-</option><option>*</option><option>/</option>
                                    </select>
                                    <input className="input-field w-20 text-center !p-1 font-mono text-[#d4af37]" value={st.arg2} onChange={e=>updateStep(i, 'arg2', e.target.value)}/>
                                    <div className="flex items-center gap-2 border-l border-[#3d2b20] pl-2 ml-2">
                                        <select className="input-field text-[10px] !p-1" value={st.mode} onChange={e=>updateStep(i, 'mode', e.target.value)}>
                                            <option value="column">Столбиком</option>
                                            <option value="normal">Обычный</option>
                                        </select>
                                        <span className="text-[#856a54] text-[10px]">=</span>
                                        <input className="input-field w-12 !p-1 text-[10px] text-center" placeholder="Перем" value={st.resultVar} onChange={e=>updateStep(i, 'resultVar', e.target.value)} />
                                    </div>
                                </div>
                                
                                {st.mode === 'column' ? (
                                    <div className="bg-[#f4ecd8] border border-[#c5b48e] rounded p-6 overflow-auto mt-2 shadow-inner" style={{
                                        backgroundImage: `linear-gradient(rgba(139,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.15) 1px, transparent 1px)`,
                                        backgroundSize: `24px 24px`, backgroundPosition: `0px 0px`
                                    }}>
                                        <div className="inline-flex flex-col">
                                            {resGrid.map((row, rI) => (
                                                <div key={rI} className="flex h-[24px]">
                                                    {row.map((cell, cI) => (
                                                        <div key={cI} className={`w-[24px] h-[24px] flex items-center justify-center font-mono text-[17px] font-bold text-[#2c1e14] ${cell.bb ? 'border-b-[3px] border-black/70' : ''} ${cell.bl ? 'border-l-[3px] border-black/70' : ''} ${cell.bt ? 'border-t-[3px] border-black/70' : ''} ${cell.br ? 'border-r-[3px] border-black/70' : ''}`}>
                                                            {cell.char}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-[#1e130c] border border-[#3d2b20] rounded mt-2 text-center">
                                        <p className="text-[#d4af37] font-mono text-xl">{st.a} {st.op} {st.b} = {st.result}</p>
                                    </div>
                                )}
                                
                                <button onClick={()=>{const ns=[...steps]; ns.splice(i,1); setSteps(ns);}} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl">×</button>
                            </div>
                        );
                    })}
                    <button onClick={()=>setSteps([...steps, {id: Date.now(), arg1: `Шаг ${steps.length}`, op: '+', arg2: '0', mode: 'column', resultVar: ''}])} className="btn-professional py-3 uppercase border-dashed border-2">Добавить шаг</button>
                </div>
            </div>
        </div>
    );
};
