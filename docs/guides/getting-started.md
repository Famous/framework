The [Famous Framework](https://github.com/Famous/framework), built by engineers at Famous, provides an easy-to-use API for harnessing the Famous Engine. It's also designed to integrate seamlessly with (forthcoming) Famous studio tools and Famous cloud services.

## Setup &amp; installation

The easiest way to get started is the Famous CLI (via its `framework` branch). Scaffolding is provided because the Famous Framework includes a set of custom local development tools which, while not required to use the framework, make creating components more straightforward. (We'll soon be documenting how to use the framework without any build tools.)

First, make sure you have [Node.js](http://nodejs.org) installed, at least version `0.12`.

Then, to get started, simply follow these instructions:

    $ mkdir my-new-folder  # create a new folder to hold your code
    $ cd my-new-folder
    $ npm install -g git://github.com/Famous/famous-cli.git#framework # Install the CLI.  You may need to 'sudo' this
    $ famous framework-scaffold
    ? Enter a username: bobette-smith
    ? Enter your component's name: todos
    ? Does the project name "bobette-smith:todos" look ok? Yes
    Created framework scaffold in current working directory!
    $ npm install
    $ npm run dev

Once the local server and watchers are running, surf to [localhost:1618/](http://localhost:1618/). Changes you make to files within the `components/` folder will trigger automatic reload. 

- - - -

## How to make the most of the framework:

1.) Color inside the lines: Although we've taken care to ensure you can break out of our guidelines and syntax when you need to, we think you'll have a better experience if you stick with them. In some cases, this means you'll have to approach familiar problems in a new way.

2.) Remember the microchip: In Famous Framework, every component is a black box. Sharing state between components is not provided for; you must build your app so that the inputs and outputs of each component connect and synchronize in the right way.

3.) Join the Slack channel: The best way to get help and troubleshoot is via the [Famous Framework Slack channel](https://famous-community.slack.com/messages/framework/). Our engineers visit regularly and will do their best to answer questions you may have, from the conceptual to technical.

- - - -

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt
