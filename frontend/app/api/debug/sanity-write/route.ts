// TEMPORARY diagnostic endpoint — remove after the Sanity 403 investigation.
import { createHash } from 'crypto'
import { adminClient } from '@/lib/sanity/adminClient'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.SANITY_API_WRITE_TOKEN ?? ''
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? ''
  const fingerprint = token ? createHash('sha256').update(token).digest('hex').slice(0, 12) : 'EMPTY'

  const out: Record<string, any> = { tokenLength: token.length, tokenFingerprint: fingerprint, projectId, dataset }

  // Test A: raw fetch, PUBLISHED (non-draft) doc create + delete
  const rawRes = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mutations: [
        { createOrReplace: { _id: 'debug-published-healthcheck', _type: 'newsLead', sourceHeadline: 'healthcheck', status: 'archived' } },
        { delete: { id: 'debug-published-healthcheck' } },
      ],
    }),
  })
  out.rawPublished = { status: rawRes.status, body: (await rawRes.text()).slice(0, 300) }

  // Test B: adminClient.create — the exact call the crons make
  try {
    const doc = await adminClient.create({
      _type: 'newsLead',
      sourceHeadline: 'adminClient healthcheck',
      status: 'archived',
      fetchedAt: new Date().toISOString(),
    })
    await adminClient.delete(doc._id)
    out.adminClientCreate = { ok: true, id: doc._id }
  } catch (err: any) {
    out.adminClientCreate = {
      ok: false,
      name: err?.name,
      statusCode: err?.statusCode,
      message: (err?.message ?? '').slice(0, 300),
      responseBody: JSON.stringify(err?.response?.body ?? err?.details ?? null)?.slice(0, 500),
    }
  }

  // Config the client believes it has (no secrets)
  out.clientConfig = {
    apiVersion: (adminClient as any).config?.().apiVersion,
    useCdn: (adminClient as any).config?.().useCdn,
    hasToken: Boolean((adminClient as any).config?.().token),
    apiHost: (adminClient as any).config?.().apiHost,
  }

  return Response.json(out)
}
