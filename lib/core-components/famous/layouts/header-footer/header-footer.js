FamousFramework.module('famous:layouts:header-footer', {
    tree: 'header-footer.html',
    behaviors: {
        '#header' : {
            /*
            $yield is a special type of "control-flow behavior". It is at the core of
            what enables components in the Famous Framework to be composable. Setting $yield
            on a component tells the system that it is ok for a parent component to inject
            components inside of a child component. Values for $yield are either a boolean,
            which signifies that the parent component can add any component into the child,
            or a String, which signifies that the parent component can add components into
            the child if those components match the CSS selector given by String.

            In this example, the parent can include the header-footer component and inject
            its own content into the header/body/footer nodes like so:
            header-footer
                a#header
                b#body
                c#footer
            
            Component `a` will end up being slotted into the 'header' nodes, and as such will
            be sized according to the behavior specified bellow.
            */
            '$yield' : '#header',
            'size-absolute-y' : '[[identity|headerHeight]]'
        },
        '#body' : {
            '$yield' : '#body',
            'position' : function(headerHeight) {
                return [0, headerHeight]
            },
            'size-differential-y' : function(headerHeight, footerHeight) {
                return -headerHeight - footerHeight;
            }
        },
        '#footer' : {
            '$yield' : '#footer',
            'size-absolute-y' : function(footerHeight) {
                return footerHeight;
            },
            'position-y': function(footerHeight) {
                return -footerHeight;
            },
            align: [0, 1],
        }
    },
    events: {
        '$public' : {
            'header-height' : '[[setter|camel]]',
            'footer-height' : '[[setter|camel]]'
        }
    },
    states: {
        'headerHeight' : 100,
        'footerHeight' : 100
    }
});
