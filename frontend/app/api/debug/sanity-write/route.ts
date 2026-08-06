// TEMPORARY diagnostic endpoint — remove after the Sanity 403 investigation.
import { createHash } from 'crypto'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.SANITY_API_WRITE_TOKEN ?? ''
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? ''

  const fingerprint = token ? createHash('sha256').update(token).digest('hex').slice(0, 12) : 'EMPTY'

  // Raw mutate attempt — create + delete a draft healthcheck doc in one transaction
  const res = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mutations: [
        { createOrReplace: { _id: 'drafts.write-healthcheck', _type: 'newsLead', sourceHeadline: 'healthcheck', status: 'archived' } },
        { delete: { id: 'drafts.write-healthcheck' } },
      ],
    }),
  })

  const body = await res.text()

  return Response.json({
    tokenLength: token.length,
    tokenFingerprint: fingerprint,
    projectId,
    dataset,
    mutateStatus: res.status,
    mutateBody: body.slice(0, 500),
  })
}
