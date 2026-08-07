import { CheckboxCard } from '@kryv/teal'
import { Bell, Mail, MessageSquare } from 'lucide-react'

export function CheckboxCardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-3">
        <CheckboxCard
          title="Email digest"
          description="A weekly summary of workspace activity"
          icon={<Mail />}
          defaultChecked
        />
        <CheckboxCard
          title="Push mentions"
          description="Only when someone tags you"
          icon={<Bell />}
        />
        <CheckboxCard
          title="SMS alerts"
          description="Unavailable on your plan"
          icon={<MessageSquare />}
          disabled
        />
      </div>
    )
  }

  return (
    <CheckboxCard
      className="w-full max-w-md"
      title="Design updates"
      description="New components, tokens, and pattern guidance"
      defaultChecked
    />
  )
}
