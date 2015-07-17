# Famous Framework (alpha)

The Famous Framework is a new JavaScript framework for creating reusable, composable, and interchangeable UI widgets and applications. It balances declarative with imperative and functional with stateful, and it's built on top of the [Famous Engine](https://github.com/Famous/engine). We are excited to make it available as open source under the MIT license for the first time as part of a public alpha.

**Read more about the Framework in our in-depth [introductory blog post](//blog.famous.org).**

- - - -

**IMPORTANT:** This project is in an early phase and under active development; expect bugs and breaking changes to occur. To submit a bug report, please use [GitHub Issues](https://github.com/Famous/framework/issues). For questions and general support, join our [Slack channel](https://famous-community.slack.com/messages/framework/).

- - - -

## Setup &amp; installation

The easiest way to get started is the Famous CLI. Scaffolding is provided because the Famous Framework includes a set of custom local development tools which, while not required to use the framework, make creating components more straightforward. (We'll soon be documenting how to use the framework without any build tools.)

First, **make sure you have [Node.js](http://nodejs.org) installed, at least version `0.12`.** (We hope to support Node.js `0.10` in the near future.) Then, to get started, create a new folder for your project:

    $ mkdir my-new-folder # A new folder to hold your code
    $ cd my-new-folder

Next, install the Famous CLI (if you haven't already):

    $ npm install -g famous-cli

Next, register with Famous to establish your username (if you haven't already):

    $ famous register

Then, scaffold a new framework project in the directory:

    $ famous framework-scaffold
    ? Enter your component's name: todos
    ? Does the project name "jane-doe:todos" look ok? Yes
    Installing npm dependencies and running setup tasks...
    (Lots of installation messages here)
    $ npm run dev

Once the local server and watchers are running, surf to [localhost:1618/](http://localhost:1618/). Changes you make to files within the `components/` folder will trigger automatic reload.

### Windows

Installation is not currently working on Windows. Fixing this is a top priority and the progress is being tracked in the following GitHub Issue: https://github.com/Famous/framework/issues/17.

- - - -

## Example

Below is an example of what a Famous Framework component looks like. This code lives in a file `jane-doe/nifty-demo/nifty-demo.js`. (The convention of only lowercase letters and hyphens is important to stick to.)

    FamousFramework.component('jane-doe:nifty-demo', {
        behaviors: {
            '#box': {
                'size': [100, 100],
                'style': {
                    'background-color': '#40b2e8'
                },
                'rotation-z': function(rotation) {
                    return rotation;
                }
            }
        },
        events: {
            '#box': {
                'click': function($state) {
                    $state.set('rotation', $state.get('rotation') + 10, {
                        duration: 1000,
                        curve: 'easeOut'
                    });
                }
            }
        },
        states: {
            rotation: 0
        },
        tree: `<node id="box"></node>`
    });

- - - -

## Documentation

For API docs, reference docs, and guides, please see [famous.org/framework](http://famous.org/framework/).

If you want to contribute to our documentation, or see the latest docs in progress, check out [github.com/Famous/framework-guides](https://github.com/Famous/framework-guides).

- - - -

## Deploying (experimental)

From the directory that you created via the `famous framework-scaffold` command (see above), you should be able to run:

```
$ famous deploy
```

This will push your project up to a Famous container, and create an embed code for sharing.

- - - -

## Why?

With so many world-class JavaScript frameworks out there, why has Famous decided to release its own? In a nutshell:

* **Reusability / interchangeability.** The Famous Framework is built around powerful constraints and a declarative syntax that make it possible for components to be reused and interchanged.

* **Application consistency.** In an ecosystem where widgets/applications/utilities all follow the same guidelines, developers and designers both reap the benefits: less trial and error when attempting to integrate with others' projects.

* **Integration with existing web standards.** Although our integration is far from complete, from the beginning we've aimed to design and build the framework around existing web standards.

* **Static analyzability:** Components that follow the constraints established by the Famous Framework can be statically analyzed, which hints at some exciting possibilities for tools and services that could be built on top.

- - - -

## How to make the most of the framework:

1.) Color inside the lines: Although we've taken care to ensure you can break out of our guidelines and syntax when you need to, we think you'll have a better experience if you stick with them. In some cases, this means you'll have to approach familiar problems in a new way.

2.) Remember the microchip: In Famous Framework, every component is a black box. Sharing state between components is not provided for; you must build your app so that the inputs and outputs of each component connect and synchronize in the right way.

3.) Join the Slack channel: The best way to get help and troubleshoot is via the [Famous Framework Slack channel](https://famous-community.slack.com/messages/framework/). Our engineers visit regularly and will do their best to answer questions you may have, from the conceptual to technical.

- - - -

## Contributing

We welcome contributions in the form of [bug reports](https://github.com/famous/framework/issues), [documentation](https://github.com/Famous/framework-guides), and pull requests. If you want to contribute to Famous Framework codebase, follow these instructions:

1. [Fork the repo](https://github.com/famous/framework/fork)
2. Keep your fork up to date
3. Sign our [Contributor License Agreement](http://famous.org/cla/)

Our `develop` branch is the main development branch. All commits should be submitted in the form of pull requests to `develop`. Once you've forked us, clone your fork, and create a new branch for your feature or bug fix. Then, to run locally:

    $ npm install
    $ npm run local-only-bootstrap
    # Wait a few seconds while components are built...

A demo page should now be visible at [localhost:1618](http://localhost:1618). Changes to any of our [core components](lib/core-components) or to the [browser runtime](lib) should trigger automatic reload. The framework's build pipeline and tools are located in the [dev](dev) folder.

- - - -

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt.
