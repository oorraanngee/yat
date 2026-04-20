export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-yat-gold)]/30 mt-16 pt-6 pb-2 text-center relative z-10 flex flex-col gap-3">
      <p className="text-[var(--color-yat-gold)] opacity-70 text-sm font-serif italic mb-1">
        Сайт вдохновлён проектом <a href="https://slavenica.com/" target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-yat-text)] transition-colors">Славеница</a>.
      </p>
      <div className="flex justify-center gap-6 font-bold text-[10px] md:text-xs tracking-widest text-[var(--color-yat-gold)] uppercase opacity-80 flex-wrap">
        <a href="https://github.com/oorraanngee/yat" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-yat-text)] transition-colors border-b border-transparent hover:border-[var(--color-yat-text)]">GitHub</a>
        <a href="https://gwab.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-yat-text)] transition-colors border-b border-transparent hover:border-[var(--color-yat-text)]">Все проекты</a>
        <a href="https://yiat.vercel.app/feedback" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-yat-text)] transition-colors border-b border-transparent hover:border-[var(--color-yat-text)]">Обратная связь</a>
      </div>
    </footer>
  );
}
