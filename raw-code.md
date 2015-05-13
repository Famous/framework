# Using "raw code"

Although we recommend sticking to the BEST conventions as closely as possible, sometimes you just need a way to write some raw JavaScript code without the framework getting in the way. Fortunately, you can do this without needing any additional setup. Just include the code anywhere outside of the `BEST.scene` invocation.

    var hiddenState = 1.0;
    function myHelperFunction() {
        return hiddenState * Math.random();
    }
    BEST.scene('zelda.zulu:hello-best', 'HEAD', {
        // etc
    });

Note that your entrypoint file, e.g. `zelda.zulu/hello-best/hello-best.js` should have at least one call to `BEST.scene` to get the benefits of Famous cloud services.
