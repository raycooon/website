# Syed Rayhan Ali — portfolio

Minimal single-page portfolio. Plain HTML + CSS + a small vanilla JS file.
No frameworks, no build step, no dependencies (fonts come from Google Fonts).

## Run

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy

- **GitHub Pages:** push to a repo → Settings → Pages → deploy from branch (root).
- **Vercel:** import the repo — no configuration needed.

## Edit

| What | Where |
| --- | --- |
| Name, intro, about text | `index.html` |
| Projects | `PROJECTS` array at the top of `script.js` |
| GitHub / email | `index.html` (`#github`, `#contact`) |
| Colors, spacing, widths | `:root` variables in `style.css` |
| Fonts | Google Fonts `<link>` in `index.html` + `--font-display` / `--font-body` in `style.css` |

### Adding a project

```js
{
  number: "04",
  title: "My Project",
  description: "One or two sentences.",
  technologies: ["Python"],
  status: "completed",
  github: "https://github.com/raycooon/my-project",
  demo: null
}
```

`github` / `demo` as `null` renders a non-linked row.

## Files

```
index.html    content + structure
style.css     all styling (variables at the top)
script.js     menu, active nav, reveals, ECG, project list
```
