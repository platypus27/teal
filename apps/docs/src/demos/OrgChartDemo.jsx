import { OrgChart } from '@kryv/teal'

export function OrgChartDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <OrgChart
        label="Support org (partially collapsed)"
        defaultCollapsedIds={['emea']}
        root={{
          id: 'lead',
          name: 'Priya',
          title: 'Support Lead',
          children: [
            {
              id: 'emea',
              name: 'Jonas',
              title: 'EMEA',
              children: [
                { id: 'ber', name: 'Marta', title: 'Berlin' },
                { id: 'lon', name: 'Theo', title: 'London' },
              ],
            },
            { id: 'apac', name: 'Rin', title: 'APAC' },
          ],
        }}
      />
    )
  }

  return (
    <OrgChart
      root={{
        id: 'ceo',
        name: 'Ada',
        title: 'CEO',
        children: [
          {
            id: 'cto',
            name: 'Ben',
            title: 'CTO',
            children: [
              { id: 'dev', name: 'Cleo', title: 'Engineering' },
              { id: 'qa', name: 'Eli', title: 'Quality' },
            ],
          },
          {
            id: 'cfo',
            name: 'Dana',
            title: 'CFO',
            children: [{ id: 'fin', name: 'Gus', title: 'Finance' }],
          },
        ],
      }}
    />
  )
}
