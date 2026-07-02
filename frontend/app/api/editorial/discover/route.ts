import { discoverIssues } from '@/lib/analysisWriter'

export const maxDuration = 300

const ALLOWED_ORIGINS = [
  'https://platformngmedia-studio.sanity.studio',
  'http://localhost:3333',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) })
}

export async function POST(request: Request) {
  const origin  = request.headers.get('origin')
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin) }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.GENERATE_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers })
  }

  try {
    const issues = await discoverIssues()
    return Response.json({ issues }, { headers })
  } catch (err: any) {
    return Response.json({ error: `Discovery failed: ${err.message}` }, { status: 500, headers })
  }
}
