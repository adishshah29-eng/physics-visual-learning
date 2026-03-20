import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Route Guards
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

// Public Pages
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';

// Onboarding
import Onboarding from '@/pages/Onboarding';

// Protected Pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import { ChapterPage } from '@/pages/ChapterPage';
import ExamSelect from '@/pages/practice/ExamSelect';
import SubjectSelect from '@/pages/practice/SubjectSelect';
import ChapterList from '@/pages/practice/ChapterList';
import ChapterQuestions from '@/pages/practice/ChapterQuestions';
import QuestionView from '@/pages/practice/QuestionView';
import SessionSummary from '@/pages/practice/SessionSummary';
import Analytics from '@/pages/Analytics';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

// Other
import NotFound from '@/pages/NotFound';
import Atmosphere from '@/components/Atmosphere';

const queryClient = new QueryClient();

function AppContent() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <Atmosphere />
      <BrowserRouter>
        <Routes>
          {/* Public routes — redirect to /home if authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
          </Route>

        {/* Onboarding — auth required but no profile check */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected routes — auth + profile required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/learn" element={<Dashboard />} />
          <Route path="/learn/:chapterId" element={<ChapterPage />} />
          <Route path="/practice" element={<ExamSelect />} />
          <Route path="/practice/:exam/subject" element={<SubjectSelect />} />
          <Route path="/practice/:exam/:subject/chapters" element={<ChapterList />} />
          <Route path="/practice/:exam/:subject/:chapter/list" element={<ChapterQuestions />} />
          <Route path="/practice/:exam/:subject/:chapter" element={<QuestionView />} />
          <Route path="/practice/session-summary" element={<SessionSummary />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;