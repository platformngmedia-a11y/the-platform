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
    defineField({
      name: 'expertise',
      title: 'Expertise / Beats',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g., Politics, Economics, Technology, Health',
    }),
    defineField({
      name: 'credibilityBadge',
      title: 'Credibility Badge',
      type: 'string',
      options: {
        list: [
          { title: '✓ Verified Journalist', value: 'verified' },
          { title: '★ Senior Editor', value: 'senior' },
          { title: '★ Contributor', value: 'contributor' },
          { title: 'Staff Writer', value: 'staff' },
        ],
      },
      description: 'Badge shown next to author name on articles',
    }),
    defineField({
      name: 'articlesPublished',
      title: 'Articles Published',
      type: 'number',
      description: 'Total number of articles published (auto-incremented)',
      initialValue: 0,
    }),
    defineField({
      name: 'isVerifiedJournalist',
      title: 'Verified Journalist?',
      type: 'boolean',
      initialValue: false,
      description: 'Verified journalists get a special badge and higher credibility score',
    }),
    defineField({ name: 'twitter', type: 'url' }),
    defineField({ name: 'email',   type: 'string' }),
  ],
})