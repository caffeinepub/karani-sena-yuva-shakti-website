import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import AdmissionFormPage from './pages/AdmissionFormPage';
import AdminPanel from './pages/AdminPanel';
import AdminPrintCardPage from './pages/AdminPrintCardPage';
import ReprintIdCardPage from './pages/ReprintIdCardPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout />
      <ProfileSetupModal />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const admissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admission',
  component: AdmissionFormPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  ),
});

const adminPrintCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/print-card/$admissionId',
  component: () => (
    <ProtectedRoute>
      <AdminPrintCardPage />
    </ProtectedRoute>
  ),
});

const reprintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reprint',
  component: ReprintIdCardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  admissionRoute,
  adminRoute,
  adminPrintCardRoute,
  reprintRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
