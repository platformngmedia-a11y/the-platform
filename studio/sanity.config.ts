import { defineConfig }      from 'sanity'
import { structureTool }    from 'sanity/structure'
import { visionTool }       from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes }      from './schemaTypes'

const FRONTEND_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000'

export default defineConfig({
  name:      'the-platform',
  title:     'The Platform — Newsroom',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset:   process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: FRONTEND_URL,
        draftMode: {
          enable: `${FRONTEND_URL}/api/draft-mode/enable`,
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
})