import React, { useState } from 'react';

export const SmartNotepad = () => {
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');
    const [replace, setReplace] = useState('');
    const [caps, setCaps] = useState(false);
    const [eyo, setEyo] = useState(false);
    
    // Simplistic highlight simulation (we just show counts due to textarea limitations)
    const preview = () => {
        if (!search) return { count: 0 };
        let source = text;
        let s = search;
        if (!caps) { source = source.toLowerCase(); s = s.toLowerCase(); }
        if (!eyo) { source = source.replace(/[ё]/g, 'е').replace(/[Ё]/g, 'Е'); s = s.replace(/[ё]/g, 'е').replace(/[Ё]/g, 'Е'); }
        
        if (!s) return { count: 0 };
        
        let c = 0, idx = 0;
        while ((idx = source.indexOf(s, idx)) !== -1) { c++; idx += s.length; }
        return { count: c };
    };
    
    const handleReplace = (all=false) => {
        if (!search) return;
        let flags = 'g';
        if (!caps) flags += 'i';
        // Eyo is tough with replace, we keep basic for now
        let sBase = search;
        if (!eyo) sBase = sBase.replace(/[ёе]/g, '[ёеЁЕ]'); 
        
        try {
            const re = new RegExp(sBase, all ? flags : flags.replace('g', ''));
            setText(text.replace(re, replace));
        } catch {}
    };
    
    const { count } = preview();
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Ваш текст:</label>
            <textarea className="input-field h-64 font-mono text-sm leading-relaxed w-full" placeholder="Текст..." value={text} onChange={e=>setText(e.target.value)} />
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Найти и заменить:</label>
            <div className="grid grid-cols-2 gap-4">
                <input className="input-field w-full" placeholder="Найти..." value={search} onChange={e=>setSearch(e.target.value)} />
                <input className="input-field w-full" placeholder="Заменить на..." value={replace} onChange={e=>setReplace(e.target.value)} />
            </div>
            <div className="flex gap-4 flex-wrap text-[#856a54] text-xs uppercase items-center font-bold">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={caps} onChange={e=>setCaps(e.target.checked)} className="accent-[#d4af37] w-4 h-4"/> Чувств. к регистру</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={eyo} onChange={e=>setEyo(e.target.checked)} className="accent-[#d4af37] w-4 h-4"/> Различать Е / Ё</label>
                <span className="flex-grow text-right text-[#d4af37]">Найдено вхождений: {count}</span>
            </div>
            <div className="flex gap-4 mt-2">
                <button onClick={()=>handleReplace()} className="btn-professional flex-1 py-3 uppercase tracking-widest font-bold text-xs">Заменить 1 раз</button>
                <button onClick={()=>handleReplace(true)} className="btn-professional flex-1 py-3 uppercase tracking-widest font-bold text-xs">Заменить Все</button>
            </div>
        </div>
    );
};

export const ColumnCalc = () => {
    const [vars, setVars] = useState<{name:string, value:string}[]>([{ name: 'x', value: '125' }, { name: 'y', value: '5' }]);
    const [steps, setSteps] = useState([{ id: 1, arg1: 'x', op: '/', arg2: 'y' }]);
    
    const resolve = (val: string, prevSteps: any[]) => {
        if (!val) return 0;
        const str = String(val).toLowerCase().trim();
        const v = vars.find(x => x.name.toLowerCase() === str);
        if (v) return Number(v.value) || 0;
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

    type GridCell = { char: string; bb?: boolean; bl?: boolean; bt?: boolean; br?: boolean };

    const renderGridObj = (rows: number, cols: number): GridCell[][] => 
        Array.from({length: rows}, () => Array.from({length: cols}, () => ({ char: '' })));

    const calcAddition = (a: any, b: any, sign: string) => {
        let nA = Number(a), nB = Number(b);
        if(!Number.isInteger(nA) || !Number.isInteger(nB)) return [[{char:a},{char:sign},{char:b},{char:'='},{char:String(nA + (sign==='-'?-nB:nB))}]];
        const sA = String(a), sB = String(b), sR = String(nA + (sign==='-'?-nB:nB));
        const cols = Math.max(sA.length, sB.length + 2, sR.length);
        const grid = renderGridObj(3, cols);
        
        for (let i = 0; i < sA.length; i++) grid[0][cols - sA.length + i].char = sA[i];
        
        grid[1][cols - sB.length - 2].char = sign;
        for (let i = 0; i < sB.length; i++) grid[1][cols - sB.length + i].char = sB[i];
        
        for (let i = cols - sB.length - 2; i < cols; i++) grid[1][i].bb = true;
        
        for (let i = 0; i < sR.length; i++) grid[2][cols - sR.length + i].char = sR[i];
        return grid;
    };

    const calcMult = (a: any, b: any) => {
        let nA = Number(a), nB = Number(b);
        if(!Number.isInteger(nA) || !Number.isInteger(nB)) return [[{char:a},{char:'*'},{char:b},{char:'='},{char:String(nA*nB)}]];
        const sA = String(a), sB = String(b), sR = String(nA * nB);
        const cols = Math.max(sA.length, sB.length + 2, sR.length);
        const rowCount = 2 + (sB.length > 1 ? sB.length + 1 : 1);
        const grid = renderGridObj(rowCount, cols);
        
        for (let i=0; i<sA.length; i++) grid[0][cols - sA.length + i].char = sA[i];
        grid[1][cols - sB.length - 2].char = '×';
        for (let i=0; i<sB.length; i++) grid[1][cols - sB.length + i].char = sB[i];
        for (let i=cols - Math.max(sA.length, sB.length + 2); i<cols; i++) grid[1][i].bb = true;
        
        if (sB.length > 1) {
            let rIdx = 2;
            for (let i = sB.length - 1; i >= 0; i--) {
                let pStr = String(nA * Number(sB[i]));
                let shift = sB.length - 1 - i;
                for(let j=0; j<pStr.length; j++) grid[rIdx][cols - shift - pStr.length + j].char = pStr[j];
                if (i === 0) for(let j=cols - sR.length; j<cols; j++) grid[rIdx][j].bb = true;
                rIdx++;
            }
            for (let i=0; i<sR.length; i++) grid[rowCount-1][cols - sR.length + i].char = sR[i];
        } else {
            for (let i=0; i<sR.length; i++) grid[2][cols - sR.length + i].char = sR[i];
        }
        return grid;
    };

    const calcDiv = (a: any, b: any) => {
        let nA = Number(a), nB = Number(b);
        if(!Number.isInteger(nA) || !Number.isInteger(nB) || nB===0 || nA<0 || nB<0) return [[{char:a},{char:'/'},{char:b},{char:'='},{char:nB?String(nA/nB):'∞'}]];
        const sA = String(a), sB = String(b), sQ = String(Math.floor(nA/nB));
        
        const leftCols = sA.length + 1;
        const rightMax = Math.max(sB.length, sQ.length);
        const cols = leftCols + rightMax;
        
        let rowsArr: GridCell[][] = [];
        let r0 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
        for (let i=0; i<sA.length; i++) r0[i] = { char: sA[i] };
        for (let i=0; i<sB.length; i++) r0[sA.length + i] = { char: sB[i], bl: i===0 };
        rowsArr.push(r0);
        
        let cStr = sA[0]; let idx = 0;
        while(Number(cStr) < nB && idx < sA.length - 1) { idx++; cStr+=sA[idx]; }
        let fSub = Math.floor(Number(cStr)/nB) * nB;
        let sSub = String(fSub);
        
        let r1 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
        let subStart = idx - sSub.length + 1;
        if (subStart > 0) r1[subStart - 1] = { char: '-' };
        for(let i=0; i<sSub.length; i++) r1[subStart + i] = { char: sSub[i], bb: true };
        for(let i=0; i<sQ.length; i++) r1[sA.length + i] = { char: sQ[i], bl: i===0, bt: true };
        rowsArr.push(r1);
        
        let cDiff = Number(cStr) - fSub;
        for(let i=idx+1; i<sA.length; i++) {
            let cValStr = (cDiff === 0 ? '' : String(cDiff)) + sA[i];
            let cValNum = Number(cValStr);
            let offsetV = i - cValStr.length + 1;
            
            let rV = Array.from({length: cols}, () => ({ char: '' } as GridCell));
            for(let j=0; j<cValStr.length; j++) rV[offsetV + j] = { char: cValStr[j] };
            rowsArr.push(rV);
            
            let subVal = Math.floor(cValNum/nB) * nB;
            let sSub2 = String(subVal);
            let rSub2 = Array.from({length: cols}, () => ({ char: '' } as GridCell));
            let subStart2 = i - sSub2.length + 1;
            if(subStart2 > 0) rSub2[subStart2 - 1] = { char: '-' };
            for(let j=0; j<sSub2.length; j++) rSub2[subStart2 + j] = { char: sSub2[j], bb: true };
            rowsArr.push(rSub2);
            
            cDiff = cValNum - subVal;
        }
        
        let rF = Array.from({length: cols}, () => ({ char: '' } as GridCell));
        let sF = String(cDiff);
        let offsetF = sA.length - sF.length;
        for(let i=0; i<sF.length; i++) rF[offsetF + i] = { char: sF[i] };
        rowsArr.push(rF);
        
        return rowsArr;
    };

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
                                </div>
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
                                    {(st.op === '/' && Number.isInteger(st.a) && Number.isInteger(st.b) && st.b !== 0 && st.a % st.b !== 0) && (
                                        <div className="mt-4 text-[#856a54] text-xs font-bold uppercase tracking-widest pl-2">
                                            Остаток / Дробь: {(st.a/st.b).toFixed(5)}
                                        </div>
                                    )}
                                </div>
                                <button onClick={()=>{const ns=[...steps]; ns.splice(i,1); setSteps(ns);}} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl">×</button>
                            </div>
                        );
                    })}
                    <button onClick={()=>setSteps([...steps, {id: Date.now(), arg1: `Шаг ${steps.length}`, op: '+', arg2: '0'}])} className="btn-professional py-3 uppercase border-dashed border-2">Добавить шаг</button>
                </div>
            </div>
        </div>
    );
};
