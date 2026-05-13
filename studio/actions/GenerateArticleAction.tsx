import { useState } from 'react'
import type { DocumentActionProps } from 'sanity'

const FRONTEND_URL = process.env.SANITY_STUDIO_FRONTEND_URL ?? 'https://frontend-chi-one-27.vercel.app'
const GENERATE_SECRET = process.env.SANITY_STUDIO_GENERATE_SECRET ?? ''

export function GenerateArticleAction(props: DocumentActionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [dialog, setDialog] = useState<any>(null)

  if (props.type !== 'newsLead') return null

  return {
    label:    isGenerating ? 'Generating…' : 'Generate Article Draft',
    disabled: isGenerating || props.draft?.status === 'published',
    tone:     'positive' as const,
    onHandle: async () => {
      setIsGenerating(true)
      setDialog(null)
      try {
        const res = await fetch(`${FRONTEND_URL}/api/lead/generate`, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${GENERATE_SECRET}`,
          },
          body: JSON.stringify({ leadId: props.id }),
        })

        const data = await res.json()

        if (!res.ok) {
          setDialog({
            type: 'dialog',
            header: 'Generation failed',
            content: (
              <div style={{ padding: '1rem' }}>
                <p style={{ color: 'red' }}>{data.error ?? 'Unknown error'}</p>
              </div>
            ),
            onClose: () => setDialog(null),
          })
          return
        }

        setDialog({
          type: 'dialog',
          header: 'Article draft created',
          content: (
            <div style={{ padding: '1rem', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{data.title}</p>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
                The draft article has been saved. Open it to review, edit images, and publish when ready.
              </p>
              <a
                href={data.studioUrl}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#0f2a51',
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Open Draft Article →
              </a>
            </div>
          ),
          onClose: () => setDialog(null),
        })
      } catch (err: any) {
        setDialog({
          type: 'dialog',
          header: 'Network error',
          content: (
            <div style={{ padding: '1rem' }}>
              <p style={{ color: 'red' }}>{err.message}</p>
            </div>
          ),
          onClose: () => setDialog(null),
        })
      } finally {
        setIsGenerating(false)
      }
    },
    dialog,
  }
}
