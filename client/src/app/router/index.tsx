import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import HomePage from '@/pages/home/HomePage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded admin pages for code splitting
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ProjectsPage = lazy(() => import('@/pages/admin/ProjectsPage'));
const SkillsPage = lazy(() => import('@/pages/admin/SkillsPage'));
const ExperiencePage = lazy(() => import('@/pages/admin/ExperiencePage'));
const ServicesPage = lazy(() => import('@/pages/admin/ServicesPage'));
const TestimonialsPage = lazy(() => import('@/pages/admin/TestimonialsPage'));
const CertificatesPage = lazy(() => import('@/pages/admin/CertificatesPage'));
const EducationPage = lazy(() => import('@/pages/admin/EducationPage'));
const HeroPage = lazy(() => import('@/pages/admin/HeroPage'));
const AboutPage = lazy(() => import('@/pages/admin/AboutPage'));
const SocialsPage = lazy(() => import('@/pages/admin/SocialsPage'));
const MessagesPage = lazy(() => import('@/pages/admin/MessagesPage'));
const MediaLibraryPage = lazy(() => import('@/pages/admin/MediaLibraryPage'));
const ResumePage = lazy(() => import('@/pages/admin/ResumePage'));
const ProfilePage = lazy(() => import('@/pages/admin/ProfilePage'));
const SeoSettingsPage = lazy(() => import('@/pages/admin/SeoSettingsPage'));
const WebsiteSettingsPage = lazy(() => import('@/pages/admin/WebsiteSettingsPage'));

function AdminPageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
  );
}

function WithSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<AdminPageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hero" element={WithSuspense(HeroPage)} />
          <Route path="about" element={WithSuspense(AboutPage)} />
          <Route path="projects" element={WithSuspense(ProjectsPage)} />
          <Route path="skills" element={WithSuspense(SkillsPage)} />
          <Route path="experience" element={WithSuspense(ExperiencePage)} />
          <Route path="services" element={WithSuspense(ServicesPage)} />
          <Route path="testimonials" element={WithSuspense(TestimonialsPage)} />
          <Route path="achievements" element={WithSuspense(CertificatesPage)} />
          <Route path="education" element={WithSuspense(EducationPage)} />
          <Route path="certificates" element={WithSuspense(CertificatesPage)} />
          <Route path="images" element={WithSuspense(MediaLibraryPage)} />
          <Route path="resume" element={WithSuspense(ResumePage)} />
          <Route path="messages" element={WithSuspense(MessagesPage)} />
          <Route path="socials" element={WithSuspense(SocialsPage)} />
          <Route path="seo" element={WithSuspense(SeoSettingsPage)} />
          <Route path="settings" element={WithSuspense(WebsiteSettingsPage)} />
          <Route path="profile" element={WithSuspense(ProfilePage)} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
  { basename: '/portfolio/' }
);

export default router;