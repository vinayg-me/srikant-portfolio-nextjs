import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projects & Credits',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Roles / Category (e.g. Orchestrator, Music Programmer)',
      type: 'string',
      description: 'Used for credit descriptors (comma separated roles)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'filterCategory',
      title: 'Filter Category Tag',
      type: 'string',
      options: {
        list: [
          { title: 'Orchestrator', value: 'orchestrator' },
          { title: 'Music Producer / Programmer', value: 'programmer' },
          { title: 'Composer', value: 'composer' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imdbLink',
      title: 'IMDB / Project Link',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'releaseYear',
      title: 'Release Year',
      type: 'number',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Used to sort credits sequentially on the website.',
    }),
  ],
})
