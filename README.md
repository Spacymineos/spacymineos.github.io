# spacymineos.github.io

Archive index for the [Spacymineos](https://github.com/Spacymineos) GitHub organization.
Live at [spacymineos.github.io](https://spacymineos.github.io).

## What it does

One `index.html`, no build step, no dependencies. On load it fetches the
organization's repositories from the GitHub API and lists them.

- Repositories are sorted by last update, or A to Z.
- Search filters by name, description or language. Press `/` to focus it and `Esc` to clear it.
- Language chips filter the list.
- Anything that is not archived is flagged "Still active"; forks are flagged too.
- The API response is cached in `sessionStorage` for ten minutes to stay under the rate limit.
- The `.github` and `spacymineos.github.io` repositories are left out.
- If the API is unavailable, the page says so and links to the organization.

## Structure

```
index.html          page markup
assets/css/style.css  styles
assets/js/app.js      fetches and renders the repository list
assets/img/           favicon, touch icon, link-preview image
```

## Brand kit

Logo, colours, type, voice, banners and design tokens live in their own repository,
`spacymineos-brand`, published at [spacymineos.github.io/brand](https://spacymineos.github.io/brand/).

## Deployment

GitHub Pages serves the `main` branch root, so every push to `main` updates the site.
To run it locally, open `index.html` in a browser.

## API rate limit

The page uses the unauthenticated GitHub API, which allows 60 requests per hour per IP.
Each visit makes one request.

## Links

- Organization: [github.com/Spacymineos](https://github.com/Spacymineos)
- Author: [@aminegames125](https://github.com/aminegames125)
