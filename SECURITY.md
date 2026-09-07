# Security policy

The library builds SVG markup from strings you control: the bitmap and the
palette. `toSvg` escapes the label and the palette values it writes into
attributes, and the React entry sets colors through `style`, never through
raw HTML. If you find a way to get unescaped content into the output, or any
other security problem, please report it privately.

## Reporting

Use GitHub's private vulnerability reporting:
https://github.com/kreeptales/pixel-glyph/security/advisories/new

Include the package version, a minimal bitmap and palette that trigger the
problem, and what an attacker could do with it. You will get a first reply
within a week.

## Supported versions

Only the latest published version receives fixes.
