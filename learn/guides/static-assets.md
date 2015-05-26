# Using static assets

To use static assets (such as images) with your component, simply include them anywhere within your project folder. For example:

    ├── ...
    └── zelda.zulu/
        └── hello-best/
            ├── hello-best.js
            └── my-image.jpg

Then, within your `hello-best.js` entrypoint file, you can refer to that asset using special syntax for asset interpolation, `@{}`:

    BEST.scene('zelda.zulu:hello-best', 'HEAD', {
        tree: `<ui-element><img src="@{my-image.jpg}"></ui-element>`
    });
