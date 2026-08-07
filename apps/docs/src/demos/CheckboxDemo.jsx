import { useState } from 'react'
import { Checkbox, Fieldset } from '@kryv/teal'

export function CheckboxDemo({ exampleIndex = 0 }) {
  const [reports, setReports] = useState(['usage'])

  if (exampleIndex === 3) {
    return (
      <Fieldset
        className="w-full max-w-sm"
        legend="Report permissions"
        description="Each permission applies independently of the others"
      >
        <Checkbox label="View reports" description="Read every shared report" defaultChecked />
        <Checkbox label="Edit dashboards" description="Change charts and layout" />
        <Checkbox label="Manage scheduled exports" description="Create or cancel recurring exports" />
      </Fieldset>
    )
  }

  if (exampleIndex === 1) {
    const all = ['usage', 'billing', 'audit']
    const parentChecked =
      reports.length === all.length ? true : reports.length === 0 ? false : 'indeterminate'
    const toggle = (id) =>
      setReports((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      )
    return (
      <div className="grid w-full max-w-sm gap-3">
        <Checkbox
          label="All reports"
          checked={parentChecked}
          onCheckedChange={(checked) => setReports(checked ? all : [])}
        />
        <div className="grid gap-3 pl-7">
          <Checkbox label="Usage summary" checked={reports.includes('usage')} onCheckedChange={() => toggle('usage')} />
          <Checkbox label="Billing detail" checked={reports.includes('billing')} onCheckedChange={() => toggle('billing')} />
          <Checkbox label="Audit log" checked={reports.includes('audit')} onCheckedChange={() => toggle('audit')} />
        </div>
      </div>
    )
  }

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
