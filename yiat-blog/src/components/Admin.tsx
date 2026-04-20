import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import { useNavigate, useSearchParams } from 'react-router';

export default function Admin() {
  const { userData, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
     if (authLoading) return;
     if (!userData?.isAdmin) {
         navigate('/');
     }
  }, [userData, authLoading, navigate]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
      async function fetchPostToEdit() {
          if (editId) {
             const docRef = doc(db, 'posts', editId);
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 const p = docSnap.data() as Post;
                 setTitle(p.title);
                 setContent(p.content);
                 setIsEditing(true);
             }
          } else {
             setTitle('');
             setContent('');
             setIsEditing(false);
          }
      }
      fetchPostToEdit();
  }, [editId]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content || !userData) return;
    setSaving(true);
    
    try {
      if (isEditing && editId) {
         const docRef = doc(db, 'posts', editId);
         await updateDoc(docRef, {
            title,
            content,
            updatedAt: new Date().toISOString()
         });
         setSearchParams({});
      } else {
         await addDoc(collection(db, 'posts'), {
            title,
            content,
            authorId: userData.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
         });
         setTitle('');
         setContent('');
      }
      fetchPosts();
    } catch (error) {
       console.error("Save error:", error);
    } finally {
       setSaving(false);
    }
  }

  async function handleDelete(id: string) {
      if (!confirm('Точно удалить?')) return;
      try {
          await deleteDoc(doc(db, 'posts', id));
          fetchPosts();
      } catch (error) {
          console.error(error);
      }
  }

  if (authLoading || loading) return <div className="text-center mt-10">Загрузка...</div>;
  if (!userData?.isAdmin) return null; // Handled by effect, but as a fallback

  return (
    <div className="max-w-5xl mx-auto mt-8 w-full px-4 flex flex-col md:flex-row gap-8">
      
      <div className="flex-1">
         <h1 className="text-2xl font-serif text-[var(--color-yat-gold-light)] mb-6 uppercase tracking-widest">
            {isEditing ? 'Редактировать статью' : 'Новая статья'}
         </h1>
         
         <form onSubmit={handleSave} className="yat-card p-6 flex flex-col gap-4">
             <input 
               type="text" 
               placeholder="Заголовок" 
               value={title}
               onChange={e => setTitle(e.target.value)}
               className="w-full bg-[var(--color-yat-bg)] border border-[var(--color-yat-border)] rounded p-3 text-[var(--color-yat-text)] outline-none focus:border-[var(--color-yat-gold-dark)] font-serif text-xl"
               required
             />
             
             <textarea 
               placeholder="Содержимое (Markdown)" 
               value={content}
               onChange={e => setContent(e.target.value)}
               className="w-full min-h-[400px] bg-[var(--color-yat-bg)] border border-[var(--color-yat-border)] rounded p-3 text-[var(--color-yat-text)] outline-none focus:border-[var(--color-yat-gold-dark)] resize-y font-mono text-sm leading-relaxed"
               required
             />
             
             <div className="flex justify-between items-center mt-2">
                 {isEditing && (
                     <button type="button" onClick={() => setSearchParams({})} className="text-sm uppercase tracking-widest text-[var(--color-yat-text-muted)] hover:text-white">
                         Отмена
                     </button>
                 )}
                 <button 
                    type="submit" 
                    disabled={saving}
                    className="yat-gold-gradient py-3 px-8 rounded tracking-widest ml-auto disabled:opacity-50"
                 >
                    {saving ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Опубликовать')}
                 </button>
             </div>
         </form>
      </div>

      <div className="w-full md:w-80 flex-shrink-0">
         <h2 className="text-lg font-serif text-[var(--color-yat-gold-dark)] mb-4 uppercase tracking-widest border-b border-[var(--color-yat-border)] pb-2">
             Все записи
         </h2>
         <div className="flex flex-col gap-3">
             {posts.map(post => (
                 <div key={post.id} className="yat-card p-4 text-sm relative group border-opacity-50">
                    <h3 className="font-bold text-[var(--color-yat-gold)] mb-2 font-serif">{post.title}</h3>
                    <div className="text-xs text-[var(--color-yat-text-muted)] mb-3">
                        {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex gap-4 border-t border-[var(--color-yat-border)] pt-2 border-opacity-50">
                        <button 
                           onClick={() => setSearchParams({ edit: post.id! })}
                           className="text-[var(--color-yat-gold-dark)] hover:text-[var(--color-yat-gold)] uppercase text-[10px] tracking-widest font-bold"
                        >
                           Редакт.
                        </button>
                        <button 
                           onClick={() => handleDelete(post.id!)}
                           className="text-red-900 hover:text-red-500 uppercase text-[10px] tracking-widest font-bold"
                        >
                           Удалить
                        </button>
                    </div>
                 </div>
             ))}
             {posts.length === 0 && <div className="text-[var(--color-yat-text-muted)] text-sm italic">Нет записей</div>}
         </div>
      </div>
      
    </div>
  );
}
