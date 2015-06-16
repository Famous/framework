# Famous Framework (beta)

The Famous Framework is a new JavaScript framework for creating reusable, composable, and interchangeable UI widgets and applications. It's declarative, functional, and built on the [Famous Engine](https://github.com/Famous/engine). We are excited to make it available as open source under an MIT license for the first time as part of an early public beta.

- - - -

**IMPORTANT:** This project is in an early phase and under active development; expect bugs and breaking changes to occur. To submit a bug report, please use [GitHub Issues](https://github.com/Famous/framework/issues). For questions and general support, join our [Slack channel](https://famous-community.slack.com/messages/framework/). **We strongly recommend that you read this README before starting. Also see http://famous.github.io/framework/ for a general intro.**

- - - -

## Setup &amp; installation

The easiest way to get started is the Famous CLI (via its `framework` branch). Scaffolding is provided because the Famous Framework includes a set of custom local development tools which, while not required to use the framework, make creating components more straightforward. (We'll soon be documenting how to use the framework without any build tools.)

First, make sure you have [Node.js](http://nodejs.org) installed, at least version `0.12`.

Then, to get started, first create a new folder for your project:

    $ mkdir my-new-folder # Create a new folder to hold your code
    $ cd my-new-folder

Next, install a special version of the Famous CLI:

    $ npm cache clean
    $ npm install -g 'git://github.com/Famous/famous-cli.git#framework'
    # ^ This installs the Famous CLI. You may need to 'sudo' this

Then, with the install of the special Famous CLI version complete, run a command to scaffold a new framework project in the directory you created above:

    $ famous framework-scaffold
    ? Enter a username: bobette-smith
    ? Enter your component's name: todos
    ? Does the project name "bobette-smith:todos" look ok? Yes
    Created framework scaffold in current working directory!
    $ npm install
    $ npm run dev

Once the local server and watchers are running, surf to [localhost:1618/](http://localhost:1618/). Changes you make to files within the `components/` folder will trigger automatic reload.

- - - -

## Why?

With so many world-class JavaScript frameworks out there, why has Famous decided to release its own? In a nutshell:

* **Reusability / interchangability.** The Famous Framework is built around powerful constraints and a declarative syntax that make it possible for components to be reused and interchanged.

* **Application consistency.** In an ecosystem where widgets/applications/utilities all follow the same guidelines, developers and designers both reap the benefits: less trial and error when attempting to integrate with others' projects.

* **Integration with existing web standards.** Although our integration is far from complete, from the beginning we've aimed to design and build the framework around existing web standards.

* **Static analyzability:** Components that follow the constraints established by the Famous Framework can be staticaly analyzed, which hints at some exciting possibilities for tools and services that could be built on top.

- - - -

## Example

Below is an example of what a Famous Framework component looks like. This code lives in a file `bobette-smith/nifty-demo/nifty-demo.js`. (The convention of only lowercase letters and hyphens is important to stick to.)

    FamousFramework.component('bobette-smith:nifty-demo', {
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

## How to make the most of the framework:

1.) Color inside the lines: Although we've taken care to ensure you can break out of our guidelines and syntax when you need to, we think you'll have a better experience if you stick with them. In some cases, this means you'll have to approach familiar problems in a new way.

2.) Remember the microchip: In Famous Framework, every component is a black box. Sharing state between components is not provided for; you must build your app so that the inputs and outputs of each component connect and synchronize in the right way.

3.) Join the Slack channel: The best way to get help and troubleshoot is via the [Famous Framework Slack channel](https://famous-community.slack.com/messages/framework/). Our engineers visit regularly and will do their best to answer questions you may have, from the conceptual to technical.

- - - -

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt
