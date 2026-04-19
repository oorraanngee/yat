import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

export default function Layout() {
  const location = useLocation();
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'api_keys'), where('userId', '==', user.uid));
        const unsubStore = onSnapshot(q, (snapshot) => {
          setHasApiKey(!snapshot.empty);
        });
        return () => unsubStore();
      } else {
        setHasApiKey(false);
      }
    });

    return () => unsubAuth();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="frame-container w-full max-w-5xl p-6 md:p-10 flex flex-col min-h-[85vh]">
        <div className="ornament"></div>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-[#d4af37] pb-4 mb-8 gap-4 relative z-10">
          <Link to="/" className="flex items-center gap-5 hover:opacity-90 transition-opacity">
            <div className="logo-icon">Ѣ</div>
            <div>
              <h1 className="text-4xl md:text-5xl uppercase tracking-[8px] text-[#f4ecd8] mb-[-5px]">ЯТЬ</h1>
              <p className="italic text-sm text-[#d4af37] opacity-80">Сборникъ инструментовъ и статей</p>
            </div>
          </Link>
          
          <div className="flex flex-col items-end gap-2">
            <nav className="flex gap-4 text-sm font-bold tracking-widest uppercase">
              <Link 
                to="/" 
                className={`hover:text-[#d4af37] transition-colors ${location.pathname === '/' ? 'text-[#d4af37]' : 'text-[#f4ecd8]'}`}
              >
                Главная
              </Link>
              <Link 
                to="/translator" 
                className={`hover:text-[#d4af37] transition-colors ${location.pathname === '/translator' ? 'text-[#d4af37]' : 'text-[#f4ecd8]'}`}
              >
                Переводчикъ
              </Link>
              <Link 
                to="/articles" 
                className={`hover:text-[#d4af37] transition-colors ${location.pathname.startsWith('/articles') ? 'text-[#d4af37]' : 'text-[#f4ecd8]'}`}
              >
                Статьи
              </Link>
              {hasApiKey && (
                <Link 
                  to="/api-dashboard" 
                  className={`hover:text-[#d4af37] transition-colors ${location.pathname === '/api-dashboard' ? 'text-[#d4af37]' : 'text-[#f4ecd8]'}`}
                >
                  API
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow relative z-10 flex flex-col">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-[#d4af37]/30 mt-12 pt-6 pb-2 text-center relative z-10 flex flex-col gap-3">
          <p className="text-[#d4af37] opacity-70 text-sm">
            Сайт вдохновлён проектом <a href="https://slavenica.com/" target="_blank" rel="noreferrer" className="underline hover:text-[#f4ecd8] transition-colors">Славеница</a>. 
            Оттуда же взят словари Aspell и Hunspell.
          </p>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest text-[#d4af37] opacity-80 font-bold">
            <a href="https://github.com/oorraanngee/yat" target="_blank" rel="noreferrer" className="hover:text-[#f4ecd8] transition-colors border-b border-transparent hover:border-[#f4ecd8]">
              GitHub
            </a>
            <a href="https://gwab.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-[#f4ecd8] transition-colors border-b border-transparent hover:border-[#f4ecd8]">
              Всѣ проекты
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
