import { mountDocs } from './bootstrap.jsx'
import { Layout } from './components/Layout.jsx'
import { RecipesPage } from './pages/RecipesPage.jsx'

mountDocs(
  <Layout>
    <RecipesPage />
  </Layout>,
)
