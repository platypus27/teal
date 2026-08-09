import { mountDocs } from './bootstrap.jsx'
import { Layout } from './components/Layout.jsx'
import { ModulePage } from './pages/ModulePage.jsx'

mountDocs(
  <Layout>
    <ModulePage />
  </Layout>,
)
