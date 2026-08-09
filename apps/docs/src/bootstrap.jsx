import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import '@kryv/teal/styles.css'
import '@kryv/teal/base.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/manrope/latin-800.css'
import '@fontsource/plus-jakarta-sans/latin-500.css'
import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/plus-jakarta-sans/latin-700.css'
import '@fontsource/plus-jakarta-sans/latin-800.css'
import './styles.css'

export function mountDocs(app) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>{app}</StrictMode>,
  )
}
