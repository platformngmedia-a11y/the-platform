import { defineType, defineField } from 'sanity'

export const factCheck = defineType({
  name: 'factCheck',
  title: 'Fact Check',
  type: 'document',
  fields: [
    defineField({ name: 'claim',     type: 'string', title: 'Claim being checked', validation: R => R.required() }),
    defineField({ name: 'slug',      type: 'slug', options: { source: 'claim' }, validation: R => R.required() }),
    defineField({ name: 'claimant',  type: 'string', title: 'Who made the claim?' }),
    defineField({ name: 'claimedOn', type: 'date',   title: 'Date claim was made' }),
    defineField({
      name: 'verdict', type: 'string', validation: R => R.required(),
      options: {
        list: [
          { title: '✅ True',         value: 'true' },
          { title: '🟡 Partly True',  value: 'partly-true' },
          { title: '❌ False',        value: 'false' },
          { title: '⚠️ Misleading',   value: 'misleading' },
          { title: '❓ Unverifiable', value: 'unverifiable' },
        ],
      },
    }),
    defineField({ name: 'summary',    type: 'text',  title: 'One-paragraph verdict summary' }),
    defineField({
      name: 'body', type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'sources',    type: 'array', of: [{ type: 'url' }], title: 'Source links' }),
    defineField({ name: 'checkedBy',  type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'isFeatured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'claim', verdict: 'verdict' },
    prepare({ title, verdict }) {
      const icons: Record<string, string> = {
        true: '✅', 'partly-true': '🟡', false: '❌',
        misleading: '⚠️', unverifiable: '❓',
      }
      return { title: `${icons[verdict] ?? ''} ${title}` }
    },
  },
})