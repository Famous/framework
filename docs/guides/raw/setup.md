# Installation &amp; setup

## For contributors to Famous Framework core

This setup is for developers who want to both contribute to the core framework implementation _and_ develop modules/scenes. Soon we'll be providing simpler installation and setup options for those who only want to build modules/scenes.

    $ git clone git@github.com:Famous/framework.git && cd framework
    $ npm install
    $ npm run develop

The final step in these commands will start up the local development environment complete with watcher tasks that will reload/synchronize the system as you make changes. Once everything has started up, you should be able to visit [localhost:1337](http://localhost:1337) in your browser and see a demo widget running.
