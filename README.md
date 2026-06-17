<div align="center">
  <img src="public/kommando-icon.webp" alt="Kommando" width="120" height="120" />
  <h1>Kommando</h1>
  <p><strong>A fast, native macOS terminal — split panes, tabs, and an AI sidebar, built in SwiftUI.</strong></p>
  <p>
    <a href="https://kommando.app"><strong>🌐 kommando.app</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/christianalares/kommando">Source code</a>
  </p>
</div>

<br />

<div align="center">
  <a href="https://kommando.app">
    <img src="public/img/screenshot-1.webp" alt="Kommando terminal with the AI assistant explaining a project's file structure" width="860" />
  </a>
</div>

---

This repository contains the source for [**kommando.app**](https://kommando.app), the marketing site for
**Kommando**. Kommando is an open-source, native macOS terminal — the app itself lives at
[`christianalares/kommando`](https://github.com/christianalares/kommando).

## Features

- **Split panes** — tile terminals horizontally and vertically; new panes inherit the current directory.
- **Tabs** — a scrollable tab bar with titles that track the focused pane's folder.
- **AI sidebar (BYOK)** — a streaming assistant that reads the focused pane's output and inserts or runs commands. Bring your own Anthropic or OpenAI key, stored in the macOS Keychain.
- **Custom commands & shortcuts** — map your own hotkeys to shell commands and rebind anything.
- **JavaScript REPL** — an optional JS scratchpad with inline JSON inspection of terminal output.
- **Native & private** — built in SwiftUI with session restore, theming, and a translucent window.

<div align="center">
  <img src="public/img/screenshot-3.webp" alt="Kommando showing three terminals tiled into split panes" width="860" />
</div>

## Built with

The site is built with [TanStack Start](https://tanstack.com/start), [React 19](https://react.dev),
[Tailwind CSS v4](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com), and deployed on
[Cloudflare Workers](https://developers.cloudflare.com/workers/).

## License

© Kommando. All rights reserved.
