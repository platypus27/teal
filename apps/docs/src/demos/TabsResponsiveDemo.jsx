import { Tabs } from '@kryv/teal'

export function TabsResponsiveDemo() {
  return (
    <div className="w-full max-w-xl">
      <Tabs
        aria-label="Report sections"
        defaultValue="summary"
        items={[
          { value: 'summary', label: 'Executive summary', content: <p className="text-sm">A concise summary stays visible first.</p> },
          { value: 'evidence', label: 'Evidence and activity', content: <p className="text-sm">Detailed evidence is available without changing route context.</p> },
          { value: 'access', label: 'Access policy', content: <p className="text-sm">Permissions remain a peer view of this report.</p> },
        ]}
      />
    </div>
  )
}
