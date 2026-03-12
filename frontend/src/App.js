import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { useEffect } from 'react';

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/health`);
        if (res.ok)
          setAppLoading(false);
      } catch (err) {
        setAppLoading(false);
      }
    };

    checkServer();
  }, []);

  if (appLoading) return <ProgressBarLoader />;
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/' exact element={<Content />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route
          path="/admin/dashboard"
          element={
            <Dashboard />
          }
        />
        <Route path='/user/:id' element={<UserDetails />} />
        <Route path='/favorites' element={<Favorites />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
