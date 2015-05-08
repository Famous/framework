# workspace

Local development workspace for core BEST framework engineers

## Overview

This repo ties together the services to run framework locally:

    * **assistant:** Local development helpers
    * **components:** Framework scenes/modules developed by us
    * **ecosystem:** Server-side; compilation, Hub integration
    * **runtime:** The in-browser scene renderer

## Development

Clone the main repos to your code local workstation:

    $ git@github.famo.us:framework/assistant.git
    $ git@github.famo.us:framework/components.git
    $ git@github.famo.us:framework/ecosystem.git
    $ git@github.famo.us:framework/runtime.git
    $ git@github.famo.us:framework/workspace.git

After cloning all of these, `npm link` all of them.

(If you already had these cloned, make sure `git pull` and `npm i` within each.)

Then, from the `workspace` repo, do the following:

    $ npm i
    $ npm link best-assistant
    $ npm link best-components
    $ npm link best-ecosystem
    $ npm link best-runtime

Once finished, start up the local development server:

    $ npm run develop

Once the server is succesfully up and running, do this:

    # From a new Terminal tab
    $ npm run sync-components

Then visit [localhost:1337](http://localhost:1337) in your browser.

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt.
