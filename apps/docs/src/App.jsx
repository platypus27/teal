import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { FoundationsPage } from './pages/FoundationsPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ModulePage } from './pages/ModulePage.jsx'
import { RecipesPage } from './pages/RecipesPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="foundations" element={<FoundationsPage />} />
        <Route path="modules/:moduleId" element={<ModulePage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
