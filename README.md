# workspace

Local development workspace for core BEST framework engineers

## Overview

This repo ties together the services to run framework locally:

* **assistant:** Local development helpers
* **components:** Framework scenes/modules developed by us
* **ecosystem:** Server-side; compilation, Hub integration
* **runtime:** The in-browser scene renderer

## Development

See the [installer scripts](https://github.famo.us/framework/install) for info.

Once installed, start up the local development server:

    $ npm run develop

After the server is up and running, synchronize the components:

    # From a new Terminal tab
    $ npm run sync-components

Then visit [localhost:1337](http://localhost:1337) in your browser.

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt.
