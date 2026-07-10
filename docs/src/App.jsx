import { useState } from 'react'
import { Sidebar } from './components/Sidebar.jsx'
import { NAV, COMPONENTS } from './data/components.jsx'
import { GettingStarted } from './pages/GettingStarted.jsx'
import { Tokens } from './pages/Tokens.jsx'
import { ComponentDoc } from './pages/ComponentDoc.jsx'
import { ComingSoon } from './pages/ComingSoon.jsx'

const SPECIAL = {
  'getting-started': GettingStarted,
  tokens: Tokens,
  blocks: () => <ComingSoon title="Blocks" />,
  charts: () => <ComingSoon title="Charts" />,
}

export default function App() {
  const [active, setActive] = useState('getting-started')

  let content
  if (SPECIAL[active]) {
    const Page = SPECIAL[active]
    content = <Page />
  } else {
    const meta = COMPONENTS.find((c) => c.id === active)
    content = meta ? <ComponentDoc meta={meta} /> : <GettingStarted />
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar nav={NAV} active={active} onSelect={setActive} />
      <main className="ml-64">{content}</main>
    </div>
  )
}
