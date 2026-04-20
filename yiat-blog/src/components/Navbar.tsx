import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router';

export default function Navbar() {
  const { user, userData, signIn, signOut } = useAuth();
  
  return (
    <header className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-[#d4af37] pb-4 mb-8 gap-4 relative z-10">
      <Link to="/" className="flex items-center gap-5 hover:opacity-90 transition-opacity">
        <div className="logo-icon">Ѣ</div>
        <div>
          <h1 className="text-4xl md:text-5xl uppercase tracking-[8px] text-[#f4ecd8] mb-[-5px]">Ять</h1>
          <p className="italic text-sm text-[#d4af37] opacity-80">Дневник разработки и статьи</p>
        </div>
      </Link>
      
      <div className="flex flex-col items-end gap-2">
        <nav className="flex gap-4 text-sm font-bold tracking-widest uppercase">
          <Link to="/" className="hover:text-[#d4af37] transition-colors text-[#f4ecd8]">Главная</Link>
          
          {userData?.isAdmin && (
             <Link to="/admin" className="hover:text-[#d4af37] transition-colors text-[#f4ecd8]">Админ</Link>
          )}

          {user ? (
            <button onClick={signOut} className="hover:text-[#d4af37] transition-colors cursor-pointer text-[#d4af37]">
              Выход
            </button>
          ) : (
             <button onClick={signIn} className="hover:text-[#d4af37] transition-colors cursor-pointer text-[#d4af37]">
              Вход
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
