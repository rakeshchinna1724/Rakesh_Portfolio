# Rakesh Akunuri — Cybersecurity Portfolio

A professional multi-page portfolio website with cybersecurity aesthetics,
3D animations, and terminal effects.

## File Structure

```
portfolio/
├── index.html              ← Home / Hero page
├── css/
│   ├── global.css          ← Global styles, variables, animations, nav, footer
│   ├── home.css            ← Home page (hero, globe, terminal, quick-links)
│   ├── about.css           ← About + inner page shared styles, timeline
│   ├── skills.css          ← Skills page styles
│   ├── projects.css        ← Projects page styles
│   ├── certs.css           ← Certifications page styles
│   └── contact.css         ← Contact page styles
├── js/
│   └── main.js             ← All JS: nav, scroll reveal, 3D globe canvas,
│                              matrix rain, particles, typewriter, terminal,
│                              counters, skill bars
└── pages/
    ├── about.html          ← About: bio, personal info, education timeline
    ├── skills.html         ← Technical skills: security, languages, tools
    ├── projects.html       ← All 4 projects with details
    ├── certifications.html ← Certs, hackathon, training
    └── contact.html        ← Contact form + info

## Features

- Matrix rain canvas background (home)
- 3D rotating globe / wireframe sphere (home)
- Floating particle network (inner pages)
- Typewriter role animation (home)
- Terminal typing effect (home)
- Scroll-triggered reveal animations
- Animated skill bars
- Animated counters
- Cyberpunk color theme (cyan, green, dark)
- Scanline overlay effect
- Responsive / mobile-friendly
- Clip-path buttons
- Neon glow effects

## How to Use

Open `index.html` in any browser — no build step needed.
All assets are pure HTML/CSS/JS.

## Customization

- Update personal data in each HTML file
- Colors are CSS variables in `css/global.css` → `:root`
- Add real profile photo: replace `.avatar-hex` content in `about.html`
```
