import { defineConfig }             from 'sanity'
import { structureTool }           from 'sanity/structure'
import { visionTool }              from '@sanity/vision'
import { presentationTool }        from 'sanity/presentation'
import { schemaTypes }             from './schemaTypes'
import { GenerateArticleAction }   from './actions/GenerateArticleAction'
import { AnalysisDesk }            from './tools/AnalysisDesk'

const FRONTEND_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000'

export default defineConfig({
  name:      'the-platform',
  title:     'The Platform — Newsroom',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset:   process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('The Platform')
          .items([
            S.listItem().title('Articles').schemaType('article').child(S.documentTypeList('article')),
            S.listItem().title('Opinions').schemaType('opinion').child(S.documentTypeList('opinion')),
            S.listItem().title('Fact Checks').schemaType('factCheck').child(S.documentTypeList('factCheck')),
            S.listItem().title('Categories').schemaType('category').child(S.documentTypeList('category')),
            S.listItem().title('Authors').schemaType('author').child(S.documentTypeList('author')),

            S.divider(),

            S.listItem()
              .title('New Leads')
              .child(
                S.documentList()
                  .title('New Leads')
                  .filter('_type == "newsLead" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Federal Leads')
              .child(
                S.documentList()
                  .title('Federal')
                  .filter('_type == "newsLead" && sourceLevel == "federal" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('State Leads')
              .child(
                S.documentList()
                  .title('State Government')
                  .filter('_type == "newsLead" && sourceLevel == "state" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('NGO & Civil Society')
              .child(
                S.documentList()
                  .title('NGOs')
                  .filter('_type == "newsLead" && sourceLevel == "ngo" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('International')
              .child(
                S.documentList()
                  .title('International')
                  .filter('_type == "newsLead" && sourceLevel == "international" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('In Progress')
              .child(
                S.documentList()
                  .title('Writing')
                  .filter('_type == "newsLead" && status == "writing"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),

            S.divider(),

            S.listItem()
              .title('Economy Leads')
              .child(
                S.documentList()
                  .title('Economy')
                  .filter('_type == "newsLead" && category == "economy" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Healthcare Leads')
              .child(
                S.documentList()
                  .title('Healthcare')
                  .filter('_type == "newsLead" && category == "healthcare" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Technology Leads')
              .child(
                S.documentList()
                  .title('Technology')
                  .filter('_type == "newsLead" && category == "technology" && status == "new"')
                  .defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('All Leads')
              .schemaType('newsLead')
              .child(S.documentTypeList('newsLead').defaultOrdering([{ field: 'fetchedAt', direction: 'desc' }])),
          ]),
    }),
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
  tools: [
    {
      name: 'analysis-desk',
      title: 'Analysis Desk',
      component: AnalysisDesk,
    },
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, ctx) =>
      ctx.schemaType === 'newsLead'
        ? [GenerateArticleAction, ...prev]
        : prev,
  },
})
