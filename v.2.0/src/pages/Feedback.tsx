import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Clock, Check, X, HelpCircle, History, User, RefreshCw } from 'lucide-react';

const FeedbackPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [myFeedback, setMyFeedback] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, 'feedback'),
            where('userId', '==', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyFeedback(items.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitted) return; // Prevent double submission
        setLoading(true);
        setStatusMsg(null);
        try {
            await addDoc(collection(db, 'feedback'), {
                name,
                email,
                message,
                userId: auth.currentUser?.uid || null,
                timestamp: serverTimestamp(),
                status: 'sent'
            });
            setStatusMsg('Доставлено');
            setSubmitted(true);
            // We don't clear statusMsg here to keep the "stamp" permanent
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setStatusMsg('Ошибка: Не доставлено');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'viewed': return { label: 'ПРОСМОТРЕНО', color: 'text-blue-600', icon: <Clock size={12} /> };
            case 'accepted': return { label: 'ПРИНЯТО', color: 'text-green-600', icon: <Check size={12} /> };
            case 'refused': return { label: 'ОТКАЗАНО', color: 'text-red-600', icon: <X size={12} /> };
            case 'possibly': return { label: 'ВОЗМОЖНО', color: 'text-orange-600', icon: <HelpCircle size={12} /> };
            default: return { label: 'ОТПРАВЛЕНО', color: 'text-[#8b0000]', icon: <Send size={12} /> };
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl uppercase tracking-[5px] text-[#d4af37] border-b border-[#d4af37]/30 pb-2">Обратная связь</h1>
                {auth.currentUser && (
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37]/10 transition-all rounded"
                    >
                        {showHistory ? <Send size={14} /> : <History size={14} />}
                        {showHistory ? 'Написать' : 'Мои анкеты'}
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {showHistory && auth.currentUser ? (
                    <motion.div 
                        key="history"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 gap-6"
                    >
                        {myFeedback.length === 0 ? (
                            <div className="text-center py-20 bg-[#2b1d14] border border-[#3d2b20] rounded italic text-[#856a54]">
                                У вас пока нет отправленных анкет.
                            </div>
                        ) : (
                            myFeedback.map(item => (
                                <div key={item.id} className="paper-sheet p-6 shadow-xl border-l-[10px] border-[#d4af37]/30 relative overflow-hidden text-[#3d2b20] min-h-0">
                                    <div className="flex justify-between items-start mb-4 border-b border-[#3d2b20]/10 pb-2 relative z-10">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Дата отправки</span>
                                            <p className="text-xs italic">{item.timestamp?.toDate().toLocaleDateString('ru-RU')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Статус</span>
                                            <div className={`flex items-center gap-1 text-xs font-bold ${getStatusInfo(item.status).color}`}>
                                                {getStatusInfo(item.status).icon}
                                                {getStatusInfo(item.status).label}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-serif text-sm italic leading-relaxed line-clamp-3 opacity-80 relative z-10">«{item.message}»</p>
                                    
                                    {/* Small square stamp for history - made permanent */}
                                    <div className={`absolute bottom-4 right-4 p-2 border-2 flex flex-col items-center justify-center rotate-6 opacity-30 pointer-events-none select-none ${item.status === 'refused' ? 'border-red-600' : 'border-[#8b0000]'}`}>
                                        <span className={`text-[8px] font-black uppercase ${item.status === 'refused' ? 'text-red-600' : 'text-[#8b0000]'}`}>
                                            {item.status === 'refused' ? 'ОТКАЗ' : 'ПРИНЯТО'}
                                        </span>
                                        <span className="text-[6px] text-gray-500">{new Date(item.timestamp?.seconds * 1000).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="paper-sheet p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col gap-8 min-h-[700px] border border-[#eee]"
                        style={{ color: '#3d2b20' }}
                    >
                        {/* Header */}
                        <div className="text-center border-b-2 border-double border-[#3d2b20]/20 pb-8 mb-4 relative z-10">
                            <h1 className="text-3xl font-serif uppercase tracking-[15px] mb-2 font-bold text-[#2c1e14]">Анкета</h1>
                            <p className="text-[11px] uppercase tracking-[5px] opacity-40 font-bold italic">Лист обратной связи и предложений</p>
                        </div>

                        {/* Stamp logic overlay - always present if statusMsg exists */}
                        <AnimatePresence>
                          {statusMsg && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 2, rotate: -25 }}
                              animate={{ opacity: 0.7, scale: 1, rotate: -15 }}
                              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 p-8 border-[12px] flex flex-col items-center justify-center font-black ${statusMsg.includes('Ошибка') ? 'border-[#8b0000] text-[#8b0000]' : 'border-[#d4af37] text-[#d4af37]'}`}
                            >
                              <span className="text-6xl uppercase tracking-tighter">{statusMsg.includes('Ошибка') ? 'ОТКАЗАНО' : 'ПРИНЯТО'}</span>
                              <span className="text-xl mt-2 uppercase tracking-widest">{statusMsg}</span>
                              <span className="text-sm mt-1">{new Date().toLocaleDateString('ru-RU')}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className={`flex flex-col gap-12 relative z-10 ${submitted ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">1. Ваше Имя или Псевдоним:</label>
                                <input 
                                    required
                                    disabled={submitted}
                                    type="text" 
                                    className="form-input-white py-3 px-3 outline-none font-serif text-xl italic transition-all placeholder:opacity-20"
                                    placeholder="Иван Александрович"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">2. Координаты для связи (необязательно):</label>
                                <input 
                                    disabled={submitted}
                                    type="email" 
                                    className="form-input-white py-3 px-3 outline-none font-mono text-sm transition-all placeholder:opacity-20"
                                    placeholder="pochta@domain.ru"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase font-bold tracking-widest opacity-60">3. Суть и содержание послания:</label>
                                <textarea 
                                    required
                                    disabled={submitted}
                                    className="form-input-white p-6 h-60 resize-none outline-none font-serif text-lg leading-relaxed italic transition-all"
                                    placeholder="Пишите здесь всё, что сочтете нужным..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-[#3d2b20]/10 pt-10 mt-4">
                                <div className="flex flex-col gap-1">
                                    {auth.currentUser ? (
                                        <div className="flex items-center gap-2 text-[10px] uppercase font-black text-[#d4af37] tracking-widest">
                                            <User size={14} /> {auth.currentUser.email}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] uppercase opacity-30 max-w-[200px] leading-tight font-bold">
                                            Анонимное отправление<br/>Записей в истории не будет.
                                        </p>
                                    )}
                                </div>
                                <button 
                                    disabled={loading || submitted}
                                    type="submit"
                                    className="flex items-center gap-4 bg-[#2c1e14] text-[#f4ecd8] px-12 py-5 uppercase text-xs font-black tracking-[4px] hover:bg-[#d4af37] hover:text-[#1e130c] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                                    {submitted ? 'Анкета отправлена' : 'Отправить анкету'}
                                </button>
                            </div>
                        </form>

                        {submitted && (
                            <button 
                                onClick={() => {
                                    setSubmitted(false);
                                    setStatusMsg(null);
                                    setName('');
                                    setEmail('');
                                    setMessage('');
                                }}
                                className="mt-4 self-center text-[10px] uppercase tracking-widest font-bold text-[#d4af37] hover:underline"
                            >
                                Написать новое послание
                            </button>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase opacity-20 font-bold tracking-[10px] pointer-events-none">
                            КАНЦЕЛЯРИЯ ЯТЬ
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeedbackPage;
