import { Checkbox } from '@kryv/teal'

export function CheckboxDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Checkbox
        label="Include archived projects"
        description="Show projects that have been archived"
        defaultChecked
      />
      <Checkbox label="Select all reports" defaultChecked="indeterminate" />
      <Checkbox label="Share with external reviewers" />
      <Checkbox label="Billing locked" description="Managed by your administrator" disabled />
    </div>
  )
}
