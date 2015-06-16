---
layout: default
title: Animations
---

Since our behaviors listen to states, we will use events to change these values and animate our scene. 

## Movin' on up

Let's create a loop to increment the vertical position of our image nodes. As we mentioned previously, we will need to decrement the Z index since our coordinate system is flipped an images are positively positioned off the screen. 

Before we go into the details, add the following code to your events object: 

	events: {
	        '$lifecycle': {
	            'post-load': function($dispatcher, $state){
	                      var zPosArray = $state.get('positionZ')
	                console.log(zPosArray, zPosArray.length , 'pre')
	                $dispatcher.trigger('looper')
	                var zPosArray = $state.get('positionZ')
	            }
	        },
	        '.gallery-item':{
	           'looper': function($state, $dispatcher){
	                var zPosArray = $state.get('positionZ')
	                for (var i = 0; i < zPosArray.length; i++) {
	                    var oldValue = $state.get(['positionZ',i]);
	                    $state.set(['positionZ', i], oldValue - 1)
	                };
	                setTimeout(function(){    
	                        $dispatcher.trigger('looper')
	                }, 16)
	            }
	        }

	    }
	    
The `$lifecycle` gives us access to certain program events that deal with the lifecycle of the scene. More specifically, we will use the `post-load` event to trigger the `looper` function right after the component is loaded. When the `looper` function gets called it will decrement our Z value and then call on itself creating a loop that update on every frame.

In the code above, notice how we dependency-inject two important objects into our functions: `$dispatcher` and `$state`. Let's go over them below:
   
  - `$state` let's us access the and modify the values stored in our state object.
  - `$dispatcher` let's us broadcast events

We include a `setTimeout()` within the looper to continually broadcast a message to itself via the `$dispatcher`
