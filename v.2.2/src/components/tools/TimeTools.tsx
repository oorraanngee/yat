import React, { useState, useEffect } from 'react';

export const WorkDays = () => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    
    const calc = () => {
        if (!d1 || !d2) return 0;
        let start = new Date(d1);
        let end = new Date(d2);
        if (start > end) { const temp = start; start = end; end = temp; }
        
        let count = 0;
        let curr = new Date(start);
        while (curr <= end) {
            const day = curr.getDay();
            if (day !== 0 && day !== 6) count++;
            curr.setDate(curr.getDate() + 1);
        }
        return count;
    };
    
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Начальная дата:</label>
                    <input type="date" className="input-field w-full" value={d1} onChange={e => setD1(e.target.value)} />
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Конечная дата:</label>
                    <input type="date" className="input-field w-full" value={d2} onChange={e => setD2(e.target.value)} />
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-3 font-bold mt-2">Результат (рабочие дни):</label>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center">
                <p className="text-[#f4ecd8] text-4xl font-mono">{calc()}</p>
                <p className="text-[#856a54] text-xs uppercase mt-2">Рабочих дней (без учета праздников)</p>
            </div>
        </div>
    );
};

export const UnixTime = () => {
    const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
    
    const handleUnix = (v: string) => { setUnix(v); try { setDate(new Date(Number(v) * 1000).toISOString().slice(0, 16)); } catch {} };
    const handleDate = (v: string) => { setDate(v); try { setUnix(Math.floor(new Date(v).getTime() / 1000).toString()); } catch {} };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#856a54] uppercase px-1">Unix Timestamp</label>
                <input className="input-field font-mono" value={unix} onChange={e => handleUnix(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#856a54] uppercase px-1">Local Date/Time</label>
                <input type="datetime-local" className="input-field" value={date} onChange={e => handleDate(e.target.value)} />
            </div>
        </div>
    );
};

export const TimecodeGen = () => {
    const [secs, setSecs] = useState<number>(0);
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите количество секунд:</label>
            <input type="number" min="0" className="input-field" placeholder="Например: 3600" value={secs || ''} onChange={e => setSecs(Number(e.target.value))} />
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат генерации (HH:MM:SS):</label>
            <div className="p-6 bg-[#1e130c] border border-[#3d2b20] rounded text-center">
                <p className="text-[#d4af37] text-4xl font-mono">{h}:{m}:{s}</p>
                <p className="text-[#856a54] text-xs uppercase mt-2">Таймкод</p>
            </div>
        </div>
    );
};

export const TimeBreakdown = () => {
    const [target, setTarget] = useState('');
    const [now, setNow] = useState(Date.now());
    
    useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
    
    const diff = target ? Math.abs(new Date(target).getTime() - now) : 0;
    
    return (
        <div className="flex flex-col gap-6">
            <div>
                <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Целевое время (Для отсчета назад/вперед):</label>
                <input type="datetime-local" className="input-field w-full" value={target} onChange={e => setTarget(e.target.value)} />
            </div>
            {target && (
                <>
                    <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-4 font-bold">Отсчет времени (абсолютные цифры):</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] font-mono text-xl">{Math.floor(diff / 1000)}</p><p className="text-[10px] text-[#856a54] uppercase">Секунд</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] font-mono text-xl">{Math.floor(diff / (1000*60))}</p><p className="text-[10px] text-[#856a54] uppercase">Минут</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] font-mono text-xl">{Math.floor(diff / (1000*60*60))}</p><p className="text-[10px] text-[#856a54] uppercase">Часов</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center"><p className="text-[#f4ecd8] font-mono text-xl">{Math.floor(diff / (1000*60*60*24))}</p><p className="text-[10px] text-[#856a54] uppercase">Дней</p></div>
                        <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded text-center lg:col-span-4"><p className="text-[#d4af37] font-mono text-xl">{Math.floor(diff / (1000*60*60*24*365.25))}</p><p className="text-[10px] text-[#856a54] uppercase">Лет</p></div>
                    </div>
                </>
            )}
        </div>
    );
};
