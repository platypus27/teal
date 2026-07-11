import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Select,
  Switch,
} from '@kryv/teal'

export function SettingsRecipe() {
  const [alerts, setAlerts] = useState(true)
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex-col items-start justify-start gap-1.5">
        <CardTitle>Account security</CardTitle>
        <CardDescription>Manage sign-in alerts and session policy.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Field label="Security contact" description="Receives account recovery messages">
          <Input type="email" defaultValue="security@example.com" />
        </Field>
        <Field label="Session duration">
          <Select
            defaultValue="8"
            options={[
              { value: '4', label: '4 hours' },
              { value: '8', label: '8 hours' },
              { value: '24', label: '24 hours' },
            ]}
          />
        </Field>
        <Switch
          label="Suspicious sign-in alerts"
          description="Notify administrators when a sign-in looks unusual"
          checked={alerts}
          onCheckedChange={setAlerts}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Save security settings</Button>
      </CardFooter>
    </Card>
  )
}
