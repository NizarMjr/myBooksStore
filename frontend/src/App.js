import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Content from './components/Content';
import BookDetail from './components/BookDetail';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import UserDetails from './components/UserDetails';
import Favorites from './components/Favorites';
import ProgressBarLoader from './components/ProgressBarLoader';
import ScrollToTop from './components/ScrollToTop';

function AppContent({ appLoading }) {
  const location = useLocation();

  const hideLayout = ['/login', '/signup'].includes(location.pathname);

  if (appLoading) return <ProgressBarLoader />;

  return (
    <>
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/' exact element={<Content />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path='/user/:id' element={<UserDetails />} />
        <Route path='/favorites' element={<Favorites />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/health`);
        if (res.ok) setAppLoading(false);
      } catch (err) {
        setAppLoading(false);
      }
    };
    checkServer();
  }, []);

  return (
    <BrowserRouter>
      <AppContent appLoading={appLoading} />
    </BrowserRouter>
  );
}

export default App;