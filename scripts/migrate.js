const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const axios = require('axios')
const { createClient } = require('@sanity/client')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fri0t1qb'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!writeToken) {
  console.error('ERROR: SANITY_API_WRITE_TOKEN is missing in .env.local.')
  console.error('Please generate a Write Token in your Sanity Manage Dashboard (Settings -> API -> Tokens) and add it to your .env.local file.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-30',
  token: writeToken,
  useCdn: false,
})

const GATSBY_CONTENT_PATH = 'H:/Web Projects/srikant-portfolio-gatsby/content/data'

async function uploadImage(url) {
  if (!url) return null
  try {
    console.log(`Downloading image: ${url}`)
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')
    const filename = path.basename(url.split('?')[0])
    
    const asset = await client.assets.upload('image', buffer, {
      filename,
    })
    console.log(`Uploaded image asset: ${asset._id}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`Failed to upload image from URL: ${url}`, error.message)
    return null
  }
}

async function migrateProfile() {
  console.log('\n--- Migrating Bio & Profile ---')
  const bioFile = path.join(GATSBY_CONTENT_PATH, 'about-me/about-me-section-1.md')
  const heroFile = path.join(GATSBY_CONTENT_PATH, 'hero/hero-section.md')

  if (!fs.existsSync(bioFile) || !fs.existsSync(heroFile)) {
    console.error('Profile or Hero files do not exist in Gatsby directory.')
    return
  }

  const bioContent = matter(fs.readFileSync(bioFile, 'utf8'))
  const heroContent = matter(fs.readFileSync(heroFile, 'utf8'))

  const name = heroContent.data.personName || 'Srikant Krishna'
  const headline = heroContent.data.headline || 'Music Composer | Music Producer | Orchestrator'
  const bio = bioContent.content.trim() || bioContent.data.content
  const yrsOfExp = bioContent.data.yrsOfExp || 10
  const completedProjects = bioContent.data.projects || 350
  const noOfClients = bioContent.data.noOfClients || 200

  const imageUrl = heroContent.data.bgImage || bioContent.data.aboutImage
  const profileImage = await uploadImage(imageUrl)

  const tabs = bioContent.data["tabsContent,"] || bioContent.data["tabsContent"] || {}
  const skills = tabs.skillsTab || []
  
  const experienceBreakdown = (tabs.experienceTab || []).map(exp => ({
    _key: Math.random().toString(36).substr(2, 9),
    noOfProjects: exp.noOfProjects,
    typeOfProject: exp.typeOfProject
  }))

  const educationBreakdown = (tabs.educationTab || []).map(edu => ({
    _key: Math.random().toString(36).substr(2, 9),
    titleOfDegree: edu.titleOfDegree,
    college: edu.college,
    years: edu.years
  }))

  const doc = {
    _type: 'profile',
    _id: 'srikant-profile',
    name,
    headline,
    bio,
    profileImage,
    yearsOfExp: yrsOfExp,
    completedProjects,
    noOfClients,
    skills,
    experienceBreakdown,
    educationBreakdown
  }

  await client.createOrReplace(doc)
  console.log('Successfully migrated Profile!')
}

async function migrateProjects() {
  console.log('\n--- Migrating Projects & Credits ---')
  const portfolioDir = path.join(GATSBY_CONTENT_PATH, 'portfolio')
  if (!fs.existsSync(portfolioDir)) {
    console.error('Portfolio folder does not exist.')
    return
  }

  const files = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const filePath = path.join(portfolioDir, file)
    const content = matter(fs.readFileSync(filePath, 'utf8'))
    const { id, title, category, link, portfolio_image, image } = content.data

    const imgUrl = portfolio_image || image
    const coverImage = await uploadImage(imgUrl)

    let filterCategory = 'composer'
    if (category.toLowerCase().includes('orchestrator')) {
      filterCategory = 'orchestrator'
    } else if (category.toLowerCase().includes('programmer') || category.toLowerCase().includes('producer')) {
      filterCategory = 'programmer'
    }

    const doc = {
      _type: 'project',
      _id: `project-${id || file.replace('.md', '')}`,
      title: title || 'Untitled Project',
      category: category || 'Orchestrator',
      filterCategory,
      coverImage,
      imdbLink: link || undefined,
      releaseYear: 2022,
      order: id || 99
    }

    await client.createOrReplace(doc)
    console.log(`Migrated Project: ${title}`)
  }
}

async function migrateTracks() {
  console.log('\n--- Migrating Audio Tracks ---')
  const workDir = path.join(GATSBY_CONTENT_PATH, 'my-work')
  if (!fs.existsSync(workDir)) {
    console.error('My Work folder does not exist.')
    return
  }

  const files = fs.readdirSync(workDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const filePath = path.join(workDir, file)
    const content = matter(fs.readFileSync(filePath, 'utf8'))
    const { my_work_id, my_work_src, my_work_title } = content.data

    if (!my_work_title) continue

    let category = 'Action'
    if (my_work_title.toLowerCase().includes('epic') || my_work_title.toLowerCase().includes('ethnic')) {
      category = 'Epic'
    } else if (my_work_title.toLowerCase().includes('drama') || my_work_title.toLowerCase().includes('romantic')) {
      category = 'Drama'
    } else if (my_work_title.toLowerCase().includes('ambient') || my_work_title.toLowerCase().includes('soundscape')) {
      category = 'Ambient'
    }

    const doc = {
      _type: 'track',
      _id: `track-${my_work_id || file.replace('.md', '')}`,
      title: my_work_title,
      category,
      soundcloudUrl: my_work_src,
      order: my_work_id || 99
    }

    await client.createOrReplace(doc)
    console.log(`Migrated Track: ${my_work_title}`)
  }
}

async function migrateTestimonials() {
  console.log('\n--- Migrating Testimonials ---')
  const testimonialsDir = path.join(GATSBY_CONTENT_PATH, 'testimonials')
  if (!fs.existsSync(testimonialsDir)) {
    console.error('Testimonials folder does not exist.')
    return
  }

  const files = fs.readdirSync(testimonialsDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const filePath = path.join(testimonialsDir, file)
    const content = matter(fs.readFileSync(filePath, 'utf8'))
    const { my_testimonial_id, my_testimonial_name, my_testimonial_profession, my_testimonial_image } = content.data

    const avatar = await uploadImage(my_testimonial_image)

    const doc = {
      _type: 'testimonial',
      _id: `testimonial-${my_testimonial_id || file.replace('.md', '')}`,
      author: my_testimonial_name || 'Anonymous',
      role: my_testimonial_profession || 'Client',
      quote: content.content.trim(),
      avatar,
      order: my_testimonial_id || 99
    }

    await client.createOrReplace(doc)
    console.log(`Migrated Testimonial: ${my_testimonial_name}`)
  }
}

async function run() {
  try {
    await migrateProfile()
    await migrateProjects()
    await migrateTracks()
    await migrateTestimonials()
    console.log('\n✅ All migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

run()
