# Syed Rayhan Ali — Portfolio

A single-page personal portfolio built with plain HTML, CSS and vanilla
JavaScript. No frameworks, no build step, no dependencies.

## Run it

Open `index.html` directly in a browser, or serve the folder locally:

```bash
# any one of these, from the project root
python -m http.server 8000
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy it

The site is static, so GitHub Pages or Vercel both work as-is:

- **GitHub Pages:** push this folder to a repository, then
  Settings → Pages → deploy from branch (root).
- **Vercel:** import the repository at vercel.com — no configuration needed.

## Where to edit things

| What                      | Where                                                        |
| ------------------------- | ------------------------------------------------------------ |
| Name, intro, bio          | `index.html` (hero + `#about` section)                        |
| Interests list            | `index.html` → `.explore-list`                                |
| Projects                  | `js/main.js` → `PROJECTS` array (see below)                   |
| GitHub handle + link      | `index.html` → `#github` and `#contact` sections              |
| Email                     | `index.html` → `#contact` section (`mailto:` links)           |
| Colors                    | `css/style.css` → `:root` variables                           |
| Fonts                     | `css/style.css` → `--font-display` / `--font-body` + Google Fonts `<link>` in `index.html` |
| Spacing / widths          | `css/style.css` → `:root` variables                           |

## Adding a project

Open `js/main.js` and add an entry to the `PROJECTS` array at the top:

```js
{
  num: "04",                        // displayed as "PROJECT 04"
  title: "My Project",
  description: "One or two sentences.",
  tech: ["Python", "Pandas"],       // or [] to show "—"
  status: "COMPLETED",              // badge text
  github: "https://github.com/raycooon/my-project", // or null to disable the button
  demo: null                        // or a URL for "VIEW PROJECT"
}
```

The card is rendered automatically. If JavaScript is disabled, the three
static placeholder cards in `index.html` are shown instead — keep those in
sync if you don't use JS.

## Files

```
index.html            page content and structure
css/style.css         design system + all component styles
css/responsive.css    breakpoints + mobile navigation overlay
js/main.js            menu, active nav, reveals, boot, project renderer
js/ecg.js             ECG waveform animation
assets/icons/favicon.svg
```
