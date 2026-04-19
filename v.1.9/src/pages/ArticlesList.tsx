import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Folder, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleMeta {
  id: string;
  type: 'article';
  title: string;
  description: string;
  filename: string;
}

interface CategoryMeta {
  id: string;
  type: 'category';
  title: string;
  description: string;
  items: (ArticleMeta | CategoryMeta)[];
}

type ManifestItem = ArticleMeta | CategoryMeta;

type ManifestItemWithContent = (ArticleMeta & { content?: string }) | (CategoryMeta & { content?: string });

const ItemRenderer = ({ item, depth = 0 }: { item: ManifestItem, depth?: number }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);

  if (item.type === 'category') {
    return (
      <div className={`flex flex-col w-full ${depth > 0 ? 'ml-4 border-l border-[#3d2b20] pl-4' : ''}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-4 hover:bg-[rgba(212,175,55,0.05)] transition-colors text-left group"
        >
          <Folder className={`text-[#d4af37] transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} size={20} />
          <div className="flex-grow">
            <h3 className="text-xl font-serif text-[#d4af37] group-hover:text-[#f4ecd8] transition-colors">{item.title}</h3>
            {item.description && <p className="text-xs opacity-60 italic">{item.description}</p>}
          </div>
          <ChevronRight size={16} className={`text-[#d4af37] transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col gap-2 py-2"
            >
              {item.items.map(subItem => (
                <ItemRenderer key={subItem.id} item={subItem} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link 
      to={`/articles/${item.id}`}
      className={`flex items-start gap-3 p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors group ${depth > 0 ? 'ml-4 border-l border-[#3d2b20] pl-4' : 'glass-sidebar border-l-4 border-l-[#d4af37] rounded-r-lg mb-4'}`}
    >
      <FileText className="text-[#856a54] group-hover:text-[#d4af37] transition-colors mt-1" size={18} />
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-[#f4ecd8] group-hover:text-[#d4af37] transition-colors">{item.title}</h4>
        <p className="text-sm opacity-70 leading-relaxed line-clamp-2">{item.description}</p>
        <span className="text-[10px] text-[#d4af37] uppercase tracking-widest mt-2 block">Читать далѣе →</span>
      </div>
    </Link>
  );
};

export default function ArticlesList() {
  const [items, setItems] = useState<ManifestItem[]>([]);
  const [flatItems, setFlatItems] = useState<ManifestItemWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const res = await fetch('/articles/manifest.json');
        const data = await res.json();
        const manifestItems: ManifestItem[] = data.items || [];
        setItems(manifestItems);
        
        // Flatten and index for search
        const flattened: ManifestItemWithContent[] = [];
        const flatten = async (list: ManifestItem[]) => {
          for (const item of list) {
            const newItem = { ...item } as ManifestItemWithContent;
            flattened.push(newItem);
            if (item.type === 'category') {
              await flatten(item.items);
            } else {
              // Optionally fetch content for indexing (only if we want deep search)
              try {
                const contentRes = await fetch(`/articles/${item.filename}`);
                if (contentRes.ok) {
                   const text = await contentRes.text();
                   newItem.content = text;
                }
              } catch (e) {
                // Ignore fetch errors for indexing
              }
            }
          }
        };
        
        await flatten(manifestItems);
        setFlatItems(flattened);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load articles", err);
        setLoading(false);
      }
    };

    loadManifest();
  }, []);

  const filteredResults = searchQuery 
    ? flatItems.filter(item => {
        const query = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inContent = item.type === 'article' && (item as ManifestItemWithContent).content?.toLowerCase().includes(query);
        return inTitle || inDesc || inContent;
      })
    : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
        <div className="text-center italic text-[#d4af37]">Загрузка Библіотеки...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-4xl font-serif text-[#d4af37] mb-8 uppercase tracking-[0.2em] text-center border-b-2 border-[#d4af37]/30 pb-4 w-full">
        Библіотека
      </h2>

      {/* Search Bar */}
      <div className="w-full relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/50" size={20} />
        <input 
          type="text"
          placeholder="Поискъ въ архивѣ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1e130c] border border-[#3d2b20] rounded-full py-4 pl-12 pr-6 text-[#f4ecd8] focus:border-[#d4af37] focus:outline-none transition-colors shadow-inner font-serif italic"
        />
      </div>
      
      <div className="w-full flex flex-col gap-4">
        {searchQuery ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-[#856a54] uppercase tracking-widest text-xs mb-2">
              Результаты поиска ({filteredResults?.length})
            </h3>
            {filteredResults?.map(item => (
              <div key={item.id}>
                {item.type === 'article' ? (
                  <Link 
                    to={`/articles/${item.id}`}
                    className="glass-sidebar p-6 flex flex-col gap-2 hover:bg-[rgba(255,255,255,0.12)] transition-colors border-l-4 border-l-[#d4af37]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="text-[#d4af37]" size={14} />
                      <h3 className="text-xl font-bold text-[#f4ecd8]">{item.title}</h3>
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{item.description}</p>
                    {item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <p className="text-xs opacity-50 italic mt-1">
                        ...{item.content.substring(
                          Math.max(0, item.content.toLowerCase().indexOf(searchQuery.toLowerCase()) - 30),
                          item.content.toLowerCase().indexOf(searchQuery.toLowerCase()) + 50
                        )}...
                      </p>
                    )}
                    <span className="text-xs text-[#d4af37] mt-2 uppercase tracking-widest">Открыть фоліантъ →</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-[#1e130c] border border-[#3d2b20] rounded-lg">
                    <Folder className="text-[#d4af37]" size={18} />
                    <div>
                      <h3 className="text-lg font-serif text-[#d4af37] leading-none">{item.title}</h3>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Папка архива</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredResults?.length === 0 && (
              <div className="text-center py-20 opacity-50 italic">По вашему запросу ничего не найдено.</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <ItemRenderer key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {!searchQuery && items.length === 0 && (
          <div className="text-center opacity-50 py-20 border-2 border-dashed border-[#3d2b20] rounded-xl italic">
            Архивы пока пусты. Приходите позже.
          </div>
        )}
      </div>
    </div>
  );
}
