import moduleGroups from '../generated/module-index.json'

export const catalogGroups = moduleGroups

export const catalog = catalogGroups.flatMap((group) => group.modules)
