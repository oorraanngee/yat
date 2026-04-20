import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import PostView from './components/PostView';
import Admin from './components/Admin';
import DevHub from './components/DevHub';

export default function App() {
  // Проверяем домен или путь для отображения Dev Hub страницы
  const hostname = window.location.hostname;
  const isHubSite = hostname === 'yiat-dev.vercel.app' || 
                    hostname === 'yat-git.vercel.app' || 
                    window.location.pathname === '/hub' ||
                    window.location.search.includes('site=hub');

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
          <div className="frame-container w-full max-w-5xl p-6 md:p-10 flex flex-col min-h-[85vh]">
            <div className="ornament"></div>
            
            {isHubSite ? (
              <DevHub />
            ) : (
              <>
                <Navbar />
                <main className="flex-grow flex flex-col w-full relative z-10">
                   <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="/post/:id" element={<PostView />} />
                     <Route path="/admin" element={<Admin />} />
                   </Routes>
                </main>
                <Footer />
              </>
            )}
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
