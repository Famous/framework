# $index

`$index` is a special piece of state representing a component's index in its parent's children array. With respect to a parent, the first child will have an `$index` of 0, the second child will have an `$index` of 1, the third child will have an `$index` of 2, etc.

```
FamousFramework.module('username:foo', {
    tree: `
        <node class='block'> <div>0</div> </node> // $index === 0
        <node class='block'> <div>1</div> </node> // $index === 1
        <node class='block'> <div>2</div> </node> // $index === 2
        <node class='block'> <div>3</div> </node> // $index === 3
    `
});
```

`$index` can be injected into an event handler. If the event handler is triggered by a UI event, the value of $index will correspond to the component that triggered the event.

```
FamousFramework.module('username:foo', {
    events: {
        '.block' : {
            click: function($index) {
                // $index will correspond to the index of
                // the <node> that was clicked
            }
        }
    }
    tree: `
        <node class='block'> <div>0</div> </node> // $index === 0
        <node class='block'> <div>1</div> </node> // $index === 1
        <node class='block'> <div>2</div> </node> // $index === 2
        <node class='block'> <div>3</div> </node> // $index === 3
    `
});
```

If the event handler is not triggered by a UI event, the value of $index will correspond to the index of the current component.

```
FamousFramework.module('username:foo', {
    events: {
        '$public' : {
            'some-event': function($index) {
                // If `username:foo` is deployed, the value of
                // $index will be 0.
                
                // If `username:foo` is a child of a parent
                // component that has been deployed, the value of
                // $index will be the index that `username:foo` is
                // with respect to its parent.
            }
        }
    }
    tree: `
        <node class='block'> <div>0</div> </node> // $index === 0
        <node class='block'> <div>1</div> </node> // $index === 1
        <node class='block'> <div>2</div> </node> // $index === 2
        <node class='block'> <div>3</div> </node> // $index === 3
    `
});
```

`$index` is also a special value that into a behavior. Injecting `$index` "inverts" the given behavior. Instead of running once per state change, the behavior will run once ___per each component___ with the value of `$index` changing with each time.

```
FamousFramework.module('username:foo', {
    behaviors: {
        '.block' : {
            // This behavior will run once everytime the piece
            // of state named "size" changes. The value returned
            // from this behavior will define the size of all four
            // <node>s.
            
            size: function(size) {
                return size;
            },
            
            // Everytime the piece of state named "positionY" changes,
            // this behavior will run four times: once for each <node>.
            // This is what is meant by an "inverted" behavior. The
            // value of $index will range from 0 to 3, and the value 
            // returned by this behavior will define the position for
            // the respective <node>.
            
            position: function($index, positionY) {
                return [$index * 150, positionY];
            }
            
        }
    },
    states: {
        positionY: 100,
        size: [100, 100]
    },
    tree: `
        <node class='block'> <div>0</div> </node> // position: [0, 100]
        <node class='block'> <div>1</div> </node> // position: [150, 100]
        <node class='block'> <div>2</div> </node> // position: [300, 100]
        <node class='block'> <div>3</div> </node> // position: [450, 100]
    `
});
```

`$index` can also be used in conjunction with the `$repeat` behavior.

```
FamousFramework.module('username:foo', {
    behaviors: {
        '.block' : {
            $repeat: function() {
                var result = [];
                for (var i = 0; i < 4; i++) {
                    result.push({
                        content: `<div>${i}</div>`
                    });
                }
                return result;
            },
            position: function($index, positionY) {
                return [$index * 150, positionY];
            }

            size: [100, 100],
            style: {
                'background-color' : 'black',
                'color': 'white'
            },
        }
    },
    states: {
        positionY: 100
    },
    tree: `
        <node class='block'></node>
    `
});
```

This "inverted" functionality is very useful when creating layouts or UI-event triggered animations. Below is an example of a component that lays out nodes horizontally and animates the selected item on a click event.

```
FamousFramework.module('username:foo', {
    behaviors: {
        '.block' : {
            size: [100, 100],
            style: {
                'background-color' : 'black',
                'color': 'white'
            },
            'position-x': function($index) {
                return 100 + $index * 150;
            },
            'position-y' : function($index, currentIndex, positionY, animateY) {
                if ($index === currentIndex) {
                    return animateY;
                }
                else {
                    return positionY;
                }
            }
        }
    },
    events: {
        '.block' : {
            'click' : function($state, $index, $repeatPayload) {
                $state.set('currentIndex', $index);
                $state.set('animateY', 200, {duration: 300, curve: 'outExpo'})
                      .thenSet('animateY', 100, {duration: 300, curve: 'outBounce'});
            }
        }
    },
    states: {
        currentIndex: null,
        positionY: 100,
        animateY: 100
    },
    tree: `
        <node class='block'> <div>0</div> </node>
        <node class='block'> <div>1</div> </node>
        <node class='block'> <div>2</div> </node>
        <node class='block'> <div>3</div> </node>
    `
});
```

