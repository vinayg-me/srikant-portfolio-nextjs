import { defineField, defineType } from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Bio & Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline / Title',
      type: 'string',
      description: 'e.g., Music Composer | Music Producer | Orchestrator',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Story',
      type: 'text',
      description: 'The story displayed on the About Me section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'yearsOfExp',
      title: 'Years of Experience',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'completedProjects',
      title: 'Completed Projects',
      type: 'number',
      initialValue: 350,
    }),
    defineField({
      name: 'noOfClients',
      title: 'Number of Clients',
      type: 'number',
      initialValue: 200,
    }),
    defineField({
      name: 'skills',
      title: 'Skills & DAW Software',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Logic Pro X',
        'Protools',
        'Cubase',
        'FL Studio',
        'Digital Performer',
        'Sibelius',
        'Vienna Ensemble Pro',
      ],
    }),
    defineField({
      name: 'experienceBreakdown',
      title: 'Experience Tab Content',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'noOfProjects', type: 'string', title: 'Number of Projects (e.g., 100+ projects)' },
            { name: 'typeOfProject', type: 'string', title: 'Type of Project (e.g., Orchestration)' },
          ],
        },
      ],
    }),
    defineField({
      name: 'educationBreakdown',
      title: 'Education Tab Content',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titleOfDegree', type: 'string', title: 'Degree Title' },
            { name: 'college', type: 'string', title: 'College/University' },
            { name: 'years', type: 'string', title: 'Years (e.g., 2018 - 2019)' },
          ],
        },
      ],
    }),
  ],
})
