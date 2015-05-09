# ecosystem

Ecosystem service for BEST components

## About

Ecosystem is the connector between the frontend BEST framework and Famous Hub. Its two main responsibilities are:

- Preprocessing modules
- Code and asset storage (a proxy for Hub's `code-manager`)

## Overview

Any collection of files that revolve around a `BEST.scene` (or `BEST.module`) is a Version. A valid Version is made up of the following:

- A name (e.g. `'alice:alpha:app'`)
- A tag (e.g. `'0.1.1'`)
- An array of files (e.g. `[{path:"app.js",content:"..."},...]`)

When a Version is saved, Ecosystem first persists an unmodified version of the files in their current state. It then processes the Version into a Bundle:

- Expands any "shorthand" syntax into longform
- Infers dependencies
- Builds a browser-executable `bundle.js` file

When the client-side framework makes a request for a Version, Ecosystem returns a URL to the `bundle.js` file. The client loads that script to render the scene.

## Development

To get started:

    $ git clone git@github.famo.us:framework/ecosystem.git
    $ cd ecosystem
    $ npm i
    $ npm run serve

## License

This project is licenced under the MIT license. See [LICENSE.txt](LICENSE.txt).

## Copyright

Copyright (c) 2015 Famous Industries, Inc.
