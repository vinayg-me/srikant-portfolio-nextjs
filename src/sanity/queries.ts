export const profileQuery = `*[_type == "profile"][0]`
export const projectsQuery = `*[_type == "project"] | order(order asc)`
export const tracksQuery = `*[_type == "track"] | order(order asc) {
  ...,
  "audioUrl": audioFile.asset->url
}`
export const testimonialsQuery = `*[_type == "testimonial"] | order(order asc)`
