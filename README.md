# BEST

Implementation of the BEST framework, a.k.a.:

> A balanced architecture for module-oriented, stateful-and-functional applications

## About

**BEST** stands for _Behavior - Event - State - Tree_.

* The _tree_ declares the scene graph and channels that route actions to _events_.
* _Events_ react to UI/program actions, mutating their modules' encapsulated state.
* _States_ enclose the stateful values of a component in a single place.
* _Behaviors_ are pure functions that respond to state changes by returning values.

In the implementation here, a BEST component looks like this:

```
BEST.component('famous-demos:clickable-black-square', {
    tree: '<famous:view id="context">' +
              '<famous:html-element famous:events:click="handle-click" id="square">' +
                  '<h1>{{ count }}</h1>' +
              '</famous:html-element>' +
          '</famous:view>',
    behaviors: {
        '#context': {
            'size': [200, 200]
        },
        '#square': {
            'template': function(count) {
                return { count: count };
            }
        }
    },
    events: {
        public: {
            'handle-click': function(state) {
                state.set('count', state.get('count') + 1);
            }
        }
    },
    states: {
        count: 0
    }
});
```

## Getting started

Clone the repo.

Install the package dependencies.

    $ npm i -g phantomjs
    $ npm i

Then, start up the development server:

    $ npm run develop

And open [http://localhost:1337/?best=famous-demos:clickable-black-square](http://localhost:1337/?best=famous-demos:clickable-black-square) in your browser.

Change the `?best=` query parameter to the name of the BEST component you want to load. Currently available BEST components are available within the `components` folder.

## Contributing

### Workflow

We use a Git `rebase`-based workflow approach:

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
- When ready, one of the team members will take responsibility for merging `develop` into `master` and cutting a new semver, ensuring that `master` always remains in a stable, documented state.
- Never `merge` `master` into `develop`
- Never `merge` `master`/`develop` into a `feature-branch`
- Always `rebase` if you are further along in the "git river"
- If you accidently end up with a merge commit, deal with the issue locally and make sure it is resolved before pushing up to up to `origin`.

## Authors

* [Zack Brown](mailto:zack@famo.us)
* [Matthew Trost](mailto:matthew@famo.us)
* [Arkady Pevzner](mailto:arkady@famo.us)
* [Imtiaz Majeed](mailto:imtiaz@famo.us)
* [Jordan Papaleo](mailto:jordan@famo.us)

## Copyright

Copyright &copy; 2015 Famo.us Industries, Inc.
