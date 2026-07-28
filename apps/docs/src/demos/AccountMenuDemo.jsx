import { AccountMenu } from '@kryv/teal'
import { Clock } from 'lucide-react'

export function AccountMenuDemo({ exampleIndex = 0 }) {
  return (
    <AccountMenu
      user={{ name: 'Avery Chen', email: 'avery@kryvlabs.example' }}
      items={
        exampleIndex
          ? []
          : [{ id: 'sessions', label: 'Active sessions', icon: <Clock />, onSelect: () => undefined }]
      }
      appSignOut={{ label: 'Sign out of Photos', onSelect: () => undefined }}
      ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => undefined }}
    />
  )
}
