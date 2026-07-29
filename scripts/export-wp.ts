/// <reference types="node" />
import fs from 'node:fs/promises'

const WP_URL = process.env.NUXT_PUBLIC_WP_API_BASE_URL || process.env.WP_API_BASE_URL

// Tell Node/Bun to accept local SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const OUT_DIR = './public/wp-data'

async function exportData() {
  if (!WP_URL) {
    console.error('No NUXT_PUBLIC_WP_API_BASE_URL environment variable in .env')
    return
  }

  console.log(`Fetching data from ${WP_URL}/pages...`)

  try {
    const res = await fetch(`${WP_URL}/pages?per_page=100`)
    
    if (!res.ok) {
      throw new Error(`error = ${res.status} ${res.statusText}.`)
    }

    const pages = await res.json()

    if (!Array.isArray(pages)) {
      console.error('No arrays. Instead we got:')
      console.error(pages)
      return
    }

    await fs.mkdir(OUT_DIR, { recursive: true })
    await fs.writeFile(`${OUT_DIR}/pages.json`, JSON.stringify(pages, null, 2))
    
    console.log(`Saved ${pages.length} pages to ${OUT_DIR}/pages.json`)
  } catch (error) {
    console.error('No data:', error)
  }
}

exportData()