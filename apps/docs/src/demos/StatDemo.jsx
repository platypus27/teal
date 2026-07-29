import { Sparkline, Stat } from '@kryv/teal'

export function StatDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xs">
        <Stat label="Weekly sign-ups" value="1,284" delta={{ direction: 'up', value: '+8.1%' }}>
          <Sparkline aria-label="Sign-ups trending up over twelve weeks" data={[4, 6, 5, 8, 7, 9, 8, 10, 9, 12, 11, 14]} variant="area" width={220} />
        </Stat>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-10">
      <Stat label="Monthly recurring revenue" value="$48.2k" delta={{ direction: 'up', value: '+12.4%' }} description="vs. previous month" />
      <Stat label="Active incidents" value="3" delta={{ direction: 'down', value: '-2' }} description="vs. previous week" />
      <Stat label="Open reports" value="14" delta={{ direction: 'flat', value: '0' }} description="unchanged" />
    </div>
  )
}
