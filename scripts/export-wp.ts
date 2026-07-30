/// <reference types="node" />
import fs from 'node:fs/promises'

const WP_URL = process.env.NUXT_PUBLIC_WP_API_BASE_URL || process.env.WP_API_BASE_URL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const OUT_DIR = './public/wp-data'

async function fetchEndpoint(endpoint: string) {
  const url = `${WP_URL}/${endpoint}?per_page=100`
  console.log(`Fetching from ${url}...`)
  
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`)
  }
  
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error(`Expected array from ${endpoint}, got ${typeof data}`)
  }
  return data
}

async function exportData() {
  if (!WP_URL) {
    console.error('Error: No WP_API_BASE_URL environment variable provided.')
    process.exit(1)
  }

  try {
    await fs.mkdir(OUT_DIR, { recursive: true })

    const [pages, posts] = await Promise.all([
      fetchEndpoint('pages'),
      fetchEndpoint('posts')
    ])

    await Promise.all([
      fs.writeFile(`${OUT_DIR}/pages.json`, JSON.stringify(pages, null, 2)),
      fs.writeFile(`${OUT_DIR}/posts.json`, JSON.stringify(posts, null, 2))
    ])

    console.log(`Saved ${pages.length} pages to ${OUT_DIR}/pages.json`)
    console.log(`Saved ${posts.length} posts to ${OUT_DIR}/posts.json`)
  } catch (error) {
    console.error('Export failed:', error)
    process.exit(1)
  }
}

exportData()