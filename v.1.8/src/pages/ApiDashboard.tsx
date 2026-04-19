import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Key, Copy, Check, History, Code, Zap, Ban, RefreshCw, Download, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ApiDashboard() {
  const [apiKey, setApiKey] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [exampleCopied, setExampleCopied] = useState(false);
  const [reissuing, setReissuing] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const setupAuth = () => {
      if (!auth.currentUser) {
        // If auth state is confirmed as null (no user), stop loading
        const timer = setTimeout(() => {
          if (!auth.currentUser) setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
      }

      const q = query(collection(db, 'api_keys'), where('userId', '==', auth.currentUser.uid));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setApiKey({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setApiKey(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Snapshot error:", error);
        setLoading(false);
      });
    };

    const cleanup = setupAuth();
    return () => {
      if (unsubscribe) unsubscribe();
      if (cleanup) cleanup();
    };
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
    await updateDoc(doc(db, 'api_keys', apiKey.id), {
      historyEnabled: !apiKey.historyEnabled
    });
  };

  const reissueKey = async () => {
    if (!window.confirm('Вы увѣрены, что хотите переиздать ключъ? Старый ключъ ПРЕКРАТИТЪ работу немедленно.')) return;
    
    setReissuing(true);
    try {
      const newKey = 'yat_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await updateDoc(doc(db, 'api_keys', apiKey.id), {
        key: newKey,
        createdAt: new Date().toISOString(),
        totalRequests: 0,
        lastUsedAt: null
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка при переизданіи ключа.');
    } finally {
      setReissuing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExampleCode = (hideKey = false) => {
    const origin = window.location.origin;
    const keyToDisplay = hideKey ? 'yat_***************************' : apiKey.key;
    return `fetch('${origin}/api/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${keyToDisplay}'
  },
  body: JSON.stringify({
    text: 'Привет, мир!'
  })
})
.then(res => res.json())
.then(data => console.log(data.translated));`;
  };

  const copyExample = () => {
    navigator.clipboard.writeText(getExampleCode(false));
    setExampleCopied(true);
    setTimeout(() => setExampleCopied(false), 2000);
  };

  const downloadTestProgram = () => {
    const origin = window.location.origin;
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Yat API Test Tool</title>
    <style>
        body { font-family: sans-serif; background: #1e130c; color: #f4ecd8; padding: 2rem; max-width: 600px; margin: auto; }
        textarea { width: 100%; height: 100px; background: #2b1d14; border: 1px solid #3d2b20; color: #f4ecd8; padding: 10px; margin-bottom: 10px; box-sizing: border-box; resize: vertical; }
        button { background: #d4af37; color: #1e130c; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; width: 100%; }
        button:active { background: #b08d20; }
        #result { margin-top: 20px; padding: 10px; background: #2b1d14; border-left: 4px solid #d4af37; font-style: italic; white-space: pre-wrap; min-height: 20px; }
        h2 { border-bottom: 2px solid #d4af37; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
    </style>
</head>
<body>
    <h2>Проверка API «ЯТЬ»</h2>
    <p style="font-size: 0.8rem; opacity: 0.7;">Ключ: ${apiKey.key.substring(0, 10)}...</p>
    <textarea id="input" placeholder="Введите текст для перевода..."></textarea>
    <button onclick="translateText()">Перевести</button>
    <div id="result">Результатъ появится здѣсь...</div>

    <script>
        async function translateText() {
            const text = document.getElementById('input').value;
            const resDiv = document.getElementById('result');
            if(!text) return;
            resDiv.innerText = 'Переводъ...';
            
            try {
                const response = await fetch('${origin}/api/v1/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': '${apiKey.key}'
                    },
                    body: JSON.stringify({ text })
                });
                const data = await response.json();
                if (data.translated) {
                    resDiv.innerText = data.translated;
                } else {
                    resDiv.innerText = 'Ошибка: ' + (data.error || 'Неизвѣстная ошибка');
                }
            } catch (err) {
                console.error(err);
                resDiv.innerText = 'Сетевая ошибка. Провѣрьте подключеніе или CORS настройки сайта.';
            }
        }
    </script>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yat_test_tool.html';
    a.click();
    URL.revokeObjectURL(url);
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
          <div className="flex gap-2">
            <button 
              onClick={reissueKey}
              disabled={reissuing}
              className="flex items-center gap-2 px-3 py-1 text-xs rounded border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 transition-colors"
              title="Переиздать ключ"
            >
              {reissuing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Переиздать
            </button>
            <span className={`px-2 py-1 text-xs rounded border ${apiKey.isActive ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-red-500/50 text-red-500 bg-red-500/10'}`}>
              {apiKey.isActive ? 'Активенъ' : 'Отключенъ'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1e130c] p-3 rounded border border-[#3d2b20] mb-6">
          <code className="text-[#d4af37] font-mono break-all flex-grow">
            {apiKey.key.substring(0, 4)}*********************
          </code>
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

      {/* Instructions & Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Help & Tools */}
        <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg flex flex-col gap-6">
          <div>
            <h3 className="text-lg uppercase tracking-widest text-[#f4ecd8] mb-4 flex items-center gap-2">
              <Info size={20} className="text-[#d4af37]" /> Инструкція
            </h3>
            <ul className="text-[#856a54] text-sm italic space-y-3 list-disc pl-4">
              <li>Отправляйте <b>POST</b> запросы на эндпоинт <code className="text-[#d4af37]">/api/v1/translate</code>.</li>
              <li>Обязательно передавайте заголовок <code className="text-[#d4af37]">x-api-key</code> съ вашимъ ключомъ.</li>
              <li>Тѣло запроса должно быть въ форматѣ JSON: <code className="text-[#d4af37]">{`{"text": "ваш текст"}`}</code>.</li>
              <li>Zalgo-текстъ автоматически очищается (лимитъ 3 символа на букву).</li>
            </ul>
          </div>
          
          <div className="mt-auto border-t border-[#3d2b20] pt-6">
            <button 
              onClick={downloadTestProgram}
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] rounded hover:bg-[#d4af37]/20 transition-all font-bold uppercase tracking-widest"
            >
              <Download size={20} /> Скачать тестъ-программу
            </button>
            <p className="text-[10px] text-center text-[#856a54] mt-2 italic">
              Автономная HTML-страница съ вшитымъ вашимъ ключомъ для быстрой провѣрки.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section className="bg-[#2b1d14] border border-[#3d2b20] p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg uppercase tracking-widest text-[#f4ecd8] flex items-center gap-2">
              <Code size={20} className="text-[#d4af37]" /> Примѣръ (JS)
            </h3>
            <button 
              onClick={copyExample}
              className="text-[#d4af37] hover:text-[#f4ecd8] transition-colors p-1"
              title="Скопировать весь пример"
            >
              {exampleCopied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <div className="bg-[#1e130c] p-4 rounded font-mono text-xs overflow-x-auto text-[#e0d2bc] leading-relaxed relative group">
            <pre className="whitespace-pre-wrap">{getExampleCode(true)}</pre>
          </div>
        </section>
      </div>

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
      </section>

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
                  <th className="pb-4 pr-4">Время</th>
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
                      {log.status === 'success' ? (
                        <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest bg-green-500/10 px-1 rounded">OK</span>
                      ) : (
                        <span className="text-red-500 font-bold uppercase text-[10px] tracking-widest bg-red-500/10 px-1 rounded">ERR</span>
                      )}
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
