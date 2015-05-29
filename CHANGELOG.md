# Changelog

#### *May 28, 2015*

- Ensured dotfiles and non-extname files in projects are allowed
- Increased save payload size limit to 128mb
- Added `@{CDN_HOST}` for easy pathing
- Enabled asset references to other projects: `@{foo:bar|assets/baz.jpg}`
- Added warnings for some misspellings

#### *May 27, 2015*

- Allowed HTML files to be included: `BEST.scene(...).config({ includes: ['foo.html'] });`
- Added linting

#### *May 26, 2015*

- Enabled a two-step setup: `npm install && npm run develop`
- Merged separate repositories into a single repo
