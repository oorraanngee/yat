import { Folder, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth(); // Need to trigger re-renders if auth changes

  useEffect(() => {
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
         console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 w-full px-4">
      <div className="flex flex-col items-center mb-16 pt-8 pb-4">
         <h1 className="text-4xl font-serif text-[var(--color-yat-gold)] mb-4 text-center mt-4">
            Дневник Проекта Ять
         </h1>
         <p className="text-[#d4cfc1] text-sm text-center font-bold tracking-wide w-full max-w-2xl leading-relaxed">
            Проект «Ять» — это сборник полезных инструментов и интересных статей. <br/>
            Ниже собрана история обновлений, лог разработки и статьи, описывающие прогресс нашего проекта.
         </p>
      </div>

      <div className="mb-4">
         {loading ? (
             <div className="text-center text-[var(--color-yat-gold-dark)] text-sm my-12 tracking-widest uppercase">Загрузка записей...</div>
         ) : posts.length === 0 ? (
             <div className="text-center py-10 text-[var(--color-yat-text-muted)] text-sm border border-[#443324] rounded border-opacity-50 my-8">
                 <p>Пока нет записей. {userData?.isAdmin ? 'Зайдите в админ-панель (АДМИН сверху), чтобы создать первую.' : ''}</p>
             </div>
         ) : (
             <div className="border-l border-[var(--color-yat-gold-dark)] ml-3 pb-8 pl-8 flex flex-col gap-10 border-opacity-30 relative top-4">
               {posts.map((post) => (
                  <div key={post.id} className="relative group">
                     <FileText className="absolute -left-[54px] top-6 text-[#8c713b] bg-[var(--color-yat-bg)] py-1 opacity-70" size={20} strokeWidth={1.5} />
                     <div className="yat-card p-6 md:p-8 border-[#3b2c21] transition-all hover:border-[#634e32]">
                        <div className="flex flex-col gap-1 mb-4 border-b border-[#3b2c21] pb-4">
                           <h3 className="text-2xl font-serif text-[var(--color-yat-gold-light)] font-medium leading-snug">{post.title}</h3>
                        </div>
                        <p className="text-sm text-[#d4cfc1] mb-6 leading-relaxed font-serif opacity-80 line-clamp-3">
                            {post.content.replace(/<[^>]+>/g, '').substring(0, 200)}...
                        </p>
                        <div className="flex justify-between items-center text-xs tracking-widest font-bold uppercase mt-4">
                            <span className="text-[#8c713b]">
                                {format(new Date(post.createdAt), 'dd.MM.yyyy')}
                            </span>
                            <Link to={`/post/${post.id}`} className="text-[#c39c4a] hover:text-[#e6b95c] transition-colors py-2 px-4 rounded border border-[#3b2c21] hover:border-[#634e32] bg-[#271c14] shadow-sm">
                                Читать статью
                            </Link>
                        </div>
                     </div>
                  </div>
               ))}
             </div>
         )}
      </div>
    </div>
  );
}
