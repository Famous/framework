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

Alternatively, if you need to do dynamic asset interpolation or need to refer to assets that are hosted inside another module, the `@{CDN_PATH}`syntax should be used:

```
behaviors: {
    '#ui-element-1': {
        content: function(imagePath) {
            return '<img src="@{CDN_PATH}' + imagePath + '">';
        }
    },
    '#ui-element-2': {
        content: function(otherImagePath) {
            return '<img src="@{CDN_PATH|foo:bar}' + otherImagePath + '">';
        }
    }
}

```

Refer to `famous:tests:static-assets` for a working example of this concept.