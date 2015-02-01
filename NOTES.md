# Notes

- Is there support for align?  Are there plans for supporting align?

- `this` sucks.  it's one of the worst parts of javascript.  the developer has *no* ability to determine what `this` is without either backtracking through code or `console.log`ging.  The less we can rely on `this`, the better.  This gets even messier given that `this` can mutate at runtime based on application code. Explicit DI would be much, much, much preferred and should be a nominal refactor (for example, pass a reference to the context by name as a parameter in `layout` and `render` instead of relying on this.)

- is `switch`ing through index or data the prescribed way to determine how to position various elements?  This does not feel elegant.

- What would it take to make a simple spinning famous logo with a slider that affects its speed of rotation?  

- How can I access `data` in my `render` function?  For example, I want to be able to declare the src of several different images in my data and then create those images in my render function.  Is this possible?


- How can I define events on content that I create?  E.g. for a slider that I add as content 

- Can I add arbitrary DOM content to 


- Debuggability:  When I have errors in my application code, the error message is not useful.  "VirtualElement.js:463 Uncaught TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'."


- The framework seems technically complete enough to be able to represent an arbitrary application.  In terms of practical authorability, maintainability, and scalability, I have bigger concerns.

- Updating a view (consider the case of adding a new component into the middle of a custom layout) requires updating logic in multiple, disjoint places.  Currently, it appears that switching over index is the only way to distinguish bevahior of the various components in a view, which is extremely brittle.