# FAQ

**Can a parent component query or read the states of a child?**

No. It's up to each component to determine what information to expose by emitting events. The parent must subscribe to those events in order to read that information.

**Can a component change the state values of another?**

No. Events are the only way a component can affect another component's internal state. It must always be the component's own decision how to change its internal state in response to an event.
