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


## Git Workflow
We use a `rebase` based workflow approach. The steps are:

- Locally, create a `feature-branch`. Make commits on the `feature-branch`.
  - **DO NOT** make local commits on to `master` or `develop`. Doing so will force a `merge` whenever you pull down from the remote `master`/`develop`, which is what we would like to avoid.
- When ready to push up your `feature-branch`:
  - `git checkout develop`
  - `git pull origin develop`
  - `git checkout feature-branch`
  - `git rebase develop` (fix any conflicts)
  - `git checkout develop`
  - `git merge feature-branch`
  - `git push origin develop`
- When ready, one of the team members will take responsibility for merging `develop` into `master` and cutting a new SemVer, ensuring that `master` always remains in a stable, documented state.
- NEVER `merge` `master` into `develop`
- NEVER `merge` `master`/`develop` into a `feature-branch`
- ALWAYS `rebase` if you are future along in the "git river"
- If you accidently end up with a merge commit, deal with the issue locally and make sure it is resolved before pushing up to up to `origin`.


## Authors

* [Zack Brown](mailto:zack@famo.us)
* [Matthew Trost](mailto:matthew@famo.us)
* [Arkady Pevzner](mailto:arkady@famo.us)
* [Imtiaz Majeed](mailto:imtiaz@famo.us)
* [Jordan Papaleo](mailto:jordan@famo.us)

## Copyright

Copyright &copy; 2015 Famo.us Industries, Inc.
