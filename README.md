#Mimisbrunnr

Mimisbrunnr is the well of knowledge and wisdom from which the tree of Yggdrasil draws its water.

Mimir, the attendant of the spring, is "The Rememberer."


##wut?

Mimisbrunnr is an application framework built on top of the rendering engine Yggdrasil.

##Goals

 * Offer a robust framework, focused around a module system, for developers to build scalable apps
 * Support *module configuration* (visually) at a framework level.
 * Allow *behavior* to live in its own (stateless) layer
 * Allow *state* to live in its own layer, such that a configuration-based authoring system can be supported naturally at the framework level
 * Draw clean abstraction lines between modules such that
 	* An entire application is comprised of 1 or more modules
 	* A module is comprised of 0 or more modules
 	* (optionally: communication between modules occurs stricly via events, possibly with a monadic helper pattern)


##High level design

Any module is comprised of three pieces:

  1. A "state" component
  2. A "behavior" component
  3. A "template" component

The `state` is a javascript Object (or class) that holds stateful values and *exposes which values are configurable.*  This can be in the form of JSON, code comments, or any other sort of annotation.

>  A *dependency injection* system exposes state values to behaviors, ideally immutably (implementing the immutable piece will be tricky and is not necessary out of the gate.)

The `behavior` is a list of functions that take values from state (via DI) and return values associated with that behavior.  `translate` or `background-color` could both be behaviors.

>  *Selectors* attach behaviors to template items.  Just like CSS, but it's javascript.

The `template` is a tree structure of Famo.us components:  views, primitives/surfaces, and/or other modules.  This could be done with JSON, but DOM is a natural solution for storing this hierarchy since it comes with a robust selector (querying) system, and it would easily extend to integrate with other HTML-based frameworks.

>  *Events* from DOM are handled by the `state` object, which can mutate states as needed.