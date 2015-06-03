/*---------------------------------------------------------------------------------*/
// Functions defined outside of the BEST.module can be accessed within the module
// as helper functions since they share the same overall scope.
/*---------------------------------------------------------------------------------*/
var colorSteps = 36;
var colors = [ [151, 131, 242], [47, 189, 232] ];

function createColorStep(step) {
  step -= (step >= colorSteps) ? colorSteps : 0;
  var r = colors[0][0] - Math.round(((colors[0][0] - colors[1][0]) / colorSteps) * step);
  var g = colors[0][1] - Math.round(((colors[0][1] - colors[1][1]) / colorSteps) * step);
  var b = colors[0][2] - Math.round(((colors[0][2] - colors[1][2]) / colorSteps) * step);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
/*---------------------------------------------------------------------------------*/

BEST.module('famous:demos:layouts:basic-scroll-view', {
    behaviors: {
        '#container' : {
            'overflow' : 'scroll' // Scrollview needs to hide items outside its clipping window
        },
        '#item' : {
            'height' : '[[identity|itemHeight]]',

            /*
            The '$repeat' behavior is a special "control-flow" behavior. It will create/delete
            components based on the payload that it recieves. The payload is expects is an array.
            - The length of the array corresponds to the number of items that should be present after the behavior
            is processed.
            - The value of each entry in the array is an object whose key is the name of a public event on the
            repeated component and value is the $payload that will be sent to that public event.
            - The component that is dynamically created is a clone of the component that matches the CSS selector
            (e.g., '#item') of the behavior.
             */
            '$repeat' : function(count, itemHeight) {
                var result = [];
                var backgroundColor
                for (var i = 0; i < count; i++) {
                    result.push({
                        content: '<div class="scroll-view-item"> Item ' + (i + 1) + '</div>',
                        position: [0, i * itemHeight],
                        style: {
                            'background-color' : createColorStep(i)
                        }

                    });
                }
                return result;
            },
            'style' : '[[identity|itemStyle]]'
        }
    },
    events: {
        '$public' : {
            'count': '[[setter]]',
            'item-height': '[[setter|camel]]',
            'content': '[[setter]]',
            'item-style' : '[[setter|camel]]'
        }
    },
    states: {
        count: 0,
        itemHeight: 100,
        content: [],
        itemStyle : {
            'border' : '1px solid black'
        }
    },
    tree: 'basic-scroll-view.html',
})
.config({
    imports: {
        'famous:demos:layouts' : ['scroll-view-item']
    }
});
