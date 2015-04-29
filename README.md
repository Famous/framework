# BEST

Implementation of the BEST architectural pattern, a.k.a.:

> A balanced architecture for module-oriented, stateful-and-functional applications

## Overview

**BEST** stands for _Behavior - Event - State - Tree_.

* The _tree_ declares the scene graph
* _Events_ react to UI/program actions, and mutate state
* _States_ encapsulate statefulness
* _Behaviors_ are pure functions that react to state changes

## Development

Clone the `ecosystem` repo first:

    $ git clone git@github.famo.us:framework/ecosystem.git
    $ cd ecosystem && npm i && npm link

Now clone the main (`best`) repo into a separate folder:

    $ git clone git@github.famo.us:framework/best.git
    $ cd best && npm i && npm link best-ecosystem

From the main BEST project, start up the development server:

    $ npm run develop

Open [localhost:1337](http://localhost:1337) in your browser.

Edit `public/index.html` to change the deployed component.

### Developing components

To create a component, or modify an existing one, use the `ecosystem` repo.

You will need security credentials to make changes. Contact one of the developers.

As you save edits, your changes will be synchronized with Hub.

Be careful when editing components that are not in your namespace folder!

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Authors

* [Zack Brown](mailto:zack@famo.us)
* [Matthew Trost](mailto:matthew@famo.us)
* [Arkady Pevzner](mailto:arkady@famo.us)
* [Imtiaz Majeed](mailto:imtiaz@famo.us)
* [Jordan Papaleo](mailto:jordan@famo.us)

## Copyright

Copyright &copy; 2015 Famo.us Industries, Inc. All right reserved.
