import React, { useState } from 'react';

export const LoremIpsum = () => {
    const [paragraphs, setParagraphs] = useState(3);
    const lorem = "Лорем ипсум долор сит амет, консектетур адиписцинг элит. Сед до эиусмод темпор инцидидунт ут лаборе ет долоре магна аликъуа. Ут еним ад миним вениам, къуис ноструд ехерцитатион улламцо лаборис ниси ут аликъуип ех еа цоммодо цонсекъуат. Дуис ауте ируре долор ин репрехендерит ин волуптате велит ессе циллум долоре еу фугиат нулла париятур. Ехцептеур синт оццаецат цупидатат нон проидент, сунт ин цулпа къуи оффициа десерунт моллит аним ид ест лаборум.";
    const generate = () => Array(paragraphs).fill(lorem).join('\n\n');
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <label className="text-[10px] text-[#856a54] uppercase px-1 font-bold">Количество абзацев:</label>
                <input type="number" min="1" max="50" className="input-field w-24" value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))} />
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 -mb-3 font-bold mt-2">Сгенерированный текст:</label>
            <textarea className="input-field h-64 resize-none text-sm text-[#f4ecd8] leading-relaxed w-full" readOnly value={generate()} />
        </div>
    );
};

export const IcaoTranslit = () => {
    const [input, setInput] = useState('');
    const translit = (text: string) => {
        const map: any = {
            'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'E', 'Ж':'ZH', 'З':'Z', 'И':'I', 'Й':'I',
            'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F',
            'Х':'KH', 'Ц':'TS', 'Ч':'CH', 'Ш':'SH', 'Щ':'SHCH', 'Ъ':'IE', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'IU', 'Я':'IA',
            'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'e', 'ж':'zh', 'з':'z', 'и':'i', 'й':'i',
            'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f',
            'х':'kh', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ъ':'ie', 'ы':'y', 'ь':'', 'э':'e', 'ю':'iu', 'я':'ia'
        };
        return text.split('').map(c => map[c] !== undefined ? map[c] : c).join('');
    };
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">ФИО на русском:</label>
            <input className="input-field w-full" placeholder="Например: Иванов Иван" value={input} onChange={e => setInput(e.target.value)} />
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">ICAO Транслитерация:</label>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded relative">
                <p className="text-[#f4ecd8] font-mono text-xl">{translit(input) || '...'}</p>
            </div>
        </div>
    );
};

export const TextDiff = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Оригинальный текст</label>
                    <textarea className="input-field h-32 w-full" placeholder="Вставьте оригинал" value={text1} onChange={e => setText1(e.target.value)} />
                </div>
                <div>
                    <label className="text-[10px] text-[#856a54] uppercase px-1 mb-1 block font-bold">Измененный текст</label>
                    <textarea className="input-field h-32 w-full" placeholder="Вставьте измененную версию" value={text2} onChange={e => setText2(e.target.value)} />
                </div>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Сравнительный результат (Красный = было, Зеленый = стало):</label>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded h-64 overflow-auto flex text-sm">
                <div className="w-1/2 pr-2 border-r border-[#3d2b20] text-red-400 font-mono break-words">
                    {text1.split('\n').map((line, i) => {
                        const otherLine = text2.split('\n')[i];
                        return <div key={i} className={line !== otherLine ? 'bg-red-500/20' : ''}>{line || '\u00A0'}</div>;
                    })}
                </div>
                <div className="w-1/2 pl-2 text-green-400 font-mono break-words">
                    {text2.split('\n').map((line, i) => {
                        const otherLine = text1.split('\n')[i];
                        return <div key={i} className={line !== otherLine ? 'bg-green-500/20' : ''}>{line || '\u00A0'}</div>;
                    })}
                </div>
            </div>
        </div>
    );
};

export const TextExtract = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('email');
    const extract = () => {
        if (!text) return [];
        if (type === 'email') return text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g) || [];
        if (type === 'url') return text.match(/https?:\/\/[^\s]+/g) || [];
        return [];
    };
    const res = extract();
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Оригинальный текст:</label>
            <textarea className="input-field h-32 w-full" placeholder="Текст из которого нужно извлечь данные..." value={text} onChange={e => setText(e.target.value)} />
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold mt-2">Тип данных (Что извлекать):</label>
            <select className="input-field w-full" value={type} onChange={e => setType(e.target.value)}>
                <option value="email">Email адреса</option>
                <option value="url">URL ссылки</option>
            </select>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Извлеченные данные:</label>
            <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded min-h-[100px] text-sm text-[#f4ecd8] font-mono break-all leading-relaxed">
                {res.length > 0 ? res.map((r, i) => <div key={i} className="select-all hover:bg-[#d4af37]/10 inline-block px-1 mr-2 rounded">{r}</div>) : <span className="text-[#856a54] italic">Ничего не найдено</span>}
            </div>
        </div>
    );
};

export const ReadTime = () => {
    const [text, setText] = useState('');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const timeMins = Math.ceil(words / 200);
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Вставьте текст для проверки:</label>
            <textarea className="input-field h-40 w-full" placeholder="Вставьте текст..." value={text} onChange={e => setText(e.target.value)} />
            <div className="grid grid-cols-2 gap-4 text-center mt-2">
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded relative">
                    <p className="text-[10px] text-[#856a54] uppercase font-bold tracking-widest absolute top-2 left-0 right-0">Слов</p>
                    <p className="text-[#f4ecd8] font-mono text-3xl mt-4">{words}</p>
                </div>
                <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded relative">
                    <p className="text-[10px] text-[#856a54] uppercase font-bold tracking-widest absolute top-2 left-0 right-0">Время чтения (мин)</p>
                    <p className="text-[#d4af37] font-mono text-3xl mt-4">~{timeMins}</p>
                </div>
            </div>
        </div>
    );
};

export const ListGenerator = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('ol');
    const lists = text.split('\n').filter(l => l.trim().length > 0);
    const generate = () => lists.map((l, i) => `${type === 'ol' ? `${i+1}.` : '-'} ${l.trim()}`).join('\n');
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите элементы (каждый с новой строки):</label>
            <textarea className="input-field h-32 w-full" placeholder="Каждый пункт с новой строки..." value={text} onChange={e => setText(e.target.value)} />
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold mt-2">Тип списка:</label>
            <select className="input-field w-full" value={type} onChange={e => setType(e.target.value)}>
                <option value="ol">Нумерованный список (1. 2. 3.)</option>
                <option value="ul">Маркированный список (- - -)</option>
            </select>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Сгенерированный список:</label>
            <textarea className="input-field h-32 text-[#d4af37] font-mono w-full" placeholder="Здесь будет результат..." readOnly value={generate()} />
        </div>
    );
};

export const TextMinify = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('json');
    const [output, setOutput] = useState('');
    
    const minify = () => {
        try {
            if (type === 'json') setOutput(JSON.stringify(JSON.parse(text)));
            else if (type === 'css') setOutput(text.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').replace(/\s*([{}|;:%,])\s*/g, '$1'));
            else if (type === 'js') setOutput(text.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, ''));
        } catch {
            setOutput('Ошибка парсинга/синтаксиса');
        }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Оригинальный код (JSON / CSS / JS):</label>
            <textarea className="input-field h-32 w-full" value={text} onChange={e => setText(e.target.value)} placeholder="Код для сжатия..." />
            <div className="flex gap-4">
                <select className="input-field flex-1" value={type} onChange={e => setType(e.target.value)}>
                    <option value="json">Документ JSON</option>
                    <option value="css">Файл CSS (базово)</option>
                    <option value="js">Файл JS (базово)</option>
                </select>
                <button onClick={minify} className="btn-professional px-6 uppercase tracking-widest font-bold">Сжать (Minify)</button>
            </div>
            <label className="text-[10px] text-[#d4af37] uppercase px-1 mt-2 -mb-3 font-bold">Сжатый код:</label>
            <textarea className="input-field h-32 text-[#d4af37] font-mono w-full" placeholder="Результат..." readOnly value={output} />
        </div>
    );
};

export const SyllablesStressSynonyms = () => {
    const [text, setText] = useState('');
    
    // Подсчет слогов
    const syllables = text.toLowerCase().split('').filter(c => 'аеёиоуыэюя'.includes(c)).length;
    
    // Локальная мини-база для популярных проблемных слов
    const dicStress: Record<string, string> = { 
        'звонит': 'звони́т', 'договор': 'догово́р', 'каталог': 'катало́г', 
        'красивее': 'краси́вее', 'торты': 'то́рты', 'баловать': 'балова́ть', 
        'жалюзи': 'жалюзи́', 'творог': 'творо́г / тво́рог', 'свекла': 'свёкла',
        'квартал': 'кварта́л', 'обеспечение': 'обеспе́чение', 'туфля': 'ту́фля'
    };
    
    // Расширенная база синонимов (в том числе слова "слово", "привет", "человек" и т.д.)
    const dicSynonyms: Record<string, string> = { 
        'слово': 'речь, фраза, выражение, термин, понятие, словечко',
        'привет': 'здравствуй(те), добрый день, салют, хай, приветствую',
        'красивый': 'прекрасный, живописный, изящный, привлекательный, симпатичный', 
        'хороший': 'добрый, славный, отличный, прекрасный, чудесный', 
        'быстрый': 'скорый, стремительный, проворный, резвый',
        'человек': 'людина, персона, личность, индивид',
        'делать': 'совершать, производить, творить, создавать, выполнять',
        'много': 'множество, изобилие, масса, куча, тьма, полно',
        'большой': 'крупный, огромный, громадный, гигантский, массивный',
        'умный': 'рассудительный, мудрый, сообразительный, смышленый',
        'работа': 'труд, занятие, дело, служба, деятельность, вакансия'
    };
    
    const w = text.toLowerCase().trim();
    const stress = dicStress[w] || (w ? 'Не найдено в базе' : '—');
    const syn = dicSynonyms[w] || (w ? 'Нет в оффлайн-словаре' : '—');
    
    return (
        <div className="flex flex-col gap-4">
            <label className="text-[10px] text-[#856a54] uppercase px-1 -mb-3 font-bold">Введите слово для анализа:</label>
            <input className="input-field" placeholder="Например: привет, слово, звонит..." value={text} onChange={e => setText(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-2">
                <div className="p-4 bg-[#1e130c]/80 shadow-inner border border-[#3d2b20] rounded relative">
                    <p className="text-[10px] text-[#856a54] uppercase font-bold tracking-widest absolute top-2 left-0 right-0">Слогов</p>
                    <p className="text-[#f4ecd8] font-mono text-3xl mt-4">{text ? syllables : '0'}</p>
                </div>
                <div className="p-4 bg-[#1e130c]/80 shadow-inner border border-[#3d2b20] rounded relative">
                    <p className="text-[10px] text-[#856a54] uppercase font-bold tracking-widest absolute top-2 left-0 right-0">Сложное ударение</p>
                    <p className="text-[#d4af37] text-xl mt-5">{stress}</p>
                </div>
                <div className="p-4 bg-[#1e130c]/80 shadow-inner border border-[#3d2b20] rounded relative">
                    <p className="text-[10px] text-[#856a54] uppercase font-bold tracking-widest absolute top-2 left-0 right-0">Популярные синонимы</p>
                    <p className="text-[#f4ecd8] text-sm break-words mt-6 leading-tight">{syn}</p>
                </div>
            </div>
            <p className="text-[10px] text-[#856a54] italic text-center mt-2">Инструмент использует встроенный оффлайн-словарь для самых частых запросов.</p>
        </div>
    );
};
