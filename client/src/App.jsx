import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SavedProducts from './pages/SavedProducts';
import Alerts from './pages/Alerts';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/saved-products" 
                    element={
                      <ProtectedRoute>
                        <SavedProducts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/alerts" 
                    element={
                      <ProtectedRoute>
                        <Alerts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Chatbot />
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;