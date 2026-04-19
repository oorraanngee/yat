import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Translator from './pages/Translator';
import ArticlesList from './pages/ArticlesList';
import Article from './pages/Article';
import ApiSetup from './pages/ApiSetup';
import ApiDashboard from './pages/ApiDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="translator" element={<Translator />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/:slug" element={<Article />} />
          <Route path="api-setup" element={<ApiSetup />} />
          <Route path="api-dashboard" element={<ApiDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
