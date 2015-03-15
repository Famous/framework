# BEST

Implementation of the BEST framework, a.k.a.:

> A balanced architecture for module-oriented, stateful-and-functional applications

## About

**BEST** stands for _Behavior - Event - State - Tree_.

* The _tree_ declares the scene graph and channels that route actions to _events_.
* _Events_ react to UI/program actions, mutating their modules' encapsulated state.
* _States_ enclose the stateful values of a component in a single place.
* _Behaviors_ are pure functions that respond to state changes by returning values.

In the implementation here, a BEST component might look like this:

    BEST.component('mario:sprite', {
        behaviors: {
            size: function(health) {
                if (health < 2) return 0.5;
                else return 1;
            }
        },
        events: {
            public: {
                'damage': function(state) {
                    state.subtract('health', 1);
                }
            }
        },
        states: {
            health: 2
        },
        tree: '<image tap="damage"></image>'
    });

(That's just a pretend example to get the basic idea across.)

[For more, see the `docs` folder](docs).

## Getting started

After cloning the repo, a few steps to get set up:

Use `famous-conductor` to install Famous modules into `vendor/famous`.

Install the packages (some of which locally link the Famous modules you just installed):

    $ npm i -g phantomjs
    $ npm i

Then, start up the development server:

    $ npm run develop

And open [localhost:1337](http://localhost:1337) in your browser.

## Tests

Run all of the tests with:

    $ npm test

## Docs

See the `docs` folder.

## Authors

* [Zack Brown](mailto:zack@famo.us)
* [Matthew Trost](mailto:matthew@famo.us)
* [Arkady Pevzner](mailto:arkady@famo.us)
* [Imtiaz Majeed](mailto:imtiaz@famo.us)
* [Jordan Papaleo](mailto:jordan@famo.us)

## Copyright

Copyright &copy; 2015 Famo.us Industries, Inc.
