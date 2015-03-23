# Lifecycle Events

We need at least some sort of `load` and some sort of `unload` events.

More granularly, we probably need some sort of event before the component loads, then after it loads, then before it unloads, then after it unloads.

Questions:

* How should we name these?  Mount/unmount (a la React?)  Load/unload?  Load/remove?  Init/destroy?
  * DOM3 uses `load`/`unload`
* What tense should we use to name these?  More broadly, what tense should we use?  See STYLEGUIDE:  use the imperative tense for event names, including lifecycle events.
* Should clock events like `tick` be considered lifecycle events?
* Should we namespace lifecycle events inside of a `$lifecycle` object? Or just have them accessible at the root of the events object with `$` prefixes? (e.g. `$load`)


### Proposal In Progress:  The Life of a BEST Component

1. Component is initialized at runtime by a parent component or application root
2. Default states are loaded
3. `pre-load` event fires
4. Subcomponents are initialized
5. `post-load` event fires
6. Component exists and is happy with its life
7. Component destruction is initiated by a parent component
8. `pre-unload` event fires
9. Component initializes destruction of its children
10. State is deleted
11. `post-unload` event fires, inside the handlers of which only events can be triggered (state cannot be mutated since it has already been destroyed.)
