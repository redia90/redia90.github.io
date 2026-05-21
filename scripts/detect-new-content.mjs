import fs from "node:fs"

const [, , previousPath, currentPath, outputPath] = process.argv

if (!previousPath || !currentPath || !outputPath) {
  console.error(
    "Usage: node scripts/detect-new-content.mjs <previous-content-index> <current-content-index> <payload-output>",
  )
  process.exit(1)
}

function readIndex(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"))
  } catch {
    return {}
  }
}

function isNotifiableSlug(slug) {
  return slug !== "index" && !slug.startsWith("tags/")
}

const previousIndex = readIndex(previousPath)
const currentIndex = readIndex(currentPath)
const newEntries = Object.entries(currentIndex)
  .filter(([slug]) => isNotifiableSlug(slug) && !previousIndex[slug])
  .map(([slug, content]) => ({
    slug,
    title: content.title || slug,
  }))
  .sort((a, b) => a.title.localeCompare(b.title, "ko"))

if (newEntries.length === 0) {
  fs.writeFileSync(outputPath, "{}\n")
  console.log("has_new=false")
  process.exit(0)
}

const [firstEntry] = newEntries
const title =
  newEntries.length === 1
    ? "유방암 위키에 새 글이 올라왔습니다"
    : `유방암 위키에 새 글 ${newEntries.length}개가 올라왔습니다`
const body =
  newEntries.length === 1 ? firstEntry.title : `${firstEntry.title} 외 ${newEntries.length - 1}개`

fs.writeFileSync(
  outputPath,
  `${JSON.stringify({
    title,
    body,
    url: `/${firstEntry.slug}`,
    tag: `breast-cancer-wiki-${Date.now()}`,
  })}\n`,
)
console.log("has_new=true")
