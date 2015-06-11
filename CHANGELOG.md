# Changelog

#### *June 3, 2015*

* Removed need for explicit refs when attaching (`FamousFramework.attach('foobar', 'HEAD', ...)`)
* Removed need for explicit version/tag (`FamousFramework.scene(..., 'HEAD', ...)`)
* Refactored build process for Famous Hub support
* Refactored `ecosystem` into modules; removed API server
* Added `$dispatcher.trigger()` for targeting oneself
* Added npm shrinkwrap file for pinned versions
* Gave `<ui-element>` support for `add-class` and `remove-class`
* Improved linting rules for ES6

#### *June 1, 2015*

* Refactored/prettified the demo screen menu
* Improved the linting configuration
* Enabled bare text nodes within `<dom-element>`
* Fixed bug where assets in nested folders were incorrectly loaded

#### *May 29, 2015*

* Added `$dispatcher.broadcast()` for messaging descendants
* Added  `$repeatIndex` for running events on repeated components
* Auto-correct `'setter'` to `'[[setter]]'` syntax

#### *May 28, 2015*

- Ensured dotfiles and non-extname files in projects are allowed
- Increased save payload size limit to 128mb
- Added `@{CDN_HOST}` for easy pathing
- Enabled asset references to other projects: `@{foo:bar|assets/baz.jpg}`
- Added warnings for some misspellings

#### *May 27, 2015*

- Allowed HTML files to be included: `FamousFramework.scene(...).config({ includes: ['foo.html'] });`
- Added linting

#### *May 26, 2015*

- Enabled a two-step setup: `npm install && npm run develop`
- Merged separate repositories into a single repo
