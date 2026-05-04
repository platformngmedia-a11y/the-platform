import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset:   process.env.SANITY_STUDIO_DATASET,
  },
  studioHost: 'platformngmedia-studio',
  deployment: {
    appId: 'migivyegwzktgwgulge6lu3j',
  },
})