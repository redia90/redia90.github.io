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
  return !slug.startsWith("tags/")
}

function contentSignature(content) {
  return JSON.stringify({
    title: content?.title || "",
    content: content?.content || "",
    tags: content?.tags || [],
    links: content?.links || [],
  })
}

const previousIndex = readIndex(previousPath)
const currentIndex = readIndex(currentPath)
const changedEntries = Object.entries(currentIndex)
  .filter(([slug, content]) => {
    if (!isNotifiableSlug(slug)) {
      return false
    }

    const previousContent = previousIndex[slug]
    return !previousContent || contentSignature(previousContent) !== contentSignature(content)
  })
  .map(([slug, content]) => ({
    slug,
    title: content.title || slug,
    type: previousIndex[slug] ? "updated" : "new",
  }))
  .sort((a, b) => a.title.localeCompare(b.title, "ko"))

if (changedEntries.length === 0) {
  fs.writeFileSync(outputPath, "{}\n")
  console.log("has_new=false")
  process.exit(0)
}

const [firstEntry] = changedEntries
const newCount = changedEntries.filter((entry) => entry.type === "new").length
const updatedCount = changedEntries.length - newCount
const title = (() => {
  if (newCount > 0 && updatedCount > 0) {
    return "유방암 위키에 새 글과 업데이트가 있습니다"
  }

  if (newCount > 0) {
    return newCount === 1
      ? "유방암 위키에 새 글이 올라왔습니다"
      : `유방암 위키에 새 글 ${newCount}개가 올라왔습니다`
  }

  return updatedCount === 1
    ? "유방암 위키 글이 업데이트되었습니다"
    : `유방암 위키 글 ${updatedCount}개가 업데이트되었습니다`
})()
const body =
  changedEntries.length === 1 ? firstEntry.title : `${firstEntry.title} 외 ${changedEntries.length - 1}개`

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
