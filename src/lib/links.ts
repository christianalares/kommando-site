// Stable download link. The release pipeline uploads a fixed-name Kommando.zip to the
// GitHub "downloads" release on every release, so this URL never changes across versions.
export const DOWNLOAD_URL =
  'https://github.com/christianalares/kommando/releases/download/downloads/Kommando.zip'

// One-line Homebrew install via our cask tap (christianalares/homebrew-tap).
export const BREW_INSTALL_CMD = 'brew install --cask christianalares/tap/kommando'
