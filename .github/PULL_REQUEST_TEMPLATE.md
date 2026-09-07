## What and why

<!-- One or two sentences. Link the issue if there is one: "Closes #12". -->

## Checklist

- [ ] `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass locally.
- [ ] Core changes come with a test in `src/*.test.ts`, and `toSvg` and `<PixelGlyph>` still produce the same markup.
- [ ] No new runtime dependency.
- [ ] Site text changes cover both languages in `site/i18n.tsx`.
- [ ] Site graphics are bitmaps drawn with the library: no image files, no icon fonts, no hand-written `<svg>`.
- [ ] Visible changes include a screenshot (the docs site or the playground).
- [ ] `CHANGELOG.md` has an entry under "Unreleased" when the package behavior changes.
