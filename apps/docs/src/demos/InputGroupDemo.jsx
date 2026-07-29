import { Input, InputAddon, InputGroup } from '@kryv/teal'

export function InputGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-xs gap-4">
        <InputGroup>
          <Input aria-label="Storage quota" defaultValue="50" />
          <InputAddon position="trailing">GB</InputAddon>
        </InputGroup>
        <InputGroup>
          <Input aria-label="Hourly rate" defaultValue="120" />
          <InputAddon position="trailing">USD/h</InputAddon>
        </InputGroup>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputAddon position="leading">https://</InputAddon>
        <Input aria-label="Workspace domain" placeholder="workspace.example" />
      </InputGroup>
    </div>
  )
}
