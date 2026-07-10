import { Page } from '../components/Page.jsx'
import { EmptyState } from '../../../ui'

export function ComingSoon({ title }) {
  return (
    <Page
      title={title}
      description={`${title} are planned but not part of teal yet. This page is a placeholder so the navigation matches the shape of a full design-system site.`}
    >
      <div className="max-w-md">
        <EmptyState icon="construction" title="Coming soon" message={`${title} will be tracked in ROADMAP.md.`} />
      </div>
    </Page>
  )
}
