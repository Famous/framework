#Styleguide

A best-practice styleguide for BEST applications.

### Naming and casing

* Components
  * Namespace components starting with your username or organization name followed by at least one component/subcomponent name.
  * Component/subcomponent names are for your own organization, similar to folders in a filesystem.
  * Use `hyphenated-lower-case`.
  * Separate username/component/subcomponent tokens with colons.
  * For example: `zackbrown:flickrous`, `zackbrown:flickrous:header`, and `famous:demos:gl-sun` are all valid component names.

* Behaviors
  * Name behaviors in `hyphenated-lower-case`

* Events
  * Name event handlers in `hyphenated-lower-case`.
  * Events should be in the imperative tense.  They should not be past participles.  For example, use `click`, not `clicked`; `send`, not `sent`.
  * Generally, follow DOM3 event naming conventions, except use `hyphenated-lower-case` instead of `spacelesslowercase`

* States
  * Name states in `camelCase`

* Trees(Templates?  where are we on naming this now that we're supporting moustache templating?)
  * TODO

### Filesystem Organization

TODO

### TODO