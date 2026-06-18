import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import CoursesPage from './pages/lms/CoursesPage';
import EnrollmentsPage from './pages/lms/EnrollmentsPage';
import TrainingPage from './pages/training/TrainingPage';
import PerformancePage from './pages/performance/PerformancePage';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import ReportsPage from './pages/reports/ReportsPage';
// Main Comprehensive Workforce Module
import WorkforceMaster from './pages/employees/WorkforceMaster';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* All Workforce Management mapped directly to Master Suite */}
        <Route path="employees" element={<WorkforceMaster />} />
        <Route path="employees/new" element={<WorkforceMaster />} />
        <Route path="employees/:id" element={<WorkforceMaster />} />
        <Route path="employees/:id/edit" element={<WorkforceMaster />} />
        <Route path="profit-loss" element={<WorkforceMaster />} />
        
        <Route path="recruitment" element={<RecruitmentPage />} />
        <Route path="lms/courses" element={<CoursesPage />} />
        <Route path="lms/enrollments" element={<EnrollmentsPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}