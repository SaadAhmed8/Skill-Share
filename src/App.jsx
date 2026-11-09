// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { BecomeMentorPage } from './pages/BecomeMentorPage';
import { MentorsListPage } from './pages/MentorsListPage';
import { MentorDetailPage } from './pages/MentorDetailPage';
import { SessionsPage } from './pages/SessionsPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ScrollToHash } from './components/ScrollToHash';
import { PageTransition } from './components/PageTransition';
import { HelpChat } from './components/HelpChat';
import { Toaster } from 'sonner';
import { useApp } from './context/AppContext';

// Protected route: requires auth, saves target path
function RequireAuth({ children }) {
  const { currentUser } = useApp();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/become-a-mentor" element={<BecomeMentorPage />} />
      <Route
        path="/mentors"
        element={
          <RequireAuth>
            <MentorsListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mentors/:id"
        element={
          <RequireAuth>
            <MentorDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/sessions"
        element={
          <RequireAuth>
            <SessionsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToHash />
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--green-400)] focus:text-[var(--ink)] focus:font-semibold focus:rounded-full"
        >
          Skip to main content
        </a>

        <div className="min-h-screen bg-[var(--white)] text-[var(--ink)] flex flex-col font-sans">
          <Navbar />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#0B0B0B',
                border: '1px solid #E3E5E0',
                borderRadius: '14px',
              },
            }}
          />

          <main id="main-content" className="flex-1 w-full">
            <PageTransition>
              <AppRoutes />
            </PageTransition>
          </main>

          <Footer />
          <HelpChat />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
