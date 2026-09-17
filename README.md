# For Riddhi 🐼

An interactive birthday journey — ten short chapters, three tiny games, one very
important panda. Built to take about 11 minutes and to never feel like a long
webpage.

**You are Chaitanya.** This README is for you, not for her.

---

## 1. Run it

```bash
npm install     # only needed once
npm run dev     # then open the printed localhost link
```

Other commands:

```bash
npm run build      # production build → dist/
npm run preview    # serve the built version locally
npm run typecheck  # TypeScript check, no output files
npm run smoke      # renders the app + all ten chapters; catches crashes fast
```

**On your phone while building:** run `npm run dev`, then open
`http://<your-computer-ip>:5173` on the phone (same Wi-Fi). The dev server is
already configured with `host: true` for exactly this.

---

## 2. Before you send it — the audit panel

Open the site with `?audit=1` on the end of the URL:

```
http://localhost:5173/?audit=1
```

A small **AUDIT** button appears at the top. It lists:

- every `[WRITE …]` placeholder still left, and which file it lives in
- every image or music file that is still missing
- buttons to jump to any chapter instantly
- a **reset progress** button (very useful — the site remembers where she got to,
  so while testing you will want to wipe that constantly)

---

## 3. What you still need to add

Everything below is optional — the site is fully playable right now, and missing
pieces show up as pretty `[ADD PHOTO]` / `[WRITE …]` cards, never as breakage.

| What | Where |
| --- | --- |
| 5 confessions | `src/data/confessions.ts` → replace `[WRITE CONFESSION]` |
| The thing she taught you | `src/data/taught.ts` → `[WRITE REALIZATION]`, `checkIn.note`, `closing` |
| Photo captions | `src/data/memories.ts` → `[ADD MEMORY]` |
| The final letter | `src/data/letters.ts` → `[WRITE LETTER]`, `[WRITE SIGN OFF]`, `[WRITE PS]` |
| Cake lines | `src/data/cake.ts` → `[WRITE LINE]` |
| The last line she reads | `src/data/finalSurprise.ts` → `[WRITE FINAL LINE]` |
| The Jungle Trail "sorry" line | `src/data/jungleTrail.ts` → `sorryLine` (already filled with your words) |
| Photos | `public/assets/memories/memory-01.jpg` … `memory-08.jpg` |
| Music | `public/assets/music/01-theme.mp3`, `02-quiet.mp3`, `03-finale.mp3` |
| Link preview image | `public/assets/images/og-preview.jpg` |

Full asset instructions: `public/assets/README.md`.

### Changing the quiz

`src/data/quiz.ts` — five questions, all built from facts you gave me. Edit the
`answer` index and the `wrong` reactions freely; the page is fully data-driven.

---

## 4. Sending it to her

`npm run build` produces a `dist/` folder. `vite.config.ts` uses `base: './'`, so
the same `dist/` works:

- dropped onto **Netlify** (drag the folder onto app.netlify.com/drop)
- pushed to **GitHub Pages** (no config changes needed)
- opened from a **local folder**
- hosted in a **subfolder** of an existing site

Nothing needs a backend, a database or an API key. There is no external
tracking, no fonts fetched from Google, and no music streamed from anywhere —
everything is bundled or local.

---

## 5. How it is put together

```text
src/
  App.tsx                  chapter state machine + shell (nav, music, eggs)
  context/ExperienceContext.tsx   progress, bookmarks, eggs, scores, audio
  components/              reusable UI: panda, envelopes, polaroids, intro…
  pages/Ch1…Ch10           one file per chapter
  games/                   the three games + engine/ + rescue/ logic
  animations/variants.ts   every shared motion recipe
  data/                    ALL text. No personal writing lives in components.
public/assets/             your photos + music
```

Two rules make this maintainable:

1. **No personal content inside components.** All of it is in `src/data/*.ts`.
2. **Nothing is invented.** Facts came from your brief; feelings are placeholders
   until you write them.

### Adding a chapter

1. Add an entry to `CHAPTERS` in `src/data/chapters.ts`.
2. Create `src/pages/ChX….tsx`.
3. Register it in the `PAGES` map at the top of `src/App.tsx`.

---

## 6. Craft notes

- **Audio** only ever starts from a real tap (the "Open it" button), because
  browsers block autoplay. If a music file is missing, the player detects it and
  shows a hint instead of a dead button.
- **Sound effects** are synthesised live in the browser (`src/hooks/useSfx.ts`),
  so the site has punch even with zero audio files.
- **Games** are canvas-based, drawn in a fixed 400-unit space and scaled to the
  device, so the tuning feels the same on a phone and a laptop. They auto-pause
  when the tab is hidden.
- **Reduced motion** is respected everywhere: petals, confetti, sparkles and the
  screen shake all switch off.
- **Progress is saved** in `localStorage` under `rid-bday-v1`. If she closes it
  halfway, the intro offers "continue from Chapter N".

---

## 7. Hidden things (spoilers — don't show her this file)

1. Tap the panda **5 times** → it puts on sunglasses and says *Bas karo.*
2. Tap it **9 times** → panda rain.
3. The glowing lamp at the Radisson table (Ch 1) → *SUNOOOOOOO!*
4. The glowing coffee badge in the Starter Pack (Ch 2) → same.
5. The glowing **?** in the Game Center (Ch 3) → same.
6. Press **Tease Simran** three times (Ch 3) → *You have been warned.* then *PIT JAOGE.*
7. **"Definitely don't click this."** (Ch 2) → escalating consequences.
8. Type **`bhalu`** anywhere.
9. Tap **"22 years of Riddhi."** after blowing out the candles.

The end screen counts how many she found (out of 6).

---

Made for Riddhi, 22. 🐼
