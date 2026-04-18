import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Key, Copy, Check, Trash2, History, Code, Zap, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ApiDashboard() {
  const [apiKey, setApiKey] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'api_keys'), where('userId', '==', auth.currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setApiKey(snapshot.docs[0].data());
      } else {
        setApiKey(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  useEffect(() => {
    if (!apiKey || !apiKey.historyEnabled) {
      setLogs([]);
      return;
    }

    const q = query(collection(db, 'api_logs'), where('key', '==', apiKey.key));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sortedLogs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(sortedLogs.slice(0, 50)); // Last 50
    });

    return () => unsubscribe();
  }, [apiKey]);

  const toggleHistory = async () => {
    if (!apiKey) return;
    const q = query(collection(db, 'api_keys'), where('userId', '==', auth.currentUser?.uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, {
        historyEnabled: !apiKey.historyEnabled
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-[#d4af37] italic">Загрузка данных...</div>;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#2b1d14] border border-[#3d2b20] rounded-lg">
        <Ban size={48} className="text-[#856a54] mb-4" />
        <h2 className="text-xl text-[#f4ecd8] mb-2 uppercase tracking-widest">Ключъ не найденъ</h2>
        <p className="text-[#856a54] text-center mb-6 max-w-md italic">
          Похоже, вы ещё не получили API ключъ или ваша верификація была прервана.
        </p>
        <a href="/api-setup" className="cta-button">Получить API ключъ</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Key Info */}
      <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg shadow-xl overflow-hidden relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Key className="text-[#d4af37]" />
            <h2 className="text-xl uppercase tracking-widest text-[#f4ecd8]">Вашъ API Ключъ</h2>
          </div>
          <span className={`px-2 py-1 text-xs rounded border ${apiKey.isActive ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-red-500/50 text-red-500 bg-red-500/10'}`}>
            {apiKey.isActive ? 'Активенъ' : 'Отключенъ'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#1e130c] p-3 rounded border border-[#3d2b20] mb-6">
          <code className="text-[#d4af37] font-mono break-all flex-grow">{apiKey.key}</code>
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-[#2b1d14] rounded transition-colors text-[#d4af37]"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
            <p className="text-[#856a54] uppercase tracking-tighter text-xs mb-1">Всего запросовъ</p>
            <p className="text-[#f4ecd8] text-2xl font-mono">{apiKey.totalRequests || 0}</p>
          </div>
          <div className="p-4 bg-[#1e130c] border border-[#3d2b20] rounded">
            <p className="text-[#856a54] uppercase tracking-tighter text-xs mb-1">Послѣднее использованіе</p>
            <p className="text-[#f4ecd8] text-sm italic">
              {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString('ru-RU') : 'Никогда'}
            </p>
          </div>
        </div>
      </section>

      {/* Settings & Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings */}
        <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg">
          <h3 className="text-lg uppercase tracking-widest text-[#f4ecd8] mb-6 flex items-center gap-2">
            <Zap size={20} className="text-[#d4af37]" /> Настройки
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-[#1e130c] border border-[#3d2b20] rounded mb-4">
            <div>
              <p className="text-[#f4ecd8] font-bold">Исторія запросовъ</p>
              <p className="text-[#856a54] text-xs italic">Сохранять текстъ входящихъ и исходящихъ запросовъ</p>
            </div>
            <button 
              onClick={toggleHistory}
              className={`w-12 h-6 rounded-full transition-colors relative ${apiKey.historyEnabled ? 'bg-[#d4af37]' : 'bg-[#3d2b20]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${apiKey.historyEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="p-4 border border-yellow-900/40 bg-yellow-900/10 rounded flex gap-3">
             <Ban className="text-yellow-600 flex-shrink-0" size={20} />
             <p className="text-sm text-yellow-600/80 italic">
               Напоминаніе: Zalgo-текстъ (искаженные символы) строго запрещенъ и будетъ блокироваться API автоматически.
             </p>
          </div>
        </section>

        {/* Examples */}
        <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg">
          <h3 className="text-lg uppercase tracking-widest text-[#f4ecd8] mb-6 flex items-center gap-2">
            <Code size={20} className="text-[#d4af37]" /> Примѣръ кода (JS)
          </h3>
          <div className="bg-[#1e130c] p-4 rounded font-mono text-xs overflow-x-auto text-[#e0d2bc] leading-relaxed">
            <pre>{`fetch('https://yiat.vercel.app/api/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey.key.substring(0, 10)}...'
  },
  body: JSON.stringify({
    text: 'Привет, мир!'
  })
})
.then(res => res.json())
.then(data => console.log(data.translated));`}</pre>
          </div>
        </section>
      </div>

      {/* Logs */}
      <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg">
        <h3 className="text-lg uppercase tracking-widest text-[#f4ecd8] mb-6 flex items-center gap-2">
          <History size={20} className="text-[#d4af37]" /> Исторія запросовъ
        </h3>

        {!apiKey.historyEnabled ? (
          <div className="p-12 text-center border-2 border-dashed border-[#3d2b20] rounded italic text-[#856a54]">
            Исторія запросовъ отключена. Включите её в настройкахъ выше, чтобы видѣть логи.
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-[#3d2b20] rounded italic text-[#856a54]">
            Логовъ пока нѣтъ. Сдѣлайте первый запрос к API.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#856a54] uppercase tracking-tighter border-b border-[#3d2b20]">
                <tr>
                  <th className="pb-4 pr-4">Времы</th>
                  <th className="pb-4 pr-4">Входъ</th>
                  <th className="pb-4 pr-4">Выходъ</th>
                  <th className="pb-4">Статусъ</th>
                </tr>
              </thead>
              <tbody className="text-[#f4ecd8]">
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#3d2b20]/50 last:border-0">
                    <td className="py-4 pr-4 whitespace-nowrap text-xs text-[#856a54]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-4 pr-4 max-w-[150px] truncate italic">{log.input}</td>
                    <td className="py-4 pr-4 max-w-[150px] truncate text-[#d4af37]">{log.output}</td>
                    <td className="py-4">
                      <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest bg-green-500/10 px-1 rounded">OK</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
