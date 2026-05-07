#!/usr/bin/env bash
# Mac Mini one-shot setup for retro-portfolio.
# Run this ON the Mac Mini, from the cloned repo directory:
#   curl -fsSL https://raw.githubusercontent.com/XYZorro0/mycoolwebsite/main/scripts/setup-mac-mini.sh | bash
# or, after `git clone`:
#   bash scripts/setup-mac-mini.sh
#
# What this does:
#   1. Installs Homebrew (if missing), Node 20, and PM2
#   2. Installs deps and builds the site
#   3. Starts the site under PM2 with a 350MB memory cap
#   4. Configures PM2 to auto-start on Mac boot
#   5. Tweaks energy settings so the Mac doesn't sleep
#
# After this finishes:
#   - Site: http://localhost:3000  (or http://<mac-lan-ip>:3000 from your network)
#   - Status: pm2 status
#   - Logs: pm2 logs retro-portfolio

set -euo pipefail

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
info() { printf "\033[36m▸\033[0m %s\n" "$*"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$*"; }
warn() { printf "\033[33m!\033[0m %s\n" "$*"; }

# --- 0. sanity checks ---------------------------------------------------------
if [[ "$(uname -s)" != "Darwin" ]]; then
  warn "This script is intended for macOS. Detected: $(uname -s). Aborting."
  exit 1
fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"
bold "📂 Working in: $REPO_DIR"

# --- 1. Homebrew --------------------------------------------------------------
if ! command -v brew >/dev/null 2>&1; then
  info "Homebrew not found. Installing…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Make brew available in this shell session (Apple Silicon vs Intel paths)
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  ok "Homebrew already installed."
fi

# --- 2. Node 20 ---------------------------------------------------------------
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
  info "Installing Node 20…"
  brew install node@20
  brew link --overwrite --force node@20 || true
else
  ok "Node $(node -v) already installed."
fi

# --- 3. PM2 -------------------------------------------------------------------
if ! command -v pm2 >/dev/null 2>&1; then
  info "Installing PM2…"
  npm install -g pm2
else
  ok "PM2 $(pm2 -v) already installed."
fi

# --- 4. Build the site --------------------------------------------------------
info "Installing project dependencies…"
npm ci || npm install

info "Building production bundle…"
npm run build

# --- 5. Start under PM2 -------------------------------------------------------
mkdir -p logs
if pm2 describe retro-portfolio >/dev/null 2>&1; then
  info "Reloading existing PM2 process…"
  pm2 reload ecosystem.config.cjs --update-env
else
  info "Starting PM2 process…"
  pm2 start ecosystem.config.cjs
fi
pm2 save

# --- 6. Auto-start on Mac boot ------------------------------------------------
info "Configuring auto-start on boot (you may be prompted for sudo)…"
# pm2 prints a sudo command the first time; run startup, then `pm2 save` again.
STARTUP_CMD="$(pm2 startup launchd -u "$USER" --hp "$HOME" | tail -1 || true)"
if [[ "$STARTUP_CMD" == sudo* ]]; then
  echo "  → $STARTUP_CMD"
  eval "$STARTUP_CMD" || warn "Could not configure launchd automatically — run the command above manually."
fi
pm2 save

# --- 7. Energy / sleep tweaks -------------------------------------------------
info "Adjusting power settings so the Mac stays awake when serving traffic…"
# Stay awake when display is off, restart after power loss
sudo pmset -a sleep 0 2>/dev/null || warn "Skipped 'pmset sleep 0' (needs sudo)."
sudo pmset -a disksleep 0 2>/dev/null || true
sudo pmset -a autorestart 1 2>/dev/null || true
# Disable App Nap globally (so Node doesn't get throttled when display sleeps)
defaults write NSGlobalDomain NSAppSleepDisabled -bool YES || true

# --- 8. Done ------------------------------------------------------------------
LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "<your-mac-ip>")"

bold ""
bold "🎉 All done."
bold ""
echo "  Local:    http://localhost:3000"
echo "  LAN:      http://$LAN_IP:3000"
echo ""
echo "  Status:   pm2 status"
echo "  Logs:     pm2 logs retro-portfolio --lines 50"
echo "  Restart:  pm2 reload retro-portfolio"
echo "  Stop:     pm2 stop retro-portfolio"
echo ""
echo "  PM2 will hard-restart the process if memory exceeds 350MB,"
echo "  so the site stays stable over months of uptime."
