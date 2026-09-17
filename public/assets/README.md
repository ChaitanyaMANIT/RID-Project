# Assets — drop your files here

Everything in this folder is *yours*. The website never breaks if a file is
missing — it just shows a pretty `[ADD PHOTO]` card instead. So add files
whenever you're ready, in any order.

Use these **exact filenames**, or open `src/data/assets.ts` and change one line.

---

## 1. Music → `public/assets/music/`

| Filename | Where it plays |
| --- | --- |
| `01-theme.mp3` | Intro reveal + Chapters 1–6, 8 |
| `02-quiet.mp3` | Chapter 7 (What You Taught Me) + Chapter 9 (the letter) |
| `03-finale.mp3` | Chapter 10 (the final surprise) |

- `.mp3` is safest. `.m4a` / `.ogg` also work — just update `src/data/music.ts`.
- Use music you have the rights to. **No external URLs are used anywhere.**
- The music player detects missing files automatically and shows a hint instead
  of a broken play button.
- Skip music entirely if you like: the site still has sound effects, because the
  little pops / sparkles / *thud* sounds are synthesised live in the browser.

---

## 2. Memory scrapbook → `public/assets/memories/`

`memory-01.jpg` … `memory-08.jpg`

Then open `src/data/memories.ts` and write the caption for each one where it
currently says `[ADD MEMORY]`. Landscape photos look best, but any shape works.

---

## 3. Jungle Trail (optional) → `public/assets/jungle/`

`jungle-01.jpg`, `jungle-02.jpg`

By default Chapter 4 plays an animated rebuild of the fall. If you'd rather show
real photographs, open `src/data/jungleTrail.ts` and change:

```ts
media: 'animation',   //  →  'photos'
```

---

## 4. Link preview → `public/assets/images/`

`og-preview.jpg` — the picture that appears when you WhatsApp her the link.
About 1200×630. If you leave it out, the link still works fine.

---

## 5. Panda & decorations

The panda, petals, sparkles and confetti are all drawn in code (SVG + canvas),
so there are no image files to add. That also means nothing is copyrighted
clip-art.