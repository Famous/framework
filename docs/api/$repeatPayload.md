# $repeatPayload

`$repeatPayload` is very similar to `$index`, however it only applies to elements that are created using the `$repeat` behavior. The value of `$repeatPayload` corresponds to the object that was used to intantiated a repeated component.

```
FamousFramework.module('username:foo', {
       behaviors: {
        '.block' : {
            $repeat: function() {
                var result = [];
                for (var i = 0; i < 4; i++) {
                    result.push({
                        content: `<div>${i}</div>`,
                        position: [i * 150, 100],
                        data: `Data for item ${i}`
                    });
                }
                return result;
            },
            position: function($index) {
                return [$index * 150, 100];
            },
            size: [100, 100],
            style: {
                'background-color' : 'black',
                'color': 'white'
            }
        }
    },
    events: {
        '.block' : {
            'click' : function($repeatPayload) {
                /*
                If the first item is clicked, $repeatPayload will be:
                { content: '<div>0</div>', position: [0, 100], data: 'Data for item 0'}
                 */
            }
        }
    },
    tree: `
        <node class='block'></node>
    `
});
```

Injecting `$repeatBehavior` into a behavior will "invert" the behavior in the same way as injecting `$index` (i.e., the behavior will run once for every repeated element).

If `$repeatBehavior` is injected into an event handler or behavior that targets a component that was not created via the `$repeat` behavior, the value of `$repeatBehavior` will be `{}`.

