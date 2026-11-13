# Layouts

| Layout | Purpose |
|--------|---------|
| `MainLayout` | Shell for every page: `<html lang="es">`, head, nav, footer, font and global CSS. `nav={false}` drops the nav (used by `/enlaces`) |
| `MainHead` | The `<head>`: analytics through Partytown, SEO tags, and the Lite YouTube helper |
| `BlogPostLayout` | Post page: header, content and sidebar with categories and related posts. Posts select it in their `layout` frontmatter |

`BlogPostLayout` is one of the six post consumers. See [Post discovery](../../docs/ARCHITECTURE.md#post-discovery).

A change here affects every page, so run the full suite. See [TESTING_GUIDE.md](../../docs/TESTING_GUIDE.md).
