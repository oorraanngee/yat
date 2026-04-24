import React, { useState } from 'react';

export const DummyWhois = () => {
    const [domain, setDomain] = useState('example.com');
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fetchWhois = async () => {
        setLoading(true);
        try {
            // Using a public JSON RDAP API for domains
            const res = await fetch(`https://rdap.org/domain/${domain}`);
            if (!res.ok) throw new Error('Данные не найдены или домен не поддерживается');
            const json = await res.json();
            setData(JSON.stringify(json, null, 2));
        } catch (e: any) {
            setData(e.message || 'Ошибка получения данных');
        } finally { setLoading(false); }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите проверяемый домен:</label>
            <div className="flex gap-4">
                <input className="input-field grow" placeholder="Пример: example.com" value={domain} onChange={e=>setDomain(e.target.value)} />
                <button onClick={fetchWhois} className="btn-professional px-6 uppercase tracking-widest font-bold">Проверить Whois</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат:</label>
            <textarea className="input-field h-64 font-mono text-[#d4af37] text-xs" readOnly placeholder="Здесь будет результат Whois..." value={loading ? 'Выполняется поиск...' : data} />
        </div>
    );
};

export const DnsCheck = () => {
    const [domain, setDomain] = useState('google.com');
    const [type, setType] = useState('A');
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fetchDns = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
            const json = await res.json();
            if (json.Answer) {
                setData(json.Answer.map((a: any) => `${a.name} IN ${type} ${a.data}`).join('\n'));
            } else {
                setData('Записи не найдены');
            }
        } catch (e) {
            setData('Ошибка DNS запроса');
        } finally { setLoading(false); }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите домен и тип записи:</label>
            <div className="flex gap-4">
                <input className="input-field grow" placeholder="Пример: google.com" value={domain} onChange={e=>setDomain(e.target.value)} />
                <select className="input-field w-32" value={type} onChange={e=>setType(e.target.value)}>
                    <option value="A">A</option><option value="AAAA">AAAA</option><option value="MX">MX</option>
                    <option value="TXT">TXT</option><option value="NS">NS</option><option value="CNAME">CNAME</option>
                </select>
                <button onClick={fetchDns} className="btn-professional px-6 uppercase tracking-widest font-bold">Узнать DNS</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Результат проверки DNS:</label>
            <textarea className="input-field h-40 font-mono text-[#d4af37] text-sm" readOnly placeholder="Нажмите на кнопку чтобы найти записи..." value={loading ? 'Поиск...' : data} />
        </div>
    );
};

export const IpInfo = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const fetchIp = async () => {
        setLoading(true);
        try {
            // Public JSON ipapi
            const res = await fetch('https://ipapi.co/json/');
            const json = await res.json();
            setData(json);
        } catch { setData({ error: 'Ошибка получения IP' }); }
        finally { setLoading(false); }
    };
    
    return (
        <div className="flex flex-col gap-4 items-center">
            <button onClick={fetchIp} className="btn-professional py-3 w-full max-w-sm uppercase">Определить мой IP</button>
            {loading && <p className="text-[#856a54] italic">Определение...</p>}
            {data && !data.error && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Ваш IP</p><p className="text-[#d4af37] font-mono text-2xl">{data.ip}</p></div>
                    <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Провайдер / ASN</p><p className="text-[#f4ecd8] font-mono whitespace-nowrap overflow-hidden text-ellipsis">{data.org} ({data.asn})</p></div>
                    <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Страна</p><p className="text-[#f4ecd8] font-mono">{data.country_name}</p></div>
                    <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded"><p className="text-[10px] text-[#856a54] uppercase mb-1">Город</p><p className="text-[#f4ecd8] font-mono">{data.city}</p></div>
                </div>
            )}
            {data?.error && <p className="text-red-500">{data.error}</p>}
        </div>
    );
};

export const UtmGen = () => {
    const [url, setUrl] = useState('');
    const [source, setSource] = useState('google');
    const [medium, setMedium] = useState('cpc');
    const [campaign, setCampaign] = useState('summer_sale');
    const [term, setTerm] = useState('');
    const [content, setContent] = useState('');
    
    let res = url;
    if (res && source) {
        try {
            const u = new URL(res.startsWith('http') ? res : `https://${res}`);
            u.searchParams.set('utm_source', source);
            if (medium) u.searchParams.set('utm_medium', medium);
            if (campaign) u.searchParams.set('utm_campaign', campaign);
            if (term) u.searchParams.set('utm_term', term);
            if (content) u.searchParams.set('utm_content', content);
            res = u.toString();
        } catch {}
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Целевой URL:</label>
                    <input className="input-field w-full" placeholder="https://example.com/page" value={url} onChange={e=>setUrl(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">UTM_Source (Источник):</label>
                    <input className="input-field w-full" placeholder="google, yandex, fb..." value={source} onChange={e=>setSource(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">UTM_Medium (Тип рекламы):</label>
                    <input className="input-field w-full" placeholder="cpc, email, social..." value={medium} onChange={e=>setMedium(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">UTM_Campaign (Название РК):</label>
                    <input className="input-field w-full" placeholder="promo_sale, spring23..." value={campaign} onChange={e=>setCampaign(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">UTM_Term (Ключевое слово):</label>
                    <input className="input-field w-full" placeholder="купить+чтото" value={term} onChange={e=>setTerm(e.target.value)}/>
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">UTM_Content (Доп. инфа):</label>
                    <input className="input-field w-full" placeholder="banner1, link2..." value={content} onChange={e=>setContent(e.target.value)}/>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-3 font-bold">Сгенерированная ссылка:</label>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded h-full break-all font-mono text-sm text-[#d4af37] select-all">
                    {res || 'Заполните URL...'}
                </div>
            </div>
        </div>
    );
};
