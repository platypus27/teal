import { mountDocs } from './bootstrap.jsx'
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'

if (window.location.pathname === '/') {
  mountDocs(
    <Layout>
      <HomePage />
    </Layout>,
  )
} else {
  void import('./routed-main.jsx')
}
