# arshia-baid.github.io

Personal site of Arshia Baid. Plain HTML, CSS and JavaScript with no frameworks.

## Editing
- Page text lives in `_build/pages/*.html`. Edit there, never in the generated pages.
- The shared header, footer and page titles are in `_build/build.py`.
- Rebuild after any change: `python3 _build/build.py`
- Styles: `assets/css/style.css`. Small interactions such as the typing headline, number count-up, lightbox and dark mode: `assets/js/main.js`.

## Adding photos
Put files in `assets/img/<project>/`. Two images aren't there yet, and their spots show a grey placeholder until they are added:
- `assets/img/music/cover.jpg`: a piano photo (home tile and music page)

## Preview locally
`python3 -m http.server` then open http://localhost:8000

## Deploy (GitHub Pages)
Push this folder to a repo named `<username>.github.io`, then go to Settings → Pages → deploy from the `main` branch, root folder.
