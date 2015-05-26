# Loading external CSS and JS

To include external CSS or JavaScript with your module, first place the files into your project directory, for example:

    ├── ...
    └── zelda.zulu/
        └── hello-best/
            ├── hello-best.js
            ├── foo.css
            └── bar.js

Then, indicate that you want to load these files by using the `config` method, which can be chained to your main scene definition:

    BEST.scene('zelda.zulu:hello-best', 'HEAD', {
        // etc
    })
    .config({
        includes: [
            'foo.css',
            'bar.js'
        ]
    });

The assets will be added to the document `<head>` in the order they were found in the `includes` array, and your component will only be initialized after they are loaded.
