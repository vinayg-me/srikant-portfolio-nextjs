import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { projectId, dataset } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Srikant Krishna Portfolio Studio',

  projectId: projectId,
  dataset: dataset,

  basePath: '/studio',

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
