import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import DepartmentsPage from './pages/employees/DepartmentsPage';
import AttendancePage from './pages/attendance/AttendancePage';
import LeavePage from './pages/attendance/LeavePage';
import PayrollPage from './pages/payroll/PayrollPage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import CoursesPage from './pages/lms/CoursesPage';
import EnrollmentsPage from './pages/lms/EnrollmentsPage';
import TrainingPage from './pages/training/TrainingPage';
import PerformancePage from './pages/performance/PerformancePage';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import AIAdvisorPage from './pages/ai/AIAdvisorPage';
import ReportsPage from './pages/reports/ReportsPage';
import ProfitLossPage from './pages/employees/ProfitLossPage';

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
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="employees/new" element={<EmployeeFormPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leaves" element={<LeavePage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="recruitment" element={<RecruitmentPage />} />
        <Route path="lms/courses" element={<CoursesPage />} />
        <Route path="lms/enrollments" element={<EnrollmentsPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="profit-loss" element={<ProfitLossPage />} />
        <Route path="ai-advisor" element={<AIAdvisorPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
