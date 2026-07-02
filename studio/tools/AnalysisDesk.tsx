import { useState } from 'react'
import { Badge, Box, Button, Card, Flex, Heading, Spinner, Stack, Text } from '@sanity/ui'

const FRONTEND_URL = process.env.SANITY_STUDIO_FRONTEND_URL ?? 'https://frontend-chi-one-27.vercel.app'
const GENERATE_SECRET = process.env.SANITY_STUDIO_GENERATE_SECRET ?? ''

interface CandidateIssue {
  title: string
  summary: string
  whyItMatters: string
  suggestedAngle: string
  urgency: 'breaking' | 'developing' | 'evergreen'
  categorySlug: string
}

interface DraftResult {
  draftId: string
  title: string
  studioUrl: string
}

const URGENCY_TONE: Record<string, 'critical' | 'caution' | 'primary'> = {
  breaking: 'critical',
  developing: 'caution',
  evergreen: 'primary',
}

export function AnalysisDesk() {
  const [issues, setIssues] = useState<CandidateIssue[]>([])
  const [discovering, setDiscovering] = useState(false)
  const [draftingIndex, setDraftingIndex] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<Record<number, DraftResult>>({})
  const [error, setError] = useState<string | null>(null)
  const [lastRun, setLastRun] = useState<string | null>(null)

  const discover = async () => {
    setDiscovering(true)
    setError(null)
    setIssues([])
    setDrafts({})
    try {
      const res = await fetch(`${FRONTEND_URL}/api/editorial/discover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GENERATE_SECRET}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
      setIssues(data.issues ?? [])
      setLastRun(new Date().toLocaleTimeString())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDiscovering(false)
    }
  }

  const draft = async (issue: CandidateIssue, index: number) => {
    setDraftingIndex(index)
    setError(null)
    try {
      const res = await fetch(`${FRONTEND_URL}/api/editorial/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GENERATE_SECRET}`,
        },
        body: JSON.stringify({
          title: issue.title,
          summary: issue.summary,
          suggestedAngle: issue.suggestedAngle,
          categorySlug: issue.categorySlug,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
      setDrafts((prev) => ({ ...prev, [index]: data }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDraftingIndex(null)
    }
  }

  return (
    <Box padding={4} style={{ maxWidth: 860, margin: '0 auto' }}>
      <Stack space={4}>
        <Card padding={4} radius={3} shadow={1} tone="primary">
          <Stack space={3}>
            <Heading size={2}>📰 Analysis Desk</Heading>
            <Text size={1} muted>
              Scans the web for the biggest Nigerian stories of the past 72 hours, ranked by
              analysis potential. Pick one and the desk researches it, drafts a News Analysis in
              house style (generic &ldquo;online sources&rdquo; attribution), and saves it as a
              draft article — with a ready-made AI image prompt.
            </Text>
            <Flex gap={3} align="center">
              <Button
                text={discovering ? 'Scanning the news…' : '🔍 Find Trending Issues'}
                tone="primary"
                disabled={discovering || draftingIndex !== null}
                onClick={discover}
              />
              {discovering && <Spinner muted />}
              {lastRun && !discovering && (
                <Text size={1} muted>
                  Last scan: {lastRun}
                </Text>
              )}
            </Flex>
            {discovering && (
              <Text size={1} muted>
                This takes 30–90 seconds — the desk is running live web searches.
              </Text>
            )}
          </Stack>
        </Card>

        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {issues.map((issue, i) => (
          <Card key={i} padding={4} radius={3} shadow={1}>
            <Stack space={3}>
              <Flex align="center" gap={2}>
                <Badge tone={URGENCY_TONE[issue.urgency] ?? 'primary'}>{issue.urgency}</Badge>
                <Badge mode="outline">{issue.categorySlug}</Badge>
              </Flex>
              <Heading size={1}>
                {i + 1}. {issue.title}
              </Heading>
              <Text size={1}>{issue.summary}</Text>
              <Text size={1} muted>
                <strong>Why it matters:</strong> {issue.whyItMatters}
              </Text>
              <Text size={1} muted>
                <strong>Suggested angle:</strong> {issue.suggestedAngle}
              </Text>
              <Flex gap={3} align="center">
                {drafts[i] ? (
                  <Button
                    as="a"
                    href={drafts[i].studioUrl}
                    text="✅ Open Draft Article →"
                    tone="positive"
                  />
                ) : (
                  <Button
                    text={draftingIndex === i ? 'Researching & writing…' : '✍️ Draft Analysis'}
                    tone="positive"
                    mode="ghost"
                    disabled={draftingIndex !== null || discovering}
                    onClick={() => draft(issue, i)}
                  />
                )}
                {draftingIndex === i && <Spinner muted />}
              </Flex>
              {draftingIndex === i && (
                <Text size={1} muted>
                  Researching sources and drafting — usually 1–3 minutes. Keep this tab open.
                </Text>
              )}
            </Stack>
          </Card>
        ))}

        {!discovering && issues.length === 0 && !error && (
          <Card padding={4} radius={3} border>
            <Text size={1} muted>
              No issues loaded yet. Click <strong>Find Trending Issues</strong> to scan the news.
            </Text>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
