# Using static assets

To use static assets (such as images) with your component, simply include them anywhere within your project folder. For example:

    ├── ...
    └── zelda.zulu/
        └── hello-famous/
            ├── hello-famous.js
            └── my-image.jpg

Then, within your `hello-famous.js` entrypoint file, you can refer to that asset using special syntax for asset interpolation, `@{}`:

    BEST.scene('zelda.zulu:hello-famous', 'HEAD', {
        tree: `<ui-element><img src="@{my-image.jpg}"></ui-element>`
    });
