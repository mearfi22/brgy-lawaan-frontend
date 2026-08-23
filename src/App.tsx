import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ResidentFeed from './pages/ResidentFeed';
import RegisterSms from './pages/RegisterSms';
import Directory from './pages/Directory';
import SuggestionForm from './pages/SuggestionForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminResidents from './pages/AdminResidents';
import AdminDirectory from './pages/AdminDirectory';
import AdminSuggestions from './pages/AdminSuggestions';

function App() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // If the page was restored from bfcache (browser back/forward),
      // force a real reload so auth state and forms are always fresh.
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ResidentFeed />} />
          <Route path="/register" element={<RegisterSms />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/report" element={<SuggestionForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/residents" element={<ProtectedRoute><AdminResidents /></ProtectedRoute>} />
          <Route path="/admin/directory" element={<ProtectedRoute><AdminDirectory /></ProtectedRoute>} />
          <Route path="/admin/suggestions" element={<ProtectedRoute><AdminSuggestions /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;