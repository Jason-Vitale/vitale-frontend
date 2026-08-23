import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import MaintenanceBanner from './components/MaintenanceBanner';
import SearchPage from './pages/SearchPage';
import ObjectDetailPage from './pages/ObjectDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <MaintenanceBanner />
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/objects/:noradId" element={<ObjectDetailPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}
