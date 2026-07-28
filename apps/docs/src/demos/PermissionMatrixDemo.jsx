import { Badge, PermissionMatrix } from '@kryv/teal'

export function PermissionMatrixDemo({ exampleIndex = 0 }) {
  return exampleIndex ? (
    <PermissionMatrix
      caption="Entitlement review"
      columns={[
        { id: 'yang', label: 'Yang Operations' },
        { id: 'trict', label: 'Trict' },
      ]}
      rows={[
        {
          id: 'operate',
          label: 'Operate',
          cells: {
            yang: <Badge variant="success">Granted</Badge>,
            trict: <Badge variant="warning">Step-up required</Badge>,
          },
        },
      ]}
    />
  ) : (
    <PermissionMatrix
      caption="Household application access"
      columns={[
        { id: 'photos', label: 'Photos' },
        { id: 'yang', label: 'Yang Operations' },
        { id: 'trict', label: 'Trict' },
      ]}
      rows={[
        {
          id: 'avery',
          label: 'Avery',
          cells: {
            photos: <Badge variant="success">Owner</Badge>,
            yang: 'Operate',
            trict: 'Research',
          },
        },
        {
          id: 'blair',
          label: 'Blair',
          cells: { photos: 'Member' },
        },
      ]}
    />
  )
}
