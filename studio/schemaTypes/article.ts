import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: R => R.required() }),
    defineField({
      name: 'mainImage', type: 'image', options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: R => R.required() }),
      ],
    }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: R => R.required() }),
    defineField({ name: 'updatedAt',   type: 'datetime', title: 'Last updated' }),
    defineField({ name: 'isBreaking',    title: 'Breaking news?',         type: 'boolean', initialValue: false }),
    defineField({ name: 'isFeatured',    title: 'Featured (lead story)?', type: 'boolean', initialValue: false }),
    defineField({ name: 'isEditorsPick', title: "Editor's pick?",          type: 'boolean', initialValue: false }),
    defineField({ name: 'readingTime',   title: 'Reading time (minutes)',  type: 'number' }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Analysis', value: 'analysis' },
          { title: 'Investigation', value: 'investigation' },
          { title: 'Explainer', value: 'explainer' },
        ],
      },
    }),
    defineField({
      name: 'sourcesUsed',
      title: 'Sources & References',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Source Name' }),
            defineField({ name: 'url', type: 'url', title: 'Source URL' }),
            defineField({
              name: 'type',
              type: 'string',
              options: {
                list: [
                  { title: 'Official Statement', value: 'official' },
                  { title: 'News Report', value: 'news' },
                  { title: 'Government Data', value: 'government' },
                  { title: 'Academic Research', value: 'research' },
                  { title: 'Interview', value: 'interview' },
                  { title: 'Other', value: 'other' },
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'wordCount',
      title: 'Word Count',
      type: 'number',
      description: 'Auto-calculate or manually set article length',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed / Edited by',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Editor or senior journalist who reviewed this article',
    }),
    defineField({
      name: 'correctionsApplied',
      title: 'Corrections Applied',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'date', type: 'datetime', title: 'Correction Date' }),
            defineField({ name: 'description', type: 'text', title: 'What was corrected' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'linkedFactChecks',
      title: 'Related Fact-Checks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'factCheck' }] }],
      description: 'Link fact-checks that verify or address claims in this article',
    }),
    defineField({
      name: 'editorNotes',
      title: 'Editor Notes',
      type: 'text',
      rows: 4,
      description: 'Internal notes about this article (not visible to readers)',
    }),
    defineField({
      name: 'body', type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image', options: { hotspot: true },
          fields: [
            defineField({ name: 'alt',     type: 'string' }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        },
        {
          type: 'object', name: 'callout', title: 'Callout box',
          fields: [
            defineField({ name: 'text', type: 'text' }),
            defineField({
              name: 'type', type: 'string',
              options: { list: ['info', 'warning', 'quote'] },
            }),
          ],
        },
      ],
    }),
    defineField({ name: 'seoTitle',       type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  ],
  preview: {
    select: {
      title:      'title',
      author:     'author.name',
      media:      'mainImage',
      isBreaking: 'isBreaking',
      isFeatured: 'isFeatured',
    },
    prepare({ title, author, media, isBreaking, isFeatured }) {
      const flags = [isBreaking && '🔴', isFeatured && '⭐'].filter(Boolean).join(' ')
      return { title: flags ? `${flags} ${title}` : title, subtitle: author, media }
    },
  },
})