# Installation &amp; setup

## For contributors to BEST core

This setup is for developers who want to both contribute to the core framework implementation _and_ develop modules/scenes. Soon we'll be providing simpler installation and setup options for those who only want to build modules/scenes.

    $ cd my/amazing/projects/directory
    $ git clone git@github.famo.us:framework/scripts.git
    $ ./scripts/install/developer-osx.sh
    $ cd best-framework/workspace
    $ npm run seed
    $ npm run develop

The final step in these commands will start up the local development environment. Once everything has started up, you should be able to visit [localhost:1337](http://localhost:1337) in your browser and see a demonstration widget running.

## For app/widget/module developers

For now, please use the [installation instructions for core developers](#for-contributors-to-best-core).
