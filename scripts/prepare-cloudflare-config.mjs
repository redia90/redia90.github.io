import fs from "node:fs"

const [, , namespaceId] = process.argv

if (!namespaceId) {
  console.error("Usage: node scripts/prepare-cloudflare-config.mjs <kv-namespace-id>")
  process.exit(1)
}

if (!process.env.VAPID_PUBLIC_KEY) {
  console.error("VAPID_PUBLIC_KEY is required")
  process.exit(1)
}

const source = fs.readFileSync("wrangler.jsonc", "utf8")
const withoutComments = source.replace(/\/\/.*$/gm, "")
const withoutTrailingCommas = withoutComments.replace(/,\s*([}\]])/g, "$1")
const config = JSON.parse(withoutTrailingCommas)

config.kv_namespaces = [
  {
    binding: "PUSH_SUBSCRIPTIONS",
    id: namespaceId,
  },
]
config.vars = {
  ...(config.vars ?? {}),
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
}

fs.writeFileSync("wrangler.generated.jsonc", `${JSON.stringify(config, null, 2)}\n`)
