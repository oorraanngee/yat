import React, { useState } from 'react';

export const UuidGenerator = () => {
    const [uuids, setUuids] = useState<string[]>([]);
    
    const generate = (count: number) => {
        const res = [];
        for (let i=0; i<count; i++) {
            res.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
                return v.toString(16);
            }));
        }
        setUuids(res);
    };
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <button className="btn-professional flex-1 py-3" onClick={() => generate(1)}>Сгенерировать 1</button>
                <button className="btn-professional flex-1 py-3" onClick={() => generate(5)}>Сгенерировать 5</button>
            </div>
            {uuids.length > 0 && (
                <>
                    <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-2 font-bold">Сгенерированные UUID (v4):</label>
                    <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded font-mono text-[#f4ecd8] text-sm flex flex-col gap-2">
                        {uuids.map(u => <div key={u} className="select-all cursor-pointer hover:text-[#d4af37]">{u}</div>)}
                    </div>
                </>
            )}
        </div>
    );
};

export const JsonCsv = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    
    const toCsv = () => {
        try {
            const arr = JSON.parse(input);
            if (!Array.isArray(arr) || arr.length === 0) throw new Error();
            const keys = Object.keys(arr[0]);
            const res = [keys.join(',')];
            for (let row of arr) {
                res.push(keys.map(k => {
                    let val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
                    if (val.includes(',') || val.includes('"')) val = `"${val.replace(/"/g, '""')}"`;
                    return val;
                }).join(','));
            }
            setOutput(res.join('\n'));
        } catch { setOutput('Ошибка парсинга JSON'); }
    };
    
    const toJson = () => {
        try {
            const lines = input.trim().split('\n');
            if (lines.length < 2) throw new Error();
            const keys = lines[0].split(',').map(s => s.replace(/(^"|"$)/g, '').replace(/""/g, '"'));
            const res = [];
            for (let i=1; i<lines.length; i++) {
                const vals = lines[i].split(',').map(s => s.replace(/(^"|"$)/g, '').replace(/""/g, '"'));
                const obj: any = {};
                keys.forEach((k, idx) => obj[k] = vals[idx] || '');
                res.push(obj);
            }
            setOutput(JSON.stringify(res, null, 2));
        } catch { setOutput('Ошибка парсинга CSV'); }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Входные данные (JSON или CSV):</label>
            <textarea className="input-field h-40" placeholder="Вставьте текст формата JSON массива или CSV таблицы..." value={input} onChange={e => setInput(e.target.value)} />
            <div className="flex gap-4">
                <button onClick={toCsv} className="btn-professional flex-1 py-3">Конвертировать в CSV</button>
                <button onClick={toJson} className="btn-professional flex-1 py-3">Конвертировать в JSON</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат конвертации:</label>
            <textarea className="input-field h-40 font-mono text-[#d4af37]" readOnly placeholder="Здесь будет результат..." value={output} />
        </div>
    );
};

export const PasswordStrength = () => {
    const [pwd, setPwd] = useState('');
    
    let score = 0;
    if (pwd.length > 7) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    const colors = ['bg-red-900', 'bg-red-600', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-green-400'];
    const strength = ['Очень слабый', 'Слабый', 'Нормальный', 'Хороший', 'Надёжный', 'Отличный', 'Непробиваемый'];
    
    return (
        <div className="flex flex-col gap-6">
            <div>
                <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Введите пароль для проверки:</label>
                <input type="text" className="input-field text-center text-xl font-mono w-full" placeholder="Ваш пароль" value={pwd} onChange={e => setPwd(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#856a54] uppercase px-1 font-bold text-center">Оценка надежности:</label>
                <div className="flex gap-1 h-3">
                    {[...Array(6)].map((_, i) => <div key={i} className={`flex-1 rounded-sm transition-colors duration-300 ${i < score ? colors[score] : 'bg-[#1e130c]'}`} />)}
                </div>
                <div className="text-center text-[#d4af37] font-bold uppercase text-xs tracking-widest">{pwd ? strength[score] : '...'}</div>
            </div>
        </div>
    );
};

export const SlugGen = () => {
    const [input, setInput] = useState('');
    const slug = input.toLowerCase()
        .replace(/[а-яё]/g, (c) => {
            const m: any = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya' };
            return m[c] || c;
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Текст или заголовок:</label>
            <input className="input-field w-full" placeholder="Например: Как написать статью?" value={input} onChange={e => setInput(e.target.value)} />
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат (ЧПУ URL-Slug):</label>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded min-h-[56px]"><code className="text-[#d4af37] text-xl break-all">{slug}</code></div>
        </div>
    );
};

export const HtmlEscape = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    
    const escape = () => setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'));
    const unescape = () => setOutput(input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Оригинальный HTML-код или текст:</label>
            <textarea className="input-field h-32 w-full" placeholder="<div class='example'>Текст & код</div>" value={input} onChange={e => setInput(e.target.value)} />
            <div className="flex gap-4">
                <button onClick={escape} className="btn-professional flex-1 py-3 uppercase text-xs tracking-widest font-bold">Превзойди (Escape)</button>
                <button onClick={unescape} className="btn-professional flex-1 py-3 uppercase text-xs tracking-widest font-bold">Восстанови (Unescape)</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат:</label>
            <textarea className="input-field h-32 text-[#d4af37] font-mono w-full" placeholder="Здесь будет обработанный результат" readOnly value={output} />
        </div>
    );
};
