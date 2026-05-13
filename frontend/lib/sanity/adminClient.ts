import { createClient } from 'next-sanity'

export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})
