import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function highlight(code, lang = 'jsx') {
  const source = code.replace(/^\n+|\n+$/g, '')
  const grammar = Prism.languages[lang]
  if (!grammar) return escapeHtml(source)
  return Prism.highlight(source, grammar, lang)
}
