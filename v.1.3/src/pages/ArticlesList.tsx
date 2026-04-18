import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  items: ArticleMeta[];
}

type ManifestItem = ArticleMeta | CategoryMeta;

export default function ArticlesList() {
  const [items, setItems] = useState<ManifestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/articles/manifest.json')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load articles manifest", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 opacity-70">Загрузка статей...</div>;
  }

  return (
    <div className="flex flex-col items-center py-8 w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-serif text-[#d4af37] mb-8 uppercase tracking-widest">Статьи</h2>
      
      <div className="flex flex-col gap-8 w-full">
        {items.map(item => {
          if (item.type === 'category') {
            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="border-b border-[rgba(255,255,255,0.1)] pb-2 mb-2">
                  <h3 className="text-2xl font-serif text-[#d4af37]">{item.title}</h3>
                  <p className="text-sm opacity-70">{item.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 pl-4">
                  {item.items.map(article => (
                    <Link 
                      key={article.id} 
                      to={`/articles/${article.id}`}
                      className="glass-sidebar p-5 flex flex-col gap-2 hover:bg-[rgba(255,255,255,0.12)] transition-colors border-l-2 border-l-[#d4af37]"
                    >
                      <h4 className="text-lg font-bold text-[#f4ecd8]">{article.title}</h4>
                      <p className="text-sm opacity-80 leading-relaxed">{article.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <Link 
                key={item.id} 
                to={`/articles/${item.id}`}
                className="glass-sidebar p-6 flex flex-col gap-2 hover:bg-[rgba(255,255,255,0.12)] transition-colors border-l-4 border-l-[#d4af37]"
              >
                <h3 className="text-xl font-bold text-[#f4ecd8]">{item.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
                <span className="text-xs text-[#d4af37] mt-2 uppercase tracking-widest">Читать далѣе →</span>
              </Link>
            );
          }
        })}
        
        {items.length === 0 && (
          <div className="text-center opacity-50 py-10">
            Нѣтъ доступныхъ статей.
          </div>
        )}
      </div>
    </div>
  );
}
