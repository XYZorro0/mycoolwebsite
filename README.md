# RetroOS Portfolio

An interactive retro-OS portfolio: BIOS-style boot sequence → Vista-inspired
desktop with draggable windows, an embedded DOOM launcher, and a tiny voxel
sandbox. Built to sit on a Mac Mini at home and idle near zero CPU.

---

## ⚡ One-shot Mac Mini install

On the Mac Mini, after cloning the repo:

```bash
bash scripts/setup-mac-mini.sh
```

This installs Homebrew + Node 20 + PM2, builds the site, starts it under
PM2 with a 350 MB memory cap, configures auto-start on boot, and tweaks
energy settings so the Mac doesn't sleep. When it finishes you'll have:

- `http://localhost:3000` on the Mac itself
- `http://<mac-lan-ip>:3000` from any other device on your LAN

See [Deployment — Mac Mini hosting](#deployment--mac-mini-hosting) below for
manual setup, Docker, and reverse-proxy options.

---

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** — all desktop chrome is CSS-only (no image assets shipped)
- **Zustand** for the window-manager store
- **Framer Motion** for window enter/open transitions only
- **Three.js** + **simplex-noise** — only loaded inside Voxelcraft, dynamically imported
- **js-dos v8** — only loaded inside DOOM, dynamically imported from CDN
- **WebAudio** synthesizes UI sounds — no audio files shipped

## Personalize

Open [`src/lib/profile.ts`](src/lib/profile.ts) and fill in your name, role, links,
skills, and project list. Every app reads from there. Drop a real `resume.pdf`
into `public/` and the Resume window will embed it automatically.

For DOOM: drop the freely-redistributable shareware `doom1.wad` into
[`public/games/`](public/games/README.md). See that folder's README for mirrors.

## Folder structure

```
mycoolwebsite/
├─ Dockerfile                    # multi-stage container for Mac Mini hosting
├─ ecosystem.config.cjs          # PM2 process file (memory-bounded restarts)
├─ next.config.mjs               # security headers, image config, package opt
├─ scripts/
│  └─ setup-mac-mini.sh          # one-shot installer for Mac Mini hosting
├─ public/
│  ├─ resume.pdf                 # (drop your real PDF here)
│  └─ games/
│     └─ doom1.wad               # (drop the shareware DOOM WAD here)
└─ src/
   ├─ app/
   │  ├─ layout.tsx              # root layout, "skip to content" link
   │  ├─ page.tsx                # dynamic-imports the client Shell
   │  └─ globals.css             # Vista wallpaper + glass + CRT scanlines
   ├─ lib/
   │  ├─ apps.ts                 # registry — every app is its own dynamic chunk
   │  ├─ store.ts                # Zustand: windows, focus, z-index, selection
   │  ├─ sound.ts                # WebAudio UI sfx (lazy AudioContext)
   │  ├─ profile.ts              # *** edit this *** all portfolio content
   │  └─ useVisibility.ts        # toggles `is-hidden` to pause CSS animations
   └─ components/
      ├─ Shell.tsx               # top-level: boot vs desktop, mobile, terminal bridge
      ├─ BootSequence.tsx        # ~5s typing log → Vista welcome flash → desktop
      ├─ Desktop.tsx             # Vista wallpaper + icon grid + window host
      ├─ DesktopIcon.tsx         # vista-styled icon button + hover glow + selection
      ├─ icons/VistaIcons.tsx    # all SVG icons (computer, folder, doom, mc, ...)
      ├─ Taskbar.tsx             # start orb + start menu + open windows + clock
      ├─ Clock.tsx               # 30s timer, paused on hidden tabs
      ├─ Window.tsx              # draggable / 8-edge resizable / vista titlebar
      ├─ WindowHost.tsx          # renders open windows, lazy-loads each app
      ├─ MobileFallback.tsx      # simplified non-desktop UI
      └─ apps/
         ├─ Computer.tsx         # "My Computer" with fake drives
         ├─ Resume.tsx           # PDF embed if present, else inline view
         ├─ Projects.tsx         # cards w/ next/image lazy loading
         ├─ About.tsx            # bio + skills + links
         ├─ Games.tsx            # folder containing Doom + Voxelcraft
         ├─ Contact.tsx          # email + clipboard copy + social links
         ├─ Terminal.tsx         # interactive command prompt (open / ls / cowsay)
         ├─ RecycleBin.tsx       # gag bin contents
         ├─ Doom.tsx              # js-dos v8 (CDN script + WAD from /public/games)
         └─ Minecraft.tsx         # Three.js voxel engine (chunks, raycast, fog)
```

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Drop your real `resume.pdf` into `public/` to power the download button.

---

## Performance notes

The site is engineered for **24/7 uptime on a Mac Mini** with idle CPU close to
zero.

### Render & React

- **Client-only Shell** is loaded with `next/dynamic({ ssr: false })`, so the
  initial HTML is tiny.
- Each app (`Resume`, `Projects`, `Doom`, `Minecraft`, …) is **its own dynamic
  import**. Code only ships when the user opens the window.
- Heavy components (`Window`, `DesktopIcon`) are wrapped in `React.memo`.
- The Zustand store uses **fine-grained selectors** (`useDesktop(s => s.x)`)
  so unrelated state changes don't re-render every window.
- `contain: layout paint` and `transform: translate3d(...)` on each window let
  the browser composite without invalidating siblings.

### Animation & GPU

- **The desktop has no background canvas / WebGL / particle system.** The Vista
  aurora wallpaper is a stack of CSS gradients; the browser composites it once.
- WebGL is **only** used inside the Voxelcraft window, and only after the user
  clicks PLAY. Three.js, simplex-noise, and the engine code (~600 LOC) all
  ship in a separate chunk that's never loaded otherwise.
- The Voxelcraft render loop hooks `document.visibilitychange` and stops
  `requestAnimationFrame` on hidden tabs. On window close, **all GL resources
  (geometries, textures, materials, the renderer, the canvas element) are
  disposed** — no GPU leak.
- DOOM is js-dos v8. The script and CSS are downloaded on demand from a CDN.
  On window close, `dos.stop()` tears down the DOSBox worker.
- Window dragging and resizing are **rAF-batched**: pointer events accumulate
  in a ref and commit once per frame, never thrashing React.
- `prefers-reduced-motion` zeroes durations across the board.
- `document.visibilitychange` toggles `html.is-hidden`, which sets
  `animation-play-state: paused !important` on every `*::before/::after`.

### Idle CPU

- The clock uses a self-rescheduling `setTimeout` aligned to 30-second
  boundaries (no per-second `setInterval`), and stops on hidden tabs.
- Boot sequence allocates ~16 timeouts then disposes of them. After boot, **no
  timers run** unless the user is actively interacting.
- The WebAudio context is created lazily on the first user gesture and
  suspended when audio is disabled.
- All event listeners register from `useEffect` and unregister in their
  cleanup return — no leaks.

### Network & assets

- All desktop icons are **inline SVG** — zero network requests for chrome.
- All UI sounds are **synthesized** via WebAudio (no `.mp3`/`.wav` shipped).
- Voxelcraft block textures are **procedurally generated** in a canvas at
  runtime — no PNG atlases shipped.
- `next/image` powers project screenshots with `loading="lazy"` and AVIF/WebP.
- Static assets get `Cache-Control: public, max-age=31536000, immutable`.
- DOOM: js-dos runtime + WAD only fetched on click.
- Voxelcraft: Three.js + simplex-noise + the engine only loaded on click.

---

## Deployment — Mac Mini hosting

Two supported paths. Both bind to port `3000`; put a TLS-terminating reverse
proxy (Caddy or nginx) in front of it.

### Option A — PM2 (simplest)

```bash
# one-time
brew install node@20 pm2
npm ci && npm run build

# run
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup launchd      # auto-start on Mac boot — follow printed instructions
```

`ecosystem.config.cjs` sets:

- `max_memory_restart: "350M"` — PM2 hard-restarts the process if the heap
  exceeds 350 MB. Safety net for any long-tail leak.
- `node_args: ["--max-old-space-size=384"]` — caps the V8 heap so a runaway
  allocation can never starve the rest of the Mac Mini.
- `autorestart: true` — recover from crashes silently.

Useful operations:

```bash
pm2 status
pm2 logs retro-portfolio --lines 100
pm2 reload retro-portfolio   # zero-downtime reload
pm2 monit                    # live CPU/MEM
```

### Option B — Docker

```bash
docker build -t retro-portfolio .
docker run -d --name retro-portfolio --restart=always \
  -p 3000:3000 \
  --memory=384m --memory-swap=384m \
  --cpus=1 \
  retro-portfolio
```

The hard `--memory=384m` cap means the kernel will OOM-kill (and Docker
restart) the process if anything ever leaks. The image runs as a non-root user.

### Reverse proxy (Caddy, recommended on macOS)

```caddy
yoursite.example.com {
  encode zstd gzip
  reverse_proxy 127.0.0.1:3000
  header /sounds/* Cache-Control "public, max-age=31536000, immutable"
  header /images/* Cache-Control "public, max-age=31536000, immutable"
}
```

That gives you free HTTPS, HTTP/3, and proper static caching.

### Mac Mini-specific tips

- Disable App Nap for the Node process so PM2 doesn't get throttled when the
  display sleeps:
  `defaults write NSGlobalDomain NSAppSleepDisabled -bool YES`
- In **Energy Saver**, enable *Prevent automatic sleeping when display is off*
  and *Start up automatically after a power failure*.
- Keep the Mac on a UPS — even a $50 one — to avoid filesystem damage during
  brownouts.

---

## Keeping memory stable over months of uptime

Long-running Node processes can drift. The defenses here:

1. **Bounded V8 heap** (`--max-old-space-size=384`). Caps worst-case memory.
2. **PM2 memory-restart** at 350 MB. If anything leaks, it self-heals before
   it matters — you'll see a tick in `pm2 status` but no downtime.
3. **No long-lived timers.** Apart from the clock's 30-second timer (cleaned
   up on `visibilitychange`), nothing schedules work in the background.
4. **No persistent subscriptions to external services.** No WebSockets, no
   SSE, no polling.
5. **All listeners disposed.** Every `useEffect` returns a cleanup.
6. **No image preloading.** Project screenshots use `next/image` lazy loading.
7. **Doom and Voxel are dormant** until the user opens them, and their state
   is dropped on close.
8. **Optional weekly graceful reload** — if you're paranoid, add a launchd
   plist that runs `pm2 reload retro-portfolio` every Sunday at 03:00.
   Then `launchctl load ~/Library/LaunchAgents/com.you.retroreload.plist`.

For monitoring, point `pm2 monit` or a tiny Prometheus node-exporter at the
machine. Memory should hover well under 200 MB at idle.

---

## Accessibility

- **Keyboard navigation** — desktop icons and start menu items are real
  buttons. Enter / Space activate them.
- **Skip to content** link as the first focusable element.
- **Skip intro** — any keypress or click during the boot animation completes
  it immediately.
- **Reduced motion** — `prefers-reduced-motion: reduce` collapses the boot
  typing animation to a single frame and disables CSS transitions.
- **Focus rings** preserved (`focus-visible:ring-2`).
- **Sound is off by default** and toggleable from the Start menu.

## Mobile

`(max-width: 768px)` or `(pointer: coarse)` switches to `MobileFallback`,
which is a simple list view — no draggable windows on phones.

---

## Customizing

- **Resume**: edit `src/components/apps/Resume.tsx` and drop a real
  `public/resume.pdf`.
- **Projects**: edit the `PROJECTS` array in `src/components/apps/Projects.tsx`.
  Add screenshots to `public/images/` and reference them as
  `/images/foo.webp`.
- **Doom**: set `NEXT_PUBLIC_DOOM_URL` to a self-hosted js-dos bundle if you
  prefer not to depend on a third-party iframe.
- **Wallpaper**: tweak the gradient in `src/components/Desktop.tsx`.
