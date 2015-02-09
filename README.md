#Mimisbrunnr

Mimisbrunnr is the well of knowledge and wisdom from which the tree of Yggdrasil draws its water.

Mimir, the attendant of the spring, is "The Rememberer."

It's an application framework built on top of the rendering engine Yggdrasil.

##Goals

 * Offer a robust framework, focused around a module system, for developers to build scalable apps
 * Support *module configuration* (visually) at a framework level.
 * Allow *behavior* to live in its own (stateless) layer
 * Allow *state* to live in its own layer, such that a configuration-based authoring system can be supported naturally at the framework level
 * Draw clean abstraction lines between modules such that
 	* An entire application is comprised of 1 or more modules and 0 or more assets [leaf nodes]
 	* A module is comprised of 0 or more modules and 0 or more assets, with at least 1 of either a module or an asset.
 	* Communication between modules occurs stricly via events, possibly with a monadic helper pattern

##High level design

**BEST Architecture**

Any module is comprised of four pieces:

  1. A "Behaviors" component
  2. An "Events" component
  3. A "States" component
  3. A "Template" component

The `events` object is a list of event handlers.

> EventHandlers are given DI'd references to state bags and are able to get and set state values.

The `state` is a simple key-value bag of states.  A default configuration can be applied to a given module (which is essentially what happens via a slider interface)

>  A *dependency injection* system exposes state values to behaviors, ideally immutably (implementing the immutable piece will be tricky and is not necessary out of the gate.)

The `behavior` is a list of functions that take values from state (via DI) and return values associated with that behavior.  `translate` or `background-color` could both be behaviors.

>  *Selectors* attach behaviors to template items.  Just like CSS in terms of separation of concerns, but it's javascript.

The `template` is a tree structure of Famo.us components:  views, primitives/surfaces, and/or other modules.  This could be done with JSON, but DOM is a natural solution for storing this hierarchy since it comes with a robust selector (querying) system, and it would easily extend to integrate with other HTML-based frameworks.

>  *Events* can be attached to templates declaratively.  (full circle back to 'events')


### Web workers

Given the event-driven approach to this architecture, web workers should be a natural fit.  Broadly:

```
 UI events
 (e.g. DOM)             Almost everything  serialized   Renderers
--------------  event  ------------------   output     -------------
| UI Thread  | ------> |   Web Worker   | -----------> | UI Thread |
--------------         ------------------              -------------
```