import { defineField, defineType } from 'sanity'

export const track = defineType({
  name: 'track',
  title: 'Tracks & Audio Previews',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Track Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Track Category (e.g., Action, Epic, Drama, Ambient)',
      type: 'string',
      options: {
        list: [
          { title: 'Action', value: 'Action' },
          { title: 'Epic / Ethnic', value: 'Epic' },
          { title: 'Drama / Romantic', value: 'Drama' },
          { title: 'Ambient / Soundscapes', value: 'Ambient' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audioFile',
      title: 'Direct Audio File (.mp3/.wav)',
      type: 'file',
      description: 'Upload the track preview. Under the free tier, upload files under 10MB.',
      options: {
        accept: 'audio/*',
      },
    }),
    defineField({
      name: 'soundcloudUrl',
      title: 'SoundCloud URL (Fallback)',
      type: 'url',
      description: 'Used if you prefer to embed from SoundCloud.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Track Artwork (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Context about the recording session, orchestration, or client.',
    }),
    defineField({
      name: 'order',
      title: 'Playback Order',
      type: 'number',
    }),
  ],
})
