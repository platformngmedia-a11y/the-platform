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
    defineField({ name: 'isBreaking',    title: 'Breaking news?',         type: 'boolean', initialValue: false }),
    defineField({ name: 'isFeatured',    title: 'Featured (lead story)?', type: 'boolean', initialValue: false }),
    defineField({ name: 'isEditorsPick', title: "Editor's pick?",          type: 'boolean', initialValue: false }),
    defineField({ name: 'readingTime',   title: 'Reading time (minutes)',  type: 'number' }),
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