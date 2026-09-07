# Contributing

Thanks for helping. This is a small library with a small surface, and the
goal of these rules is to keep it that way.

## Before you start

- For a bug, open an issue with a playground link that reproduces it, or go
  straight to a pull request if the fix is small.
- For a new feature or an API change, open an issue first so we can agree on
  the shape before you write code.
- Security problems go through the private channel described in
  [SECURITY.md](SECURITY.md), not through a public issue.

## Setup

You need Node 22 or newer.

```bash
git clone git@github.com:kreeptales/pixel-glyph.git
cd pixel-glyph
npm ci
```

Scripts:

```bash
npm test              # vitest, jsdom
npm run test:watch
npm run lint          # oxlint
npm run typecheck     # tsc over src/ and site/
npm run build         # dist/: ES modules and declarations
npm run site:dev      # docs site with the playground, served from src/
npm run site:build    # site/dist
```

Continuous integration runs lint, typecheck, tests, both builds and
`npm pack --dry-run` on every push and pull request. A pull request needs a
green run to be merged.

## Layout

```
src/            the library
  bitmap.ts     Bitmap, Palette, Run, bitmapSize, toRuns
  unit.ts       Unit, cssUnit, base styles, sizeStyle
  svg.ts        toSvg (core, no framework)
  react.tsx     <PixelGlyph> (the React entry)
  index.ts      public exports of the core
site/           the docs site and playground (Vite, imports the library from src/)
  i18n.tsx      every visible string, in English and Spanish
  bitmaps/      the site's own glyphs and the 5x7 font
docs/           README screenshots
scripts/        screenshot capture
```

## Rules for the library

- No runtime dependencies. React is an optional peer and is used only by the
  React entry.
- The core (`src/index.ts` and what it exports) must not touch the DOM or
  React, so it keeps working in Node, Vue, Svelte and server templates.
- `toSvg` and `<PixelGlyph>` produce the same markup. A change in one comes
  with the same change in the other, and a test that checks both.
- Kernel-style logic (`toRuns`, `bitmapSize`, `toSvg`) is written test first.
  Add the failing test in `src/*.test.ts`, then make it pass.
- Keep both entries small. The published tarball is about 8 kB; a change that
  doubles it needs a good reason in the pull request.
- `CHANGELOG.md` is generated from commit messages at release time, so
  describe a public API change in the commit subject.

## Rules for the docs site

- Every graphic is a bitmap drawn with the library: the logo, the icons, the
  page titles, the mascot. No image files, no icon fonts, no hand-written
  `<svg>`. The favicon is `toSvg` output as a data URL.
- Only the thirteen palette tokens in `site/styles.css`. No gradients, no
  blur, no `border-radius`. Sizes are multiples of `--px`.
- Every visible string lives in `site/i18n.tsx` with both languages. The
  `satisfies` clause fails the typecheck if one is missing. Code samples stay
  in English.
- A new bitmap for the site is worth rendering at a large pixel size in the
  playground and looking at before you commit it.
- Check the result in a narrow viewport too. The page must not scroll
  horizontally on a phone.

## Commits and pull requests

- Conventional commits, without a scope: `feat:`, `fix:`, `docs:`, `chore:`,
  `refactor:`, `test:`, `ci:`. One concern per commit.
- Keep pull requests small and describe what changed and why. A screenshot
  helps for anything visible.
- The pull request template has a checklist; it is the same list the reviewer
  uses.

## Releasing (maintainers)

Releases are automated from the commit messages, so the prefixes matter:
`fix:` bumps the patch version, `feat:` bumps the minor (while the package is
below 1.0, `feat:` bumps the patch too), and a `!` after the type or a
`BREAKING CHANGE:` footer bumps the major. `docs:`, `chore:`, `ci:`, `test:`
and `refactor:` do not create a release on their own.

1. Every push to `main` updates a pull request titled `chore: release x.y.z`
   with the new version in `package.json` and the generated `CHANGELOG.md`
   entry. Nothing is published while it stays open.
2. Merging that pull request creates the tag `vx.y.z` and the GitHub release.
3. The release triggers `publish.yml`, which runs lint, tests and the build
   and publishes to npm with provenance through npm trusted publishing. No
   token or one-time password is involved.

To hold a release, leave the pull request open. To skip a commit from the
notes, use a prefix that is hidden in `release-please-config.json`.
