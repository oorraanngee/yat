import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { useAuth } from '../lib/AuthContext';

export default function PostView() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-12 text-[var(--color-yat-text-muted)]">Загрузка статьи...</div>;
  if (!post) return <div className="text-center mt-12 text-[var(--color-yat-text-muted)]">Статья не найдена.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 w-full px-4">
      <div className="flex justify-between items-center mb-10 border-b border-[var(--color-yat-border)] pb-4">
         <Link to="/" className="text-[var(--color-yat-text-muted)] text-xs uppercase tracking-widest hover:text-[var(--color-yat-gold)] flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           Назад
         </Link>
         
         <div className="flex gap-4 items-center">
             <span className="text-xs text-[var(--color-yat-text-muted)]">{format(new Date(post.createdAt), 'dd.MM.yyyy HH:mm')}</span>
             {userData?.isAdmin && (
                 <Link to={`/admin?edit=${post.id}`} className="text-xs text-[var(--color-yat-gold-dark)] hover:text-[var(--color-yat-gold)] uppercase tracking-widest border border-[var(--color-yat-border)] px-2 py-1 rounded">
                     Редактировать
                 </Link>
             )}
         </div>
      </div>

      <article className="yat-card p-10 pb-16">
        <h1 className="text-4xl font-serif text-[var(--color-yat-gold-light)] mb-8 pb-4 border-b border-[var(--color-yat-border)]">{post.title}</h1>
        <div className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
}
