import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author / Journalist',
  type: 'document',
  fields: [
    defineField({ name: 'name',    type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug',    type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'image',   type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio',     type: 'text' }),
    defineField({ name: 'role',    type: 'string', title: 'Role / Beat' }),
    defineField({ name: 'twitter', type: 'url' }),
    defineField({ name: 'email',   type: 'string' }),
  ],
})