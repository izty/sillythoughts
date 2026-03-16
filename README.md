# Silly Thoughts Diary Calendar

A static diary website that opens like a calendar. Each day of the month is clickable and links to a themed diary entry page with images. Designed to be hosted on GitHub Pages using only plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` – main calendar page (home page).
- `style.css` – shared styles for the calendar and diary entry pages.
- `script.js` – calendar logic: renders days and handles navigation between months.
- `entry.html` – shared diary entry viewer that reads from `entries.json`.
- `entries.json` – JSON file that stores the content, theme, and images for each day.
- `images/` – images used in diary entries.

## How the calendar and entries work

- The calendar uses the browser's `Date` API to render the correct number of days in each month and align them to the correct weekday.
- The current month and year are shown at the top, with **Previous** and **Next** buttons to move between months.
- Each day in the currently visible month is clickable.
- When you click a day, the browser navigates to:

```text
entry.html?date=YYYY-MM-DD
```

Where `YYYY-MM-DD` is the ISO date (for example `2026-03-15`).

- `entry.html` then loads `entries.json`, finds the matching entry by date string, and renders:
  - the title
  - the formatted date
  - the theme and mood
  - paragraphs of text
  - any images listed for that day

If no entry exists for a date yet, `entry.html` shows a friendly “no entry yet” placeholder message.

## Adding or editing a diary entry (JSON)

All diary content lives in `entries.json`. Each key is a date string (`YYYY-MM-DD`) and its value is an object describing the entry.

Example entry:

```json
{
  "2026-03-15": {
    "title": "Silly March musings",
    "dateLabel": "15 March 2026",
    "theme": "rainy",
    "mood": "thoughtful",
    "paragraphs": [
      "Placeholder entry for the middle of March. Swap this paragraph for your real diary story whenever you are ready."
    ],
    "images": [
      {
        "src": "images/placeholder-rainy.jpg",
        "alt": "Rainy window placeholder image"
      }
    ]
  }
}
```

### Fields

- **`title`**: The title shown at the top of the diary page.
- **`dateLabel`** (optional): Pretty version of the date. If omitted, it will be formatted automatically from the `YYYY-MM-DD` key.
- **`theme`** (optional): One of your theme names (e.g. `sunrise`, `rainy`, `forest`). Used to pick background styling.
- **`mood`** (optional): Any short label you like (e.g. `soft`, `tired`, `excited`). Shown as a small pill in the header.
- **`paragraphs`**: An array of strings. Each string becomes one `<p>` on the page.
- **`images`**: An array of `{ "src": "...", "alt": "..." }` objects describing pictures for the day.

### Steps to change or add an entry

1. Open `entries.json` in a text editor.
2. To **edit** an existing day, find its `YYYY-MM-DD` key and change the values (title, paragraphs, images, etc.).
3. To **add** a new day:
   - Add a new property whose key is the date in `YYYY-MM-DD` format.
   - Fill in at least a `title` and some `paragraphs`.
4. Save the file, commit, and push.

When you then click that date in the calendar, `entry.html` will display your updated content.

## Deploying to GitHub Pages

1. Commit all files in this project and push to the `main` branch of your GitHub repository.
2. In your repo on GitHub:
   - Go to **Settings → Pages**.
   - Under **Source**, select **Deploy from a branch**.
   - Choose **Branch: `main`** and **Folder: `/ (root)`**.
   - Click **Save**.
3. Wait a minute or two for GitHub Pages to build your site.
4. GitHub will show you a URL like:

```text
https://your-username.github.io/your-repo-name/
```

Visiting that URL should open `index.html` with your calendar.

## Editing the look and themes

- Update shared colors, spacing, and typography in `style.css`.
- The calendar layout is mostly controlled by:
  - `.calendar-page`
  - `.calendar-controls`
  - `.calendar-grid`
  - `.calendar-cell.day`
- Diary layout is controlled by:
  - `.entry-layout`, `.entry-main`, `.entry-header`, `.entry-body`, `.entry-gallery`
- Theme backgrounds live in rules like:

```css
body.theme-sunrise { ... }
body.theme-rainy { ... }
body.theme-forest { ... }
```

You can add new theme classes here (for example `theme-ocean`, `theme-starry`, etc.) and then use them on any diary page by setting the `class` on the `<body>` element.

