import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',        type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'order',       title: 'Nav order', type: 'number' }),
  ],
})