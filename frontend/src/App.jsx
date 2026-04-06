import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardPage from './pages/BoardPage';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/board/:id"
              element={
                <AppLayout>
                  <BoardPage />
                </AppLayout>
              }
            />
          </Route>

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
