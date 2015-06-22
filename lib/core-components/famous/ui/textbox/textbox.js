/**
 * A textbox control based on the HTML input element.
 * Originally justinsmith:controls:textbox
 * 
 * TODO: the biggest issue with this component is that the 'input' HTML tag can't easily be duplicated in the framework.
 * TODO: Unlike a button, the amount of funcitonality is huge, so it's ideal to use the HTML input element.
 * TODO: HOWEVER, there are several issues with this approach as there is no direct access to the element
 * TODO: $DOMElement gets you part of the way, but any styles end up setting get applied to a container div.
 * TODO: The result is that i can't add certain functionality to the input element like the 'placeholder' attribute, nor can I clear the value.
 * TODO: I left the 'hint' event in, however to show my intention - the user should be able to set the hint and have
 * TODO: <input placeholder="some hint"> be the rendered element.
 */
FamousFramework.component('famous:ui:textbox', {

    behaviors: {

        '.input': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-z': 1,
            'size-proportional': [1, 0.5]
        }
    },

    events: {

        '.text-box': {

            /**
             * Trigger our change event when an input change event occurs.
             *
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher.
             * @param $event The change event.
             */
            'famous:events:change': function($state, $dispatcher, $event) {
                var value = $event.value;
                $dispatcher.trigger("value", value);
            },

            /**
             * Trigger our change event when an input keyup event occurs.
             *
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher.
             * @param $event The keyup event.
             */
            'keyup': function($state, $dispatcher, $event) {

                var value = $event.value;
                $dispatcher.trigger("value", value);
            }
        },

        '$public': {

            /**
             * Amount of time (in milliseconds) to delay triggering
             * a 'valueChanged' event for new input values.
             */
            'delay': '[[setter]]',

            /**
             * The text to display as placeholder (until user starts typing) in the text box.
             * (Not yet implemented)
             */
            'hint': '[[setter]]',

            /**
             * Called when the value input value has changed.
             * If 'delay' is set, the event will not be emitted
             * until the user stops typing and 'delay' milliseconds has passed.
             *
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher.
             * @param $event The event.
             * @param $payload The input value.
             */
            'value': function($state, $dispatcher, $event, $payload) {

                var value = $payload;

                //nothing to do if nothing's changed
                if(value == $state.get("value")) {
                    return;
                }

                //if a delay is set, wait until
                //the delay is up to set the value
                var delay = $state.get("delay");
                if(delay > 0) {

                    var timeout = $state.get("timeout");
                    if(timeout) {
                        clearTimeout(timeout);
                    }

                    timeout = setTimeout(function(){
                        $state.set("value", value);
                        $dispatcher.emit("value", value);
                    }, delay);

                    $state.set("timeout", timeout);
                }
                else {
                    $state.set("value", value);
                    $dispatcher.emit("value", value);
                }
            }
        }
    },

    states: {

        /**
         * The default hint (empty)
         */
        hint:'',

        /**
         * The default value (empty)
         */
        value:'',

        /**
         * The default delay (0 - any typing will trigger a 'value' event)
         */
        delay:0
    },

    tree: '<input class="text-box" type="text">'
});
