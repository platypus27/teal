import { Accordion } from '@kryv/teal'

const securityItems = [
  {
    value: 'sign-in',
    title: 'Sign-in notifications',
    content: 'Get alerted when a new device signs in to your account.',
  },
  {
    value: 'sessions',
    title: 'Active sessions',
    content: 'Review and revoke sessions from the security page.',
  },
  {
    value: 'recovery',
    title: 'Recovery keys',
    content: 'Store recovery keys somewhere safe; each key bypasses two-factor sign-in once.',
    disabled: true,
  },
]

export function AccordionDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return <Accordion multiple defaultValue={['sign-in']} items={securityItems} className="w-full max-w-lg" />
  }
  return <Accordion defaultValue="sign-in" items={securityItems} className="w-full max-w-lg" />
}
