# FAQ

**Why isn't my module rebuilding when I change a child component?**

Our local watchers and build tools do not support automatically tracing and re-building the _dependants_ of a given component. If you've made a change to a dependency of your component, you also need to re-save the component itself (the _dependant_) to pick up the latest from the dependency that was saved. Think of this like `npm install`-ing the latest version of a module you depend on. We are hoping to provide some tools soon that make this process smoother.

**How can I use module loading in my component?**

While there's no restriction that prevents module loading syntax in your component files &mdash; e.g. using `require('foo')` or `import` &mdash; the current implementation of Famous Framework doesn't automatically install/bundle these modules for you. The workaround for using module loading in the meantime is to pre-build your project and _then_ feed the built file through the Famous Framework build pipeline. (We understand that this is inconvenient, and a fix is coming soon.)

One approach to doing this workaround would be to create a pre-build file, e.g. `foo/bar/_bar.js`, with your "plain" code, run that through your own build process (e.g. Browserify) such that the output is written to your "actual" entrypoint file, e.g. `foo/bar/bar.js`. When that destination file changes, the Famous Framework watchers should trigger a rebuild. We've done a preliminary test of this with Browserify, and it works without errors.

**How can I use someone else's component in my app?**

This feature is coming very soon. You'll be able to refer to others components by name within your component, and we will automatically pull it down and include it for you. When it's available, we'll provide a full guide on the different ways to share/reuse components published by others.

**How can I publish my component?**

This feature is coming very soon. When it's available, we'll provide a full guide on how to publish your component, tag your pushes with versions, etc.

**Can a component query/read the states of a descendant?**

No. It's up to each component to determine what information to expose by emitting events. The ancestor must subscribe to events emitted by the descendant in order to access information that the descendant wants to expose.

**Can a component change the state values of another?**

No. Events are the only way a component can affect another component's internal state. It must always be the component's own decision how to change its internal state in response to an event.
