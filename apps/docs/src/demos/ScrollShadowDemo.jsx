import { ScrollShadow } from '@kryv/teal'

const messages = Array.from({ length: 16 }, (_, index) => `Message ${index + 1}: build finished`)

export function ScrollShadowDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ScrollShadow shadowSize={48} className="max-h-40 w-full rounded-xl border border-teal-outline-variant/50 px-4">
        <ul className="space-y-2 py-3 text-sm text-teal-on-surface-variant">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </ScrollShadow>
    )
  }

  return (
    <ScrollShadow className="max-h-40 w-full rounded-xl border border-teal-outline-variant/50 px-4">
      <ul className="space-y-2 py-3 text-sm text-teal-on-surface-variant">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </ScrollShadow>
  )
}
