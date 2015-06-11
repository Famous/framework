FamousFramework.scene('famous-tests:include-css', {
    tree: `
        <h1 id="my-h1">Testing that CSS is included via includes correctly</h1>
        <h2>You should see a blug background, white large header text, and three orange underlined ahoys.</h2>
        <p class="p">Ahoy</p>
        <p class="p">Ahoy</p>
        <p class="p">Ahoy</p>
    `
})
.config({
    includes: [
        'a.css',
        'b.css',
        'c.css',
        'd.css',
        'e.css'
    ]
});
