import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowLeft, Monitor, Code, Globe, FileArchive, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import JSZip from 'jszip';

const StandaloneDownload = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeType, setActiveType] = useState<'site' | 'python' | 'python-gui' | null>(null);

    const downloadZip = async (downloadType: 'site' | 'python' | 'python-gui') => {
        setLoading(true);
        setActiveType(downloadType);
        setProgress(0);
        const zip = new JSZip();

        try {
            // 1. Fetch Dictionaries
            const dictFolder = zip.folder("dictionaries");
            for (let i = 1; i <= 29; i++) {
                const fileName = `part_${i}.txt`;
                const response = await fetch(`/dictionaries/ru-petr1708-hunspell-3.1/ru_petr1708/${fileName}`);
                if (response.ok) {
                    const blob = await response.blob();
                    dictFolder?.file(fileName, blob);
                }
                setProgress(Math.round((i / 29) * 80));
            }

            if (downloadType === 'site') {
                const stylesCss = `
body { font-family: -apple-system, sans-serif; background: #1e130c; color: #f4ecd8; margin: 0; padding: 20px; }
.container { max-width: 1000px; margin: auto; background: #2b1d14; border: 1px solid #d4af37; padding: 30px; border-radius: 8px; }
h1 { text-align: center; color: #d4af37; letter-spacing: 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
textarea { width: 100%; height: 300px; background: #1e130c; border: 1px solid #3d2b20; color: #f4ecd8; padding: 15px; box-sizing: border-box; resize: none; }
.controls { margin-top: 20px; display: flex; justify-content: center; gap: 15px; }
button { background: #d4af37; color: #1e130c; border: none; padding: 12px 30px; cursor: pointer; font-weight: bold; }
#loading-overlay { position: fixed; inset: 0; background: rgba(30,19,12,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.progress-container { width: 200px; height: 4px; background: #3d2b20; border-radius: 2px; margin-top: 15px; overflow: hidden; }
.progress-bar { height: 100%; background: #d4af37; width: 0%; }
                `;

                const scriptJs = `
const yatRoots = ['лѣс', 'видѣ', 'сидѣ', 'вѣст', 'послѣ', 'бѣг', 'бѣл', 'вѣд', 'вѣр', 'вѣт', 'гнѣв', 'грѣх', 'дѣл', 'дѣт', 'жѣл', 'звѣр', 'мѣр', 'мѣс', 'мѣст', 'нѣт', 'пѣн', 'пѣс', 'рѣк', 'рѣч', 'рѣш', 'сѣв', 'сѣм', 'сѣн', 'тѣл', 'цвѣт', 'цѣл', 'цѣн', 'ѣзд', 'ѣх', 'хлѣб', 'свѣт', 'снѣг', 'обѣд', 'отвѣт', 'привѣт', 'совѣт', 'завѣт', 'вѣк', 'рѣдк', 'крѣпк', 'лѣв', 'мѣд', 'плѣн', 'тѣсн', 'цѣп', 'лѣкар', 'лѣч', 'стрѣл', 'дѣгот', 'вѣтр', 'зрѣ', 'мѣн', 'тѣлег', 'свѣж', 'сосѣд', 'бѣд', 'лѣт', 'человѣк', 'тѣн', 'нѣб', 'надѣ', 'вѣн', 'аптѣк', 'нынѣ', 'разрѣш', 'здѣсь', 'встрѣт', 'сомнѣ'];
const exactWordMap = {'федор':'Ѳедоръ','фёдор':'Ѳедоръ','есть':'есть','ест':'ѣстъ','всѣ':'всѣ','тѣ':'тѣ','её':'ея','ее':'ея','который':'коій','неужели':'неужели','полёт':'полетъ','полет':'полетъ'};
const keepOgoList = ['его', 'него', 'кого', 'чего', 'самого', 'моего', 'твоего', 'своего', 'нашего', 'вашего', 'всего', 'ничего', 'этого', 'того', 'много', 'немного', 'другого'];
const dictionary = new Set();
async function init() {
    for(let i=1; i<=29; i++){
        try {
            const r = await fetch('dictionaries/part_' + i + '.txt');
            const t = await r.text();
            t.split(/\\r\\n|\\n/).forEach(w => { if(w.trim()) dictionary.add(w.trim().toLowerCase()); });
            const p = Math.round((i/29)*100);
            const pb = document.querySelector('.progress-bar');
            if(pb) pb.style.width = p+'%';
            document.getElementById('load-status').innerText = 'Загрузка: '+p+'%';
        }catch(e){}
    }
    document.getElementById('loading-overlay').style.display='none';
}
function matchCase(o, t){
    if(o===o.toUpperCase() && o.length>1) return t.toUpperCase();
    if(o[0]===o[0].toUpperCase()) return t[0].toUpperCase()+t.slice(1);
    return t;
}
function getPerms(s){
    if(!s) return [''];
    let f=s[0], r=getPerms(s.slice(1)), v=[f];
    if(f==='е') v.push('ѣ');
    if(f==='ф') v.push('ѳ');
    let res=[]; v.forEach(x=>r.forEach(y=>res.push(x+y)));
    return res;
}
function translateToPre(){
    const input = document.getElementById('input').value;
    let res = input.replace(/и([аеёиоуыэюяйѣіѵ])/gi, (m,p)=> (m[0]==='И'?'І':'і')+p);
    const tokens = res.split(/([а-яёіѣѳѵА-ЯЁІѢѲѴ]+)/);
    const out = tokens.map(t=>{
        if(!/[а-яёіѣѳѵ]/i.test(t)) return t;
        const l = t.toLowerCase();
        if(l==='чем' || l==='чём') return matchCase(t, 'чѣмъ');
        if(exactWordMap[l]) return matchCase(t, exactWordMap[l]);
        let b = l;
        if(b.length>3 && !/([а-яё])іеъ?$/i.test(b)){
            if(b.endsWith('ого') && !keepOgoList.includes(b)) b = b.slice(0,-3)+'аго';
            else if(b.endsWith('его') && !keepOgoList.includes(b)) b = b.slice(0,-3)+'яго';
            else if(b.endsWith('ые')) b = b.slice(0,-2)+'ыя';
            else if(b.endsWith('іе')) b = b.slice(0,-2)+'ія';
            else if(b.endsWith('ие')) b = b.slice(0,-2)+'ія';
        }
        if(/[бвгджзклмнпрстфхцшщч]$/i.test(b)) b+='ъ';
        const ps = getPerms(b).sort((a,b)=> (b.match(/[ѣѳіѵ]/g)||[]).length - (a.match(/[ѣѳіѵ]/g)||[]).length);
        for(let c of ps) if(dictionary.has(c)) return matchCase(t, c);
        let f = b;
        yatRoots.forEach(r=>{ let m=r.replace(/ѣ/g,'е'); if(f.includes(m)) f=f.replace(new RegExp(m,'g'), r); });
        return matchCase(t, f);
    }).join('');
    document.getElementById('output').value = out;
}
function translateToModern(){
    const input = document.getElementById('input').value;
    const revMap = {'Ѳедоръ':'Фёдор','яго':'его','ея':'её','всѣ':'все','тѣ':'те','нѣтъ':'нет','коій':'который','кафэ':'кафе','ѣли':'ели'};
    const tokens = input.split(/([а-яёіѣѳѵъА-ЯЁІѢѲѴЪ]+)/);
    let res = tokens.map(t=>{
        const l=t.toLowerCase();
        if(revMap[t]) return revMap[t];
        if(revMap[l]) return matchCase(t, revMap[l]);
        return t;
    }).join('');
    res = res.replace(/([бвгджзклмнпрстфхцшщ])ъ+(?![а-яёіѣѳѵ])/gi, '$1');
    const m = {'і':'и','І':'И','ѣ':'е','Ѣ':'Е','ѳ':'ф','Ѳ':'Ф','ѵ':'и','Ѵ':'И'};
    res = res.replace(/[іІѣѢѳѲѵѴ]/g, x=> m[x]||x);
    res = res.replace(/([бвгджзклмнпрстфхцшщ])аго\\b/gi, '$1ого');
    res = res.replace(/([бвгджзклмнпрстфхцшщ])яго\\b/gi, '$1его');
    res = res.replace(/([ыии])я\\b/gi, '$1е');
    document.getElementById('output').value = res;
}
init();
                `;

                const htmlContent = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><title>Ять - Автономный Переводчик</title><link rel="stylesheet" href="styles.css"></head>
<body><div id="loading-overlay"><h2>Ять</h2><div id="load-status">Загрузка...</div><div class="progress-container"><div class="progress-bar"></div></div></div>
<div class="container"><h1>Ять</h1><div class="grid"><div><textarea id="input" placeholder="Введите текст..."></textarea></div><div><textarea id="output" readonly></textarea></div></div>
<div class="controls"><button onclick="translateToPre()">В дореволюционный</button><button onclick="translateToModern()">В современный</button></div></div>
<script src="script.js"></script></body></html>`;
                zip.file("index.html", htmlContent);
                zip.file("styles.css", stylesCss);
                zip.file("script.js", scriptJs);
            } else {
                const pythonCode = `import re, os, sys

class Translator:
    def __init__(self):
        self.dictionary = set()
        self.yat_roots = ['лѣс', 'видѣ', 'сидѣ', 'вѣст', 'послѣ', 'бѣг', 'бѣл', 'вѣд', 'вѣр', 'вѣт', 'гнѣв', 'грѣх', 'дѣл', 'дѣт', 'жѣл', 'звѣр', 'мѣр', 'мѣс', 'мѣст', 'нѣт', 'пѣн', 'пѣс', 'рѣк', 'рѣч', 'рѣш', 'сѣв', 'сѣм', 'сѣн', 'тѣл', 'цвѣт', 'цѣл', 'цѣн', 'ѣзд', 'ѣх', 'хлѣб', 'свѣт', 'снѣг', 'обѣд', 'отвѣт', 'привѣт', 'совѣт', 'завѣт', 'вѣк', 'рѣдк', 'крѣпк', 'лѣв', 'мѣд', 'плѣн', 'тѣсн', 'цѣп', 'лѣкар', 'лѣч', 'стрѣл', 'дѣгот', 'вѣтр', 'зрѣ', 'мѣн', 'тѣлег', 'свѣж', 'сосѣд', 'бѣд', 'лѣт', 'человѣк', 'тѣн', 'нѣб', 'надѣ', 'вѣн', 'аптѣк', 'нынѣ', 'разрѣш', 'здѣсь', 'встрѣт', 'сомнѣ']
        self.exact_map = {'федор':'Ѳедоръ','фёдор':'Ѳедоръ','есть':'есть','ест':'ѣстъ','всѣ':'всѣ','тѣ':'тѣ','её':'ея','ее':'ея','который':'коій','неужели':'неужели','полёт':'полетъ','полет':'полетъ'}
        self.keep_ogo = ['его','него','кого','чего','самого','моего','твоего','своего','нашего','вашего','всего','ничего','этого','того','много','немного','другого']
        self.load_dictionaries()
    def load_dictionaries(self):
        d_p = os.path.join(os.path.dirname(__file__), "dictionaries")
        if not os.path.exists(d_p): d_p = "dictionaries"
        for i in range(1, 30):
            fp = os.path.join(d_p, f"part_{i}.txt")
            if os.path.exists(fp):
                with open(fp, 'r', encoding='utf-8') as f:
                    for l in f:
                        w = l.strip().lower()
                        if w: self.dictionary.add(w)
    def match_case(self, o, t):
        if o.isupper() and len(o)>1: return t.upper()
        if o and o[0].isupper(): return t[0].upper()+t[1:]
        return t
    def get_perms(self, s):
        if not s: return ['']
        f, r = s[0], self.get_perms(s[1:])
        v = [f]
        if f=='е': v.append('ѣ')
        if f=='ф': v.append('ѳ')
        return [x+y for x in v for y in r]
    def translate_to_pre(self, text):
        text = re.sub(r'и([аеёиоуыэюяйѣіѵ])', r'і\\1', text, flags=re.IGNORECASE)
        tokens = re.split(r'([а-яёіѣѳѵА-ЯЁІѢѲѴ]+)', text)
        res = []
        for t in tokens:
            if not re.match(r'[а-яёіѣѳѵ]', t, re.I): res.append(t); continue
            l = t.lower()
            if l=='чем' or l=='чём': res.append(self.match_case(t, 'чѣмъ')); continue
            if l in self.exact_map: res.append(self.match_case(t, self.exact_map[l])); continue
            b = l
            if len(b)>3 and not re.search(r'([а-яё])іе$', b):
                if b.endswith('ого') and b not in self.keep_ogo: b = b[:-3]+'аго'
                elif b.endswith('его') and b not in self.keep_ogo: b = b[:-3]+'яго'
                elif b.endswith('ые'): b = b[:-2]+'ыя'
                elif b.endswith('іе'): b = b[:-2]+'ія'
                elif b.endswith('ие'): b = b[:-2]+'ія'
            if re.search(r'[бвгджзклмнпрстфхцшщч]$', b): b+='ъ'
            cs = sorted(self.get_perms(b), key=lambda x: len(re.findall(r'[ѣіѳѵ]', x)), reverse=True)
            fnd = False
            for c in cs:
                if c in self.dictionary: res.append(self.match_case(t, c)); fnd=True; break
            if not fnd:
                f = b
                for r in self.yat_roots:
                    m = r.replace('ѣ','е')
                    if m in f: f = f.replace(m, r)
                res.append(self.match_case(t, f))
        return "".join(res)
    def translate_to_modern(self, text):
        rev = {'Ѳедоръ':'Фёдор','яго':'его','ея':'её','всѣ':'все','тѣ':'те','нѣтъ':'нет','коій':'который','кафэ':'кафе','ѣли':'ели'}
        tokens = re.split(r'([а-яёіѣѳѵъА-ЯЁІѢѲѴЪ]+)', text)
        res = []
        for t in tokens:
            l = t.lower()
            if t in rev: res.append(rev[t])
            elif l in rev: res.append(self.match_case(t, rev[l]))
            else: res.append(t)
        s = "".join(res)
        s = re.sub(r'([бвгджзклмнпрстфхцшщ])ъ+(?![а-яёіѣѳѵ])', r'\\1', s, flags=re.IGNORECASE)
        m = {'і':'и','І':'И','ѣ':'е','Ѣ':'Е','ѳ':'ф','Ѳ':'Ф','ѵ':'и','Ѵ':'И'}
        s = "".join([m.get(c, c) for c in s])
        s = re.sub(r'([бвгджзклмнпрстфхцшщ])аго\\b', r'\\1ого', s)
        s = re.sub(r'([бвгджзклмнпрстфхцшщ])яго\\b', r'\\1его', s)
        s = re.sub(r'([ыи])я\\b', r'\\1е', s)
        return s

if __name__ == "__main__":
    t = Translator(); md = False
    while True:
        try:
            p = "[Modern] > " if md else "[Pre-Ref] > "
            l = input(p)
            if l == "!mode": md = not md; continue
            if not l: break
            print(t.translate_to_modern(l) if md else t.translate_to_pre(l))
        except: break
`;
                const pythonGuiCode = `import tkinter as tk
from tkinter import scrolledtext
from translator import Translator

class TranslatorGUI:
    def __init__(self, root):
        self.root = root; self.root.title("Ять GUI"); self.root.geometry("800x600"); self.root.configure(bg="#1e130c")
        self.translator = Translator(); self.setup_ui(); self.bind_keys()
    def setup_ui(self):
        accent = "#d4af37"
        tk.Label(self.root, text="Ять", font=("Times", 20), bg="#1e130c", fg=accent).pack(pady=10)
        f = tk.Frame(self.root, bg="#1e130c"); f.pack(expand=True, fill="both", padx=10)
        self.in_t = scrolledtext.ScrolledText(f, height=10, bg="#2b1d14", fg="#f4ecd8", insertbackground="#f4ecd8"); self.in_t.pack(fill="both", expand=True, pady=5)
        self.out_t = scrolledtext.ScrolledText(f, height=10, bg="#2b1d14", fg="#f4ecd8"); self.out_t.pack(fill="both", expand=True, pady=5)
        self.in_t.focus_set()
        btn_f = tk.Frame(self.root, bg="#1e130c"); btn_f.pack(pady=10)
        tk.Button(btn_f, text="В ДО-РЕФОРМУ", command=self.do_p, bg=accent).pack(side="left", padx=10)
        tk.Button(btn_f, text="В СОВРЕМЕННОСТЬ", command=self.do_m, bg="#2b1d14", fg=accent).pack(side="left", padx=10)
    def bind_keys(self):
        hs = [("<Control-c>", "<<Copy>>"), ("<Control-v>", "<<Paste>>"), ("<Control-a>", "<<SelectAll>>"), ("<Control-cyrillic_es>", "<<Copy>>"), ("<Control-cyrillic_em>", "<<Paste>>"), ("<Control-cyrillic_ef>", "<<SelectAll>>")]
        for h, e in hs: self.root.bind_all(h, lambda ev, en=e: self.handle_ev(en))
    def handle_ev(self, en):
        w = self.root.focus_get()
        if w: w.event_generate(en)
    def do_p(self):
        t = self.in_t.get("1.0", "end-1c"); self.out_t.delete("1.0", "end"); self.out_t.insert("1.0", self.translator.translate_to_pre(t))
    def do_m(self):
        t = self.in_t.get("1.0", "end-1c"); self.out_t.delete("1.0", "end"); self.out_t.insert("1.0", self.translator.translate_to_modern(t))
if __name__ == "__main__":
    r = tk.Tk(); TranslatorGUI(r); r.mainloop()
`;
                zip.file("translator.py", pythonCode);
                if (downloadType === 'python-gui') zip.file("gui.pyw", pythonGuiCode);
            }

            setProgress(95);
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `yat_${downloadType}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            setProgress(100);
        } catch (err) {
            console.error(err);
            alert("Ошибка.");
        } finally {
            setTimeout(() => { setLoading(false); setProgress(0); setActiveType(null); }, 1000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <Link to="/api-dashboard" className="flex items-center gap-2 text-[#856a54] hover:text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-8"><ArrowLeft size={16} /> Назад</Link>
            <div className="text-center mb-12">
                <h1 className="text-3xl uppercase tracking-[10px] text-[#f4ecd8] mb-4">Автономный перевод</h1>
                <p className="text-[#856a54] italic mb-4">Выберите версию для локальной установки.</p>
                <Link to="/articles/standalone-yat" className="text-[#d4af37] text-xs uppercase tracking-widest hover:underline font-bold">
                    Как работает Ять? Читать статью →
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { type: 'site', name: 'Сайт', icon: Globe },
                    { type: 'python', name: 'Python CLI', icon: Code },
                    { type: 'python-gui', name: 'Python GUI', icon: Monitor }
                ].map(opt => (
                    <div key={opt.type} className="bg-[#2b1d14] border border-[#3d2b20] p-8 rounded flex flex-col items-center">
                        <opt.icon className="text-[#d4af37] mb-6" size={48} />
                        <h3 className="text-xl uppercase tracking-widest text-[#f4ecd8] mb-4">{opt.name}</h3>
                        <button onClick={() => downloadZip(opt.type as any)} disabled={loading} className="w-full bg-[#d4af37] text-[#1e130c] py-2 font-bold uppercase text-[10px] disabled:opacity-50">
                            {loading && activeType === opt.type ? <RefreshCw className="animate-spin inline mr-2" size={12} /> : <FileArchive className="inline mr-2" size={12} />}
                            Скачать
                        </button>
                    </div>
                ))}
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#2b1d14] border-2 border-[#d4af37] p-10 text-center rounded">
                        <h2 className="text-[#f4ecd8] uppercase tracking-widest mb-4">Сборка архива... ({progress}%)</h2>
                        <div className="h-1 w-64 bg-[#3d2b20] rounded-full overflow-hidden">
                            <div className="h-full bg-[#d4af37]" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StandaloneDownload;
