import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Spinner } from '@kryv/teal'
import { Layout } from './components/Layout.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx').then((module) => ({ default: module.HomePage })))
const FoundationsPage = lazy(() =>
  import('./pages/FoundationsPage.jsx').then((module) => ({ default: module.FoundationsPage })),
)
const ChangelogPage = lazy(() =>
  import('./pages/ChangelogPage.jsx').then((module) => ({ default: module.ChangelogPage })),
)
const ModulePage = lazy(() => import('./pages/ModulePage.jsx').then((module) => ({ default: module.ModulePage })))
const RecipesPage = lazy(() => import('./pages/RecipesPage.jsx').then((module) => ({ default: module.RecipesPage })))
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage.jsx').then((module) => ({ default: module.NotFoundPage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="foundations"
          element={
            <Suspense fallback={<PageLoader />}>
              <FoundationsPage />
            </Suspense>
          }
        />
        <Route
          path="changelog"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChangelogPage />
            </Suspense>
          }
        />
        <Route
          path="modules/:moduleId"
          element={
            <Suspense fallback={<PageLoader />}>
              <ModulePage />
            </Suspense>
          }
        />
        <Route
          path="recipes"
          element={
            <Suspense fallback={<PageLoader />}>
              <RecipesPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
