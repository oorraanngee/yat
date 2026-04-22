import React, { useState } from 'react';

export const PercentCalc = () => {
    const [z, setZ] = useState<number>(0);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded flex flex-col gap-4">
                <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-2 font-bold">Вычисление доли</label>
                <div className="flex gap-2 items-center text-[#f4ecd8]">Сколько будет <input type="number" className="input-field w-20 px-2 py-1" value={z||''} onChange={e=>setZ(Number(e.target.value))}/> % от числа <input type="number" className="input-field w-24 px-2 py-1" value={x||''} onChange={e=>setX(Number(e.target.value))}/> ?</div>
                <div className="text-[#d4af37] text-xl font-mono">{(x * (z/100)) || 0}</div>
            </div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded flex flex-col gap-4">
                <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-2 font-bold">Вычисление процента</label>
                <div className="flex gap-2 items-center text-[#f4ecd8]">Число <input type="number" className="input-field w-24 px-2 py-1" value={z||''} onChange={e=>setZ(Number(e.target.value))}/> — это сколько % от <input type="number" className="input-field w-24 px-2 py-1" value={x||''} onChange={e=>setX(Number(e.target.value))}/> ?</div>
                <div className="text-[#d4af37] text-xl font-mono">{x ? ((z/x)*100).toFixed(2) : 0} %</div>
            </div>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded flex flex-col gap-4">
                <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-2 font-bold">Разница в процентах</label>
                <div className="flex gap-2 items-center text-[#f4ecd8] flex-wrap">На сколько % число <input type="number" className="input-field w-24 px-2 py-1" value={x||''} onChange={e=>setX(Number(e.target.value))}/> больше/меньше <input type="number" className="input-field w-24 px-2 py-1" value={y||''} onChange={e=>setY(Number(e.target.value))}/> ?</div>
                <div className="text-[#d4af37] text-xl font-mono">{y ? (((x-y)/y)*100).toFixed(2) : 0} %</div>
            </div>
        </div>
    );
};

export const CreditCalc = () => {
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(12);
    const [months, setMonths] = useState(12);
    
    let payment = 0;
    let total = 0;
    let overpayment = 0;
    
    if (amount > 0 && rate > 0 && months > 0) {
        const r = (rate / 100) / 12;
        payment = amount * ((r * Math.pow(1+r, months)) / (Math.pow(1+r, months) - 1));
        total = payment * months;
        overpayment = total - amount;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase font-bold">Сумма кредита (Тело)</label><input type="number" className="input-field" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase font-bold">Ставка (% годовых)</label><input type="number" className="input-field" value={rate} onChange={e=>setRate(Number(e.target.value))} /></div>
                <div className="flex flex-col gap-1"><label className="text-[10px] text-[#856a54] uppercase font-bold">Срок (в месяцах)</label><input type="number" className="input-field" value={months} onChange={e=>setMonths(Number(e.target.value))} /></div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase font-bold">Ежемесячный аннуитетный платеж</p><p className="text-[#d4af37] font-mono text-2xl">{payment.toFixed(2)}</p></div>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase font-bold">Переплата по процентам</p><p className="text-red-500/80 font-mono text-xl">{overpayment.toFixed(2)}</p></div>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase font-bold">Общая сумма выплат</p><p className="text-[#f4ecd8] font-mono text-xl">{total.toFixed(2)}</p></div>
            </div>
        </div>
    );
};

export const TaxCalc = () => {
    const [amount, setAmount] = useState(1000);
    const [taxRate, setTaxRate] = useState(20);
    
    const extractNdS = amount * (taxRate / (100 + taxRate));
    const extractBase = amount - extractNdS;
    
    const addBase = amount;
    const addNds = amount * (taxRate / 100);
    const addTotal = addBase + addNds;
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Сумма для расчета</label>
                    <input type="number" className="input-field w-full" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Ставка НДС</label>
                    <select className="input-field w-32" value={taxRate} onChange={e=>setTaxRate(Number(e.target.value))}><option value={20}>20%</option><option value={10}>10%</option><option value={0}>0%</option></select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[#3d2b20] rounded bg-[#d4af37]/5">
                    <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Выделить НДС (из суммы)</h4>
                    <div className="flex justify-between mb-2 text-sm text-[#856a54]"><span>Сумма без НДС:</span><span className="text-[#f4ecd8] font-mono">{extractBase.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2 text-sm text-[#856a54]"><span>Сама сумма НДС ({taxRate}%):</span><span className="text-[#f4ecd8] font-mono">{extractNdS.toFixed(2)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-[#3d2b20] text-sm text-[#856a54] font-bold"><span>Итого:</span><span className="text-[#f4ecd8] font-mono">{amount}</span></div>
                </div>
                <div className="p-4 border border-[#3d2b20] rounded bg-[#d4af37]/5">
                    <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-xs mb-4">Начислить НДС (на сумму)</h4>
                    <div className="flex justify-between mb-2 text-sm text-[#856a54]"><span>Сумма без НДС:</span><span className="text-[#f4ecd8] font-mono">{addBase.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2 text-sm text-[#856a54]"><span>Сама сумма НДС ({taxRate}%):</span><span className="text-[#f4ecd8] font-mono">{addNds.toFixed(2)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-[#3d2b20] text-sm text-[#856a54] font-bold"><span>Итого с НДС:</span><span className="text-[#f4ecd8] font-mono">{addTotal.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
};
