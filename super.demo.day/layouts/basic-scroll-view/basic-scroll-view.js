var colorSteps = 36;
var colors = [ [151, 131, 242], [47, 189, 232] ];

function createColorStep(step) {
  step -= (step >= colorSteps) ? colorSteps : 0;
  var r = colors[0][0] - Math.round(((colors[0][0] - colors[1][0]) / colorSteps) * step);
  var g = colors[0][1] - Math.round(((colors[0][1] - colors[1][1]) / colorSteps) * step);
  var b = colors[0][2] - Math.round(((colors[0][2] - colors[1][2]) / colorSteps) * step);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

BEST.module('super.demo.day:layouts:basic-scroll-view', 'HEAD', {
    behaviors: {
        '#container' : {
            'overflow' : 'scroll'
        },
        '#item' : {
            'height' : function(itemHeight) {
                return itemHeight;
            },
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
                createColorStep();
                return result;
            },
            'style' : function(itemStyle) {
                return itemStyle;
            }
        }
    },
    events: {
        '$public' : {
            'count': 'setter',
            'item-height': 'setter|camel',
            'content': 'setter',
            'item-style' : 'setter|camel'
        },
        '#item' : {
            'item-click' : function($dispatcher, $state, $payload) {}
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
        'super.demo.day:layouts' : ['scroll-view-item']
    }
});
