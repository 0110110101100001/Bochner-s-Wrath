# Builder's Tab

A new tab page that is a small animated village. Here is how to get it running.

## You need

- **Google Chrome** — https://www.google.com/chrome/
- **Node.js 20 or newer** — https://nodejs.org (download the LTS installer, click through it, accept the defaults)

## Install

Open a terminal in this folder and run these two lines:

```bash
npm install
npm run build
```

Then, in Chrome:

1. Go to `chrome://extensions`
2. Turn on **Developer mode** — the toggle in the top right
3. Click **Load unpacked**
4. Pick the **`dist`** folder inside this project
5. Open a new tab

That is it.

## After you change something

```bash
npm run build
```

Then press the **reload** button (the circular arrow) on the Builder's Tab card in `chrome://extensions`, and open a new tab.

## If the new tab looks unchanged

Chrome lets only one extension own the new tab page. Some other new-tab extension is still enabled — turn it off in `chrome://extensions` first.
