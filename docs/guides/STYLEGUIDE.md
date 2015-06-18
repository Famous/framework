# Style Guide

## Components

Famous Framework components are built to be reused and interchanged. Soon, you'll be able to publish your own components for other developers to use. With this in mind, there are some code style rules to abide by to 
encourage a healthy and consistent ecosystem of components.


### Naming your component

There are 2 main parts to naming your component. The first is your name (John Doe) and the
second is the name of your creation (cool button).

1. Include your first + last name before the colon.
2. Include your creation's name after the colon (short and sweet is preferred).
3. Use hyphens to separate words.

`FamousFramework.component('John-Doe:cool-Button', {...});`


### Behaviors

1. Use strings for selectors ('div'), function names ('size'), and style keys and values ('color': 'red').
2. Use hyphens with function names with more than one word ('mount-point').

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
        'text-content': '[[identity|numberOfClicks]]'
    }
}
```

### Events

1. Use strings for selectors ('$self') and function names ('click').

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

1. Use camelCasing ('numberOfClicks').

```
states: {
    numberOfClicks: 0,
    angle: 0,
}
```

### Tree

1. Include the tree in the main .js file if it is short (break out into own .html file if longer).

```
tree: `
    <div></div>
`
```


## Framework

Framework source code style guide coming soon!