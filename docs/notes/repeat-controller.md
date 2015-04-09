### Repeat Controller
######Implementation details/concerns:
* triggering global change
    *   In the current implementation, when new children are created after the `$repeat` behavior runs, there is a global state trigger (i.e., `Node.prototype.triggerGlobalChange`) to ensure that all of the new `BestNodes`'s states are current. This introduces unnecessary overhead that can lead to a noticeable performance hit because the state is also being retriggered on non-newly-added nodes. A potential solution could be to not trigger the global change and have the developer manually pass through state in the messages object inside of the `$repeat` behavior to ensure newly-added nodes are in sync.
