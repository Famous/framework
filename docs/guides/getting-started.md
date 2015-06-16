# Getting Started

The [Famous Framework](https://github.com/Famous/framework) provides a structured API for controlling UI elements with the Famous Engine. As a framework, its goals are to bring composability, extensibility, and consistency fo UI applications.

## Setup &amp; installation

The easiest way to get started is the Famous CLI (via its `framework` branch). Scaffolding is provided because the Famous Framework includes a set of custom local development tools which, while not required to use the framework, make creating components more straightforward. (We'll soon be documenting how to use the framework without any build tools.)

First, make sure you have [Node.js](http://nodejs.org) installed, at least version `0.12`. Then, to get started, simply follow these instructions:

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
