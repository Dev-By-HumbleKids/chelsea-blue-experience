import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from '@/components/Toaster';
import HomePage from '@/features/home/HomePage';

const MatchesPage = lazy(() => import('@/features/matches/MatchesPage'));
const MatchDetailPage = lazy(() => import('@/features/matches/MatchDetailPage'));
const SquadPage = lazy(() => import('@/features/squad/SquadPage'));
const PlayerPage = lazy(() => import('@/features/squad/PlayerPage'));
const HistoryPage = lazy(() => import('@/features/heritage/HistoryPage'));
const TrophyRoomPage = lazy(() => import('@/features/heritage/TrophyRoomPage'));
const TrophyDetailPage = lazy(() => import('@/features/heritage/TrophyDetailPage'));
const LegendsPage = lazy(() => import('@/features/heritage/LegendsPage'));
const LegendPage = lazy(() => import('@/features/heritage/LegendPage'));
const NewsPage = lazy(() => import('@/features/news/NewsPage'));
const ArticlePage = lazy(() => import('@/features/news/ArticlePage'));
const StadiumPage = lazy(() => import('@/features/stadium/StadiumPage'));
const TicketsPage = lazy(() => import('@/features/booking/TicketsPage'));
const TourBookingPage = lazy(() => import('@/features/booking/TourBookingPage'));
const MatchTicketPage = lazy(() => import('@/features/booking/MatchTicketPage'));
const ConfirmationPage = lazy(() => import('@/features/booking/ConfirmationPage'));
const AccountPage = lazy(() => import('@/features/account/AccountPage'));
const FanZonePage = lazy(() => import('@/features/fan/FanZonePage'));
const AboutPage = lazy(() => import('@/features/about/AboutPage'));
const NotFoundPage = lazy(() => import('@/features/about/NotFoundPage'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-live="polite">
      <span className="font-display text-xl tracking-[0.3em] text-silver">LOADING</span>
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="matches/:id" element={<MatchDetailPage />} />
          <Route path="squad" element={<SquadPage />} />
          <Route path="squad/:slug" element={<PlayerPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="trophies" element={<TrophyRoomPage />} />
          <Route path="trophies/:slug" element={<TrophyDetailPage />} />
          <Route path="legends" element={<LegendsPage />} />
          <Route path="legends/:slug" element={<LegendPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<ArticlePage />} />
          <Route path="stadium" element={<StadiumPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/tours/:experienceId?" element={<TourBookingPage />} />
          <Route path="tickets/match/:fixtureId" element={<MatchTicketPage />} />
          <Route path="tickets/confirmation/:ref" element={<ConfirmationPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="fan-zone" element={<FanZonePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
