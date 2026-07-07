import { defineType, defineField } from 'sanity'

export const newsLead = defineType({
  name: 'newsLead',
  title: 'News Lead',
  type: 'document',
  fields: [
    defineField({ name: 'sourceHeadline', title: 'Headline', type: 'string', readOnly: true }),
    defineField({ name: 'sourceSummary', title: 'Summary', type: 'text', readOnly: true }),
    defineField({ name: 'sourceUrl', title: 'Source URL', type: 'url', readOnly: true }),
    defineField({ name: 'sourceOrg', title: 'Source Organisation', type: 'string', readOnly: true }),
    defineField({
      name: 'sourceLevel',
      title: 'Source Level',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Federal', value: 'federal' },
          { title: 'State', value: 'state' },
          { title: 'NGO / Civil Society', value: 'ngo' },
          { title: 'International', value: 'international' },
          { title: 'National Press', value: 'press' },
          { title: 'Sport', value: 'sport' },
        ],
      },
    }),
    defineField({
      name: 'zone',
      title: 'Geopolitical Zone',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'South West', value: 'south_west' },
          { title: 'South South', value: 'south_south' },
          { title: 'South East', value: 'south_east' },
          { title: 'North Central', value: 'north_central' },
          { title: 'North West', value: 'north_west' },
          { title: 'North East', value: 'north_east' },
        ],
      },
      hidden: ({ document }: any) => document?.sourceLevel !== 'state',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Politics', value: 'politics' },
          { title: 'Economy', value: 'economy' },
          { title: 'Nigeria', value: 'nigeria' },
          { title: 'World', value: 'world' },
          { title: 'Technology', value: 'technology' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Sport', value: 'sport' },
          { title: 'Education', value: 'education' },
        ],
      },
    }),
    defineField({ name: 'fetchedAt', title: 'Fetched At', type: 'datetime', readOnly: true }),
    defineField({
      name: 'fetchStrategy',
      title: 'Fetch Strategy',
      type: 'string',
      readOnly: true,
      options: { list: ['rss', 'html'] },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Writing', value: 'writing' },
          { title: 'Published', value: 'published' },
          { title: 'Skipped', value: 'skipped' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'score',
      title: 'Lead Score (0–12)',
      type: 'number',
      validation: (R) => R.min(0).max(12),
      description: 'Affect (0-3) + Timely (0-3) + Value (0-3) + Fit (0-3)',
    }),
    defineField({
      name: 'editorNotes',
      title: 'Editor Notes',
      type: 'text',
      description: 'Your angle, contacts to call, demographics affected',
    }),
  ],
  preview: {
    select: {
      title: 'sourceHeadline',
      subtitle: 'sourceOrg',
      status: 'status',
      level: 'sourceLevel',
    },
    prepare({ title, subtitle, status, level }: any) {
      const levelTag: Record<string, string> = { federal: '[FED]', state: '[STATE]', ngo: '[NGO]', international: '[INTL]' }
      const statusTag: Record<string, string> = { new: 'NEW', writing: 'WRITING', published: 'DONE', skipped: 'SKIP' }
      return {
        title: `[${statusTag[status] ?? status}] ${title}`,
        subtitle: `${levelTag[level] ?? ''} ${subtitle}`,
      }
    },
  },
  orderings: [
    { title: 'Newest', name: 'newest', by: [{ field: 'fetchedAt', direction: 'desc' }] },
    { title: 'Highest Score', name: 'score', by: [{ field: 'score', direction: 'desc' }] },
  ],
})
