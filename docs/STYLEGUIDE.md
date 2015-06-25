# Style Guide

## Components

Famous Framework components are built to be reused and interchanged. Soon, you'll be able to publish your own components for other developers to use. With this in mind, there are some code style rules to abide by to  encourage a healthy and consistent ecosystem of components.

### Naming your component

There are two main parts to naming your component. The first is your name ("John Doe") and the second is the name of your creation ("Cool Button"). When you create your component, write these in only all-lowercase letters and hyphens, e.g. `john-doe` and `cool-button`.

1. Include your first and last name before the colon
2. Include your creation's name after the colon (short and sweet is preferred)
3. Use hyphens to separate words

Example:

```
FamousFramework.component('john-doe:cool-button', {...});
```

### Naming behaviors

We recommend you follow a similar convention for your component's behavior functions:

1. Use strings for selectors (`'div'`), function names (`'size'`), and style keys and values (`'color': 'red'`)
2. Use all-lowercase letters and hyphens with function names with more than one word (`'mount-point'`)

Example:

```
behaviors: {
    '$self': {
        'size': [400, 400],
        'align': [0.5, 0.5],
        'origin': [0.5, 0.5],
        'mount-point': [0.5, 0.5],
        'rotation-z': function(angle) {
            return angle;
        },
        'style': {
            'color': '#7099EE',
            'background': '#222222',
            'border': '6px solid #333333',
            'text-align': 'center',
            'font-size': '60px',
            'font-family': 'Lato',
            'cursor': 'pointer'
        },
        'unselectable': true
    },
    'div' : {
        'content': function(numberOfClicks) {
            return numberOfClicks;
        }
    }
}
```

### Events

Just as with behavior functions, we recommend you follow a similar convention for your component's event functions:

1. Use strings for selectors (`'$self'`) and function names (`'click'`)
2. Use all-lowercase letters and hyphens

Example:

```
events: {
    '$self': {
        'click': function($state) {
            $state.set('numberOfClicks', 1 + $state.get('numberOfClicks'));
            $state.set('angle', $state.get('angle') + Math.PI/2, {
                duration: 500,
                curve: 'outBounce'
            });
        }
    }
}
```

### States

For state property names, we recommend always using camel case (e.g. `camelCase`):

Example:

```
states: {
    numberOfClicks: 0,
    angle: 0
}
```

This is particularly important when you consider behavior functions, which can only subscribe to state values whose names are valid JavaScript variable names. (E.g., consider `function(fooBar){...}` vs `function(foo-bar){/*syntax error!*/}`.)

### Tree

Include the tree inline within your project's entrypoint `.js` file if it is short...

```
tree: `
    <div></div>
`
```

But move it into a separate file it it is long:

```
tree: 'my-tree.html' // Our build process will automatically grab the tree content for you if you refer to it like this
```
