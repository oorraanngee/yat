import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    // First fetch the manifest to find the correct filename
    fetch('/articles/manifest.json')
      .then(res => res.json())
      .then((data: { items: ManifestItem[] }) => {
        let articleMeta: ArticleMeta | undefined;
        
        // Search through items and categories
        for (const item of data.items || []) {
          if (item.type === 'article' && item.id === slug) {
            articleMeta = item;
            break;
          } else if (item.type === 'category') {
            const found = item.items.find(a => a.id === slug);
            if (found) {
              articleMeta = found;
              break;
            }
          }
        }

        if (!articleMeta) {
          throw new Error('Статья не найдена');
        }
        return fetch(`/articles/${articleMeta.filename}`);
      })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки текста статьи');
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10 opacity-70">Загрузка статьи...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-[#8b0000] font-bold bg-[#f4ecd8] px-4 py-2 inline-block rounded">{error}</p>
        <div className="mt-4">
          <Link to="/articles" className="text-[#d4af37] hover:underline">← Вернуться къ списку</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4 w-full max-w-4xl mx-auto">
      <div className="w-full mb-6">
        <Link to="/articles" className="text-[#d4af37] text-sm hover:underline uppercase tracking-widest">
          ← Всѣ статьи
        </Link>
      </div>
      
      <div className="text-area-container w-full p-8 md:p-12">
        <div className="markdown-body relative z-10">
          <Markdown remarkPlugins={[remarkGfm]}>
            {content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
