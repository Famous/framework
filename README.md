#BEST

BEST (Behavior Event State Template) is a web application architecture that focuses on application extensibility, application modularity, and module configurability.

###How:

  * **Declaration** and **mutation** of the stateful aspects of an application are strictly separated from the **behaviors** that describe UI rendering.
  * Only **events** (with immutable payloads) are used to connect modules to each other. (i.e. no shared state.)
  * A **template** is described declaratively, which defines child module dependencies.
  * **Behaviors** are relationally joined to template components, allowing the Behavior and Template components to remain separate.
  * **Behaviors** are strictly functional declarations of module behavior: they can only *read* state, must be deterministic, and they can incur no side effects.


**By BEST, formal definitions for application modules are defined:**

  1. An APPLICATION is a fully bundled unit of code and assets that can be run in a browser. An APPLICATION contains precisely one tree of MODULES with at least a root node.
  2. Let A be a MODULE; let B be another MODULE.  B is a CHILD of A if and only if B is used as a direct dependency in A.
  3. A MODULE has 0 or more CHILD MODULES, 0 or more CHILD ASSETS, and at least 1 of either a CHILD MODULE or CHILD ASSET.
  4. An ASSET is 0 or more static binary or text assets (for web rendering in the immediate scope, for example a collection of HTML, JS, CSS, and image files.)
  5. An ASSET can have no direct child MODULES (it is a leaf node of the APPLICATION tree.)

##Goals driving BEST

 * Offer a robust framework, focused around a module system, for developers to build scalable, composable, configurable apps
 * Support *module configuration* (visually) at a framework level.
 * Allow *behavior* to live in its own (stateless) layer
 * Allow *state* to live in its own layer, such that a configuration-based authoring system can be supported naturally at the framework level


##High level design

Any module is composed of four pieces:

  1. 0 or more "state"ful values
  2. 0 or more "behavior" declarations
  3. 0 or more progeny modules declared in a "template."
  4. 0 or more "event" triggers and handlers

The `state` is a read/write key-value store that controls state changes via getters/setters and that can thus handle `Object.observe`-like behavior without the performance overhead that comes with `Object.observe`.

> A *dependency injection* system exposes state values to behavior functions

`behavior`s are functions that return values to be applied to the specified behavior.  `behaviors` list their dependencies (strictly, members of the `state` bag) as function arguments, and they are dependency-injected appropriately.  `translate` or `background-color`, for example, could both be behaviors.

> Consider the case of `background-color`.  Perhaps you have a checkbox and a `div` on screen.  You want that `div`'s background color to be red when the checkbox is selected and yellow when it isn't.  Thus you apply to that `div` a `behavior` that describes the desired background color.  Suppose you have some boolean state, "checkboxChecked".  Formally, that `behavior` is a function with the domain "possible values for checkboxChecked" (let's say boolean) and with the range "valid CSS colors."  This behavior could be written `function(checkboxChecked){return checkboxChecked ? "red" : "yellow";}`.  This approach can be extended robustly to cover more complex behaviors, notably including transform values like `translate`, `rotate`, `scale`, etc.

> Behaviors are relationally joined to template items.  *DOM* and *selectors* are a natural fit for this, since precisely the same model is followed for CSS properties and HTML elements when authoring external stylesheets.  In this case, behavioral functions (like `translate`), instead of CSS properties (like `background-color`) are applied to elements via selectors.

The `template` is a tree structure of child modules, which defines the (sub)tree of an application expressed by a given module.  In addition to the separation-of-concerns benefits of DOM + selctors, DOM is a natural data structure for this hierarchy since it easily extends to integrate with other HTML-based frameworks and static HTML content.

>  Events from *lower* in the application tree are triggered (in the sense of "port triggering") by event triggers defined on template elements.  For example, if a child slider component emitted upward some event called `sliderupdate` and you wanted to attach an event handler called `mySliderUpdateHandler` to that `sliderupdate` event inside of a module that is a progenitor of that `sliderupdate` module, you could write in your template: `<your-slider-component on-sliderupdate="mySliderUpdateHandler"></your-slider-component>`.

Events are simple javascript events.  Event Handlers describe how a module should respond to events and their stateful payloads.  Events Handlers are both able to read and write from the state bag for the module to which they belong.  They are also able to fire other events to be handled by progeny or progenitor modules

(TODO:  determine if downward broadcasting is desired or useful [or poisonous,] i.e. maybe it is only necessary to event to progenitors.  Certainly, upward emitting is useful (for firing the events that will be caught by progenitor template event triggers).  It may be that `behaviors` are the only necessary downward eventing mechanism and that manual downward broadcasts would encourage 'event soup.')


```
    -----------------        ------------------
    |               |        |                |
    |    State      |   -->  |    Behaviors   |
    |               |        |                |
    -----------------        ------------------
            ^                        |
            |                        v
    -----------------        ------------------
    |               |        |                |
    |    Events     |   <--  |    Template    |
    |               |        |                |
    -----------------        ------------------
```
*Figure 1: Topology of a module*