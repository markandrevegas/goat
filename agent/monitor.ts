// agent/monitor.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

// Load env variables
dotenv.config({ path: '.env.local' })
// dotenv.config({ path: '.env' })

const propertyId = process.env.GA4_PROPERTY_ID

if (!propertyId) {
  console.error('Missing GA4_PROPERTY_ID in environment variables.')
  process.exit(1)
}

const analyticsDataClient = new BetaAnalyticsDataClient()

async function generateReport() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'engagementRate' }
      ],
      dateRanges: [
        { startDate: '7daysAgo', endDate: 'yesterday' }
      ]
    })

    const logsDir = path.join(process.cwd(), 'agent', 'logs')
    await fs.mkdir(logsDir, { recursive: true })

    const dateStr = new Date().toISOString().split('T')[0]
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = path.join(logsDir, `report_${timestamp}.md`)

    let markdown = `# GA4 Automated Health Report - ${dateStr}\n\n`
    markdown += `## Channel Breakdown (Last 7 Days)\n\n`
    markdown += `| Channel | Active Users | Sessions | Engagement Rate |\n`
    markdown += `| :--- | :--- | :--- | :--- |\n`

    for (const row of response.rows || []) {
      const channel = row.dimensionValues?.[0]?.value || 'Unknown'
      const users = row.metricValues?.[0]?.value || '0'
      const sessions = row.metricValues?.[1]?.value || '0'
      const engRate = `${(parseFloat(row.metricValues?.[2]?.value || '0') * 100).toFixed(1)}%`

      markdown += `| ${channel} | ${users} | ${sessions} | ${engRate} |\n`
    }

    await fs.writeFile(filePath, markdown)
    console.log(`Report successfully saved to ${filePath}`)
  } catch (error) {
    console.error('Failed to run GA4 report:', error)
  }
}

generateReport()