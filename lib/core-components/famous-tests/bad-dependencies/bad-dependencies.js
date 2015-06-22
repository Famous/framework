FamousFramework.module('famous-tests:bad-dependencies', {
    behaviors: {
        'style:': {
            'style:': {

            }
        }
    },
    events: {
        '#hi': {
            'size:': {

            }
        }
    },
    tree: `
        <p style="color:white;">You should see an error message to the effect of</p>
        <p style="color:white;">"Direct targeted behavior is not supported..."</p>
    `
});

console.log('You should see an error message to the effect of');
console.log('"Direct targeted behavior is not supported..."');
