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
- **Tailwind CSS** for styling, all chrome is CSS (no asset weight)
- **Zustand** for the window-manager store
- **Framer Motion** is allowed but only used where genuinely useful (kept off
  the critical path)
- **WebAudio** synthesizes UI sounds — no audio files shipped

## Folder structure

```
mycoolwebsite/
├─ Dockerfile                    # multi-stage container for Mac Mini hosting
├─ ecosystem.config.cjs          # PM2 process file (memory-bounded restarts)
├─ next.config.mjs               # security headers, image config, package opt
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ public/
│  ├─ robots.txt
│  └─ resume.pdf                 # drop your real PDF here (optional)
└─ src/
   ├─ app/
   │  ├─ layout.tsx              # root layout, "skip to content" link
   │  ├─ page.tsx                # dynamic-imports the client Shell
   │  └─ globals.css             # CRT scanlines, glassmorphism, reduced-motion
   ├─ lib/
   │  ├─ apps.ts                 # registry — every app is its own dynamic chunk
   │  ├─ store.ts                # Zustand: windows, focus, z-index, viewport
   │  ├─ sound.ts                # WebAudio UI sfx (only on first user gesture)
   │  └─ useVisibility.ts        # toggles `is-hidden` to pause CSS animations
   └─ components/
      ├─ Shell.tsx               # top-level: boot vs desktop, mobile detection
      ├─ BootSequence.tsx        # ~4.5s typing log, skippable
      ├─ Desktop.tsx             # wallpaper + icon grid + window host
      ├─ DesktopIcon.tsx         # inline-SVG icons (zero network cost)
      ├─ Taskbar.tsx             # start menu, app indicators, sound toggle
      ├─ Clock.tsx               # 30s timer, paused on hidden tabs
      ├─ Window.tsx              # draggable window (rAF-batched pointer events)
      ├─ WindowHost.tsx          # renders open windows, lazy-loads each app
      ├─ MobileFallback.tsx      # simplified non-desktop UI
      └─ apps/
         ├─ Resume.tsx
         ├─ Projects.tsx         # next/image lazy loading
         ├─ About.tsx
         ├─ Contact.tsx
         ├─ Doom.tsx             # iframe only mounts after explicit launch
         └─ Minecraft.tsx        # DOM-based voxel grid (no canvas / WebGL)
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

- **No background canvas / WebGL / particle systems.** CRT scanlines are a
  static repeating gradient. The vignette is a single radial gradient.
- Window dragging is **rAF-batched**: pointer events accumulate into a ref and
  commit once per frame, never thrashing React.
- `prefers-reduced-motion` zeroes durations across the board.
- `document.visibilitychange` toggles `html.is-hidden`, which sets
  `animation-play-state: paused !important` on every `*::before/::after` —
  scanlines and the boot caret stop entirely on backgrounded tabs.

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

- All icons are **inline SVG** — zero network requests for desktop chrome.
- All UI sounds are **synthesized** (no `.mp3`/`.wav` shipped).
- `next/image` is used in Projects with `loading="lazy"` and AVIF/WebP.
- Static assets get `Cache-Control: public, max-age=31536000, immutable`.
- Doom assets are not preloaded — the iframe only mounts when the user
  clicks **LOAD DOOM**.
- The Minecraft sandbox is a tiny DOM grid; nothing animates by itself.

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
