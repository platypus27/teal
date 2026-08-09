import { lazy, Suspense } from 'react'
import { Outlet, Route, Routes } from 'react-router'
import { Spinner } from '@kryv/teal'
import { Layout } from './components/Layout.jsx'

const LazyHomePage = lazy(() => import('./pages/HomePage.jsx').then((module) => ({ default: module.HomePage })))
const FoundationsPage = lazy(() =>
  import('./pages/FoundationsPage.jsx').then((module) => ({ default: module.FoundationsPage })),
)
const ChangelogPage = lazy(() =>
  import('./pages/ChangelogPage.jsx').then((module) => ({ default: module.ChangelogPage })),
)
const LazyModulePage = lazy(() =>
  import('./pages/ModulePage.jsx').then((module) => ({ default: module.ModulePage })),
)
const LazyRecipesPage = lazy(() =>
  import('./pages/RecipesPage.jsx').then((module) => ({ default: module.RecipesPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage.jsx').then((module) => ({ default: module.NotFoundPage })),
)
const VisualQaPage = lazy(() =>
  import('./pages/VisualQaPage.jsx').then((module) => ({ default: module.VisualQaPage })),
)
const ShowcasePage = lazy(() =>
  import('./pages/ShowcasePage.jsx').then((module) => ({ default: module.ShowcasePage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function ModulePageLoader() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-teal-on-surface-variant">
      <Spinner size="lg" aria-hidden="true" />
      <span>Loading module examples...</span>
    </div>
  )
}

function DocumentPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function RoutedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App({
  HomePageComponent = LazyHomePage,
  ModulePageComponent = LazyModulePage,
  RecipesPageComponent = LazyRecipesPage,
}) {
  return (
    <Routes>
      <Route
        path="visual-qa"
        element={
          <Suspense fallback={<PageLoader />}>
            <VisualQaPage />
          </Suspense>
        }
      />
      <Route
        path="showcase"
        element={
          <Suspense fallback={<PageLoader />}>
            <ShowcasePage />
          </Suspense>
        }
      />
      <Route element={<RoutedLayout />}>
        <Route
          index
          element={
            <DocumentPage>
              <HomePageComponent />
            </DocumentPage>
          }
        />
        <Route
          path="foundations"
          element={
            <DocumentPage>
              <FoundationsPage />
            </DocumentPage>
          }
        />
        <Route
          path="changelog"
          element={
            <DocumentPage>
              <ChangelogPage />
            </DocumentPage>
          }
        />
        <Route
          path="modules/:moduleId"
          element={
            <Suspense fallback={<ModulePageLoader />}>
              <ModulePageComponent />
            </Suspense>
          }
        />
        <Route
          path="recipes"
          element={
            <DocumentPage>
              <RecipesPageComponent />
            </DocumentPage>
          }
        />
        <Route
          path="*"
          element={
            <DocumentPage>
              <NotFoundPage />
            </DocumentPage>
          }
        />
      </Route>
    </Routes>
  )
}
