
# spacymineos.github.io 🌌

> The official archive index page for the [Spacymineos](https://github.com/Spacymineos) GitHub organization.  
> Live at: **[spacymineos.github.io](https://spacymineos.github.io)**

---

## 📖 About

This is a single-page auto-indexer that lists all deprecated and archived repositories
under the Spacymineos org. It fetches repos directly from the GitHub API — no build
tools, no frameworks, no dependencies. Just one `index.html`.

---

## ✨ Features

- 🔄 **Auto-fetches** all org repos on every page load via GitHub API
- 📦 **Archived repos** sorted to the top automatically
- 🔍 **Live search** — filter by name, description, or language
- 📊 **Stats bar** — total repos, stars, and forks
- 🏷️ **Tags** — marks each repo as `archived`, `fork`, or shows its language
- 🚫 **Auto-hides** meta repos (`.github`, `spacymineos.github.io`)
- ⚠️ **Error handling** if GitHub API is unavailable

---

## 🗂️ Structure

spacymineos.github.io/
└── index.html ← entire site, single file
text

---

## 🚀 Deployment

This site is deployed via **GitHub Pages** from the `main` branch root.  
Any push to `main` automatically updates the live site.

To run locally just open `index.html` in your browser — no server needed.

---

## ⚠️ Note on GitHub API Rate Limits

The page uses the unauthenticated GitHub API which allows **60 requests/hour** per IP.
Since the page only makes one request per visit this is more than enough for a public
archive index.

---

## 🔗 Related

| Resource | Link |
|----------|------|
| 🏠 Org Profile | [github.com/Spacymineos](https://github.com/Spacymineos) |
| 👤 Author | [@aminegames125](https://github.com/aminegames125) |
| 🌐 Live Site | [spacymineos.github.io](https://spacymineos.github.io) |

---

<p align="center">
  <i>Part of the Spacymineos deprecated archive · Drifting in the void since 2026 🚀</i>
</p>
