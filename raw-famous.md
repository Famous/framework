# Using "raw" Famous

Some developers need a way to drop down to the low-level Famous rendering engine in order to get the job done. Luckily, this is just as easy as using [raw JavaScript code](raw-code.md). We make the full Famous library available exposed as a global `Famous` object, which you can tap into to squeeze the most out of the engine.

    var context = Famous.createContext();
    var root = context.addChild();
    var el = new Famous.domRenderables.DOMElement(root);
    el.setProperty('background', 'yellow');
    BEST.scene('zelda.zulu:hello-best', 'HEAD', {
        // etc
    });

Note that your entrypoint file, e.g. `zelda.zulu/hello-best/hello-best.js` should have at least one call to `BEST.scene` to get the benefits of Famous cloud services.
