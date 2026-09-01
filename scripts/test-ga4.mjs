import { BetaAnalyticsDataClient } from "@google-analytics/data"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const propertyId = process.env.GA4_PROPERTY_ID
const clientEmail = process.env.GA4_CLIENT_EMAIL
let privateKey = process.env.GA4_PRIVATE_KEY

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, "\n")
}

console.log("Property ID:", propertyId)
console.log("Client Email:", clientEmail)
console.log("Private Key exists:", !!privateKey)

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
})

async function run() {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    })
    console.log("SUCCESS! GA4 Data received:")
    console.log("Rows count:", response.rows?.length)
    console.log("Metric values:", response.rows?.[0]?.metricValues?.map(m => m.value))
  } catch (err) {
    console.error("ERROR querying GA4:", err.message)
  }
}

run()
