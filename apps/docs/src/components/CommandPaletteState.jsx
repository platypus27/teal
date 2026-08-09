import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CommandPaletteContext = createContext(null)

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (!context) throw new Error('useCommandPalette must be used within a CommandPaletteProvider')
  return context
}

export function CommandPaletteProvider({ children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target
        const tagName = target?.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) return
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])
  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>
}
