import { BrowserRouter } from 'react-router'
import { mountDocs } from './bootstrap.jsx'

export function mountRoutedDocs(app) {
  mountDocs(<BrowserRouter>{app}</BrowserRouter>)
}
