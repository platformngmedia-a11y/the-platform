import { defineType, defineField } from 'sanity'

export const opinion = defineType({
  name: 'opinion',
  title: 'Opinion / Analysis',
  type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',        type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt',     type: 'text', rows: 2 }),
    defineField({ name: 'author',      type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'mainImage',   type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'isFeatured',  type: 'boolean', initialValue: false }),
    defineField({ name: 'body',        type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'categories', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
  ],
})