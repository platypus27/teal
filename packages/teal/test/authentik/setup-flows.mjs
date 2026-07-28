// Creates the fixture objects the reference screenshots need: a household
// user, a recovery flow, an OAuth provider + application (consent), and a
// deny policy binding (denial). Idempotent: looks up by slug/name first.
const base = 'http://127.0.0.1:19000'
const headers = { Authorization: 'Bearer authentik-fixture-token', 'Content-Type': 'application/json' }

async function api(path, method = 'GET', body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  if (!response.ok) throw new Error(`${method} ${path} failed: ${response.status} ${await response.text()}`)
  return response.status === 204 ? null : response.json()
}

async function findBySlug(path, slug) {
  const data = await api(`${path}?slug=${encodeURIComponent(slug)}`)
  return data.results[0] ?? null
}

async function findByName(path, name) {
  const data = await api(`${path}?search=${encodeURIComponent(name)}`)
  return data.results.find((entry) => entry.name === name) ?? null
}

async function ensure(path, lookup, payload) {
  const existing = await findBySlug(path, lookup)
  if (existing) return existing
  return api(path, 'POST', payload)
}

async function ensureNamed(path, name, payload) {
  const existing = await findByName(path, name)
  if (existing) return existing
  return api(path, 'POST', payload)
}

// Fixture user for authenticated journeys.
const existingUser = (await api('/api/v3/core/users/?username=fixture-owner')).results[0]
if (!existingUser) {
  const user = await api('/api/v3/core/users/', 'POST', {
    username: 'fixture-owner',
    name: 'Fixture Owner',
    email: 'owner@kryvlabs.example',
    is_active: true,
  })
  await api(`/api/v3/core/users/${user.pk}/set_password/`, 'POST', { password: 'fixture-owner-password' })
}

// Recovery flow: identification-only fixture so the first screen is honest.
const identificationStage = await ensure('/api/v3/stages/identification/', 'fixture-recovery-identification', {
  name: 'fixture-recovery-identification',
  user_fields: ['email'],
  case_sensitive: false,
  show_matched_user: false,
})
const recoveryFlow = await ensure('/api/v3/flows/instances/', 'fixture-recovery', {
  name: 'Account recovery',
  slug: 'fixture-recovery',
  designation: 'recovery',
  title: 'Recover your account',
})
const bindings = await api(`/api/v3/flows/bindings/?target=${recoveryFlow.pk}`)
if (bindings.results.length === 0) {
  await api('/api/v3/flows/bindings/', 'POST', {
    target: recoveryFlow.pk,
    stage: identificationStage.pk,
    order: 0,
  })
}

// Consent: fixture authorization flow with an always-ask consent stage so the
// screenshot is deterministic regardless of prior grants.
let consentStage = (await api('/api/v3/stages/consent/?name=fixture-consent-always')).results[0]
if (!consentStage) {
  consentStage = await api('/api/v3/stages/consent/', 'POST', {
    name: 'fixture-consent-always',
    mode: 'always_require',
  })
}
const authorizationFlow = await ensure('/api/v3/flows/instances/', 'fixture-authorization', {
  name: 'Fixture authorization',
  slug: 'fixture-authorization',
  designation: 'authorization',
  title: 'Authorize %(app)s',
})
const authorizationBindings = await api(`/api/v3/flows/bindings/?target=${authorizationFlow.pk}`)
if (authorizationBindings.results.length === 0) {
  await api('/api/v3/flows/bindings/', 'POST', {
    target: authorizationFlow.pk,
    stage: consentStage.pk,
    order: 0,
  })
}

const invalidationFlow = await findBySlug('/api/v3/flows/instances/', 'default-provider-invalidation-flow')

async function ensureApplication(slug, name) {
  const desiredRedirectUris = [{ matching_mode: 'strict', url: `https://${slug}.kryvlabs.example/auth/callback` }]
  const provider = await ensureNamed('/api/v3/providers/oauth2/', slug, {
    name: slug,
    authorization_flow: authorizationFlow.pk,
    invalidation_flow: invalidationFlow.pk,
    client_type: 'confidential',
    client_id: slug,
    client_secret: `${slug}-secret`,
    redirect_uris: desiredRedirectUris,
    grant_types: ['authorization_code', 'refresh_token'],
  })
  const providerPatch = {}
  if (provider.authorization_flow !== authorizationFlow.pk) providerPatch.authorization_flow = authorizationFlow.pk
  if (!provider.grant_types?.includes('authorization_code')) {
    providerPatch.grant_types = ['authorization_code', 'refresh_token']
  }
  if (JSON.stringify(provider.redirect_uris?.map(({ matching_mode, url }) => ({ matching_mode, url }))) !== JSON.stringify(desiredRedirectUris)) {
    providerPatch.redirect_uris = desiredRedirectUris
  }
  if (Object.keys(providerPatch).length > 0) {
    await api(`/api/v3/providers/oauth2/${provider.pk}/`, 'PATCH', providerPatch)
  }
  const existing = await fetch(`${base}/api/v3/core/applications/${slug}/`, { headers })
  if (existing.ok) return { provider, application: await existing.json() }
  const application = await api('/api/v3/core/applications/', 'POST', {
    name,
    slug,
    provider: provider.pk,
  })
  return { provider, application }
}

const { application } = await ensureApplication('fixture-photos', 'Fixture Photos')
const { application: deniedApplication } = await ensureApplication('fixture-vault', 'Fixture Vault')

// Denial: an expression policy that always denies, bound to the application.
let denyPolicy = (await api('/api/v3/policies/expression/?name=fixture-deny-all')).results[0]
if (!denyPolicy) {
  denyPolicy = await api('/api/v3/policies/expression/', 'POST', {
    name: 'fixture-deny-all',
    expression: 'return False',
  })
}
const existingBindings = (await api(`/api/v3/policies/bindings/?policy=${denyPolicy.pk}`)).results
for (const binding of existingBindings) {
  if (binding.target !== deniedApplication.pk) {
    await api(`/api/v3/policies/bindings/${binding.pk}/`, 'DELETE')
  }
}
if (!existingBindings.some((binding) => binding.target === deniedApplication.pk)) {
  await api('/api/v3/policies/bindings/', 'POST', {
    policy: denyPolicy.pk,
    target: deniedApplication.pk,
    order: 0,
    negate: false,
    enabled: true,
    timeout: 30,
    failure_result: false,
  })
}

console.log('Fixture flows ready:', {
  recovery: recoveryFlow.slug,
  application: application.slug,
  deniedApplication: deniedApplication.slug,
  denyPolicy: denyPolicy.name,
})
