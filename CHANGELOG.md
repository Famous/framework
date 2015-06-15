# Changelog

#### *June 14, 2015*

* Fixed bug when setting empty string as content to an HTML element
* Fixed bug where multiple listeners to same event were registered

#### *June 12, 2015*

* **Removed support for Mustache templating**
* Removed support for Jade tree syntax
* Removed other unused compilers from build step

#### *June 11, 2015*

* Added promise-like `.cue` feature for timelines
* Fixed bug where dev syntax error totally crashed the build scripts
* Allowed for behaviors to target HTML elements in tree directly
* **Changed library namespace to `FamousFramework`**
  * Removed all occurrences of `BEST`

#### *June 10, 2015*

* Added ability to define custom Famous Engine node constructors
* Added built-in `$route` state for routing with behaviors
* Added support for `'[[identity|fooBar]]'` syntax in behaviors
* Gave support for `$if` handling multiple nodes per parent port

#### *June 9, 2015*

* Made asset templating syntax more consistent
* Fixed bug where whitespace was added as elements
* Added `true-size` etc. to `famous:core:node` for render sizing

#### *June 8*, 2015*

* Removed `$yield` from the inheritance of `famous:core:node`
* Added more type checking to State Manager
* Added `$index` to yielded elements for use in layouts
* Fixed State Manager bug in global `.then` queue

#### *June 7, 2015*

* Added initial integration with Famous Hub to build process
* Added basic dependency resolution and freezing

#### *June 6, 2015*

* Fixed bug in build process where `.config` call wasn't located correctly in AST
* Allowed for bare text to be included in the tree
* Changed `BEST.helpers.timeline` to `BEST.helpers.piecewise`

#### *June 5, 2015*

* Fixed bug where deployer instantiated components twice
* **Made all components inherit from `famous:core:node` by default**
* **Introduced mechanism for inheritance (`.config({ extends: [...]})`)**
* **Introduced `famous:core:node`, and...**
  * Deprecated `famous:core:view`
  * Deprecated `famous:core:dom-element`
  * Deprecated `famous:core:ui-element`
  * Deprecated `famous:core:wrapper`
  * Deprecated `famous:core:context`

#### *June 4, 2015*

* Added basic type checking to State Manager

#### *June 3, 2015*

* Added basic WebGL API support through `ui-element`
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
