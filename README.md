# 🌷 A Little Garden for Kim Thoa

A romantic, interactive surprise website: a dreamy purple night sky, twinkling stars,
CSS-only 3D-looking pink tulips that grow and bloom one by one, floating hearts,
and a love letter.

Pure **HTML + CSS + vanilla JavaScript**. No frameworks, no build tools, no images, no paid APIs.

## Files

| File         | Purpose                                                   |
| ------------ | --------------------------------------------------------- |
| `index.html` | Page structure                                            |
| `style.css`  | All visuals: sky, tulips (made with CSS), letter, buttons |
| `script.js`  | Stars, particles, hearts, bloom sequence, letter, replay  |

## Preview on your computer

Double-click `index.html` to open it in your browser. (Fonts need internet; there are fallbacks if offline.)

## Publish with GitHub Pages (step by step)

1. **Create a GitHub account** at <https://github.com/signup> (skip if you have one).
2. Click **+** (top right) → **New repository**.
3. Repository name: `kim-thoa-garden` (any name works). Set it to **Public**.
   Do **not** tick "Add a README" (this project already has one). Click **Create repository**.
4. Upload the files, using either option:
   - **Easiest (browser):** on the new repo page click **uploading an existing file**,
     drag in `index.html`, `style.css`, `script.js`, `README.md`, then click **Commit changes**.
   - **Git (terminal)**, run inside this folder (replace `YOUR-USERNAME`):
     ```bash
     git add .
     git commit -m "Garden for Kim Thoa"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/kim-thoa-garden.git
     git push -u origin main
     ```
5. In the repo go to **Settings** → **Pages** (left sidebar).
6. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
   Under **Branch** choose `main` and folder `/ (root)`, then click **Save**.
7. Wait 1–2 minutes and refresh the Pages screen. A banner appears:
   **"Your site is live at `https://YOUR-USERNAME.github.io/kim-thoa-garden/`"**.
8. Open the link on your phone to test it. 💗

## Send it to her

- Copy the link and send it by Messenger / Zalo / iMessage with a short note,
  e.g. *"Anh có món quà nhỏ cho em, mở bằng điện thoại nha 🌷"*.
- Tip: it looks best on a phone, in portrait mode, with the sound off and brightness up.
- Optional: pick a custom link name by naming the repo something sweet, like `danh-rieng-cho-em`.

## Customize

- **Message:** edit `MESSAGE` at the top of `script.js`.
- **Intro text and button:** edit `index.html`.
- **Colors:** edit the `--c1`, `--c2`, `--c3` variables and `.v2/.v3/.v4` in `style.css`.
- **Number of tulips:** change `count` in `createTulips()` in `script.js`.

Made with love, just for you ❤️
