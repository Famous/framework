# Using "raw" JavaScript

Although we recommend sticking to the BEST pattern as closely as possible, sometimes you just need a way to write some raw JavaScript code without the Famous Framework getting in the way. Fortunately, you can do this without needing any additional setup. Just include the code anywhere outside of the `BEST.scene` invocation.

    var hiddenState = 1.0;
    function myHelperFunction() {
        return hiddenState * Math.random();
    }
    BEST.scene('zelda.zulu:hello-best', {
        // etc
    });

Note that your entrypoint file, e.g. `zelda.zulu/hello-famous/hello-famous.js` should have at least one call to `BEST.scene` to get the benefits of Famous cloud services.
