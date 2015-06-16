---
layout: default
title: Adding states
---

You can think of states as the "global variables" or "settings" of a module. When a behavior function observes a specific state value, it will be called whenever that value changes. Any dynamic value or global setting should be placed here.

Let's set up the values for our gallery before adding them to the behaviors. Replace the empty state object in you Framework component with the object below.

	 states: {
	      rotationValue: 0,   // value to rotate all of our images  
	      srcs: [],    // this will store the images srcs
	      contextSize: 500,   // define the gallery's size here
	      positionZ:[]        // store our images' Z positions here
	    } 


Now all of the values above are accessible to our behaviors by simply passing them as arguments to the behavior functions. 

 Add the code below to your behaviors and read through the inline comments. Pay attention to where and how we include the state values from above.

	behaviors: {
	        '#rotator-node': {
	            'size': function(contextSize){
	                return [contextSize, contextSize]
	            },         
	            'align': [0.5,0.5],          
	            'mount-point':[0.5,0.5],     
	            'style': {
	                'background': 'red'
	            },
	            'rotation': function(rotationValue){
	                //rotate backwards
	                return [-Math.PI/2.1, 0, rotationValue] 
	            }
	        },
	        '.gallery-item':{
	            'size': [100,100],  
	            'style':{
	                'background-color': 'blue',
	                'border':'2px solid black'
	            },
	            '$repeat':function(){
	                return [1,2,3,4]   //repeat over array
	            },
	            'position-x': function($index, contextSize){ 
	                return Math.random()* contextSize
	            },
	            'position-y':function($index, contextSize){ 
	                return Math.random()* contextSize
	            },
	            'position-z': function($index, positionZ){ 
	                return positionZ
	            },
	            'rotation': [Math.PI/2,0,0] //rotate forward
	        }
	    } 

If you save you should see the new rotated scene. Let's walk through  how the code above affects the output on the screen.

## Understanding the rotation

Famous give you access to a 3D coordinate system: X axis goes left to right, Y up and down and Z forward and back. Let's break down how we will leverage this system to spin all of our gallery images in unison. 

![rotation](rotation.png)

For our animation, we want to rotate our images as if they were dangling from a ceiling fan. In order to achieve this, we will rotate the main  `#rotator-node`  backwards on its X axis by 90 degrees ( -&pi;/2 in radians) and then use the Z axis to spin all of the `.gallery-item` images. Additionally, we need to rotate each of them forwards by 90 degrees in order for our `.gallery-item` nodes to be visible.

_Since DOM elements are flat, they become invisible when they are rotated perpendicular to the screen. Note how we didn't quite rotate our `#rotator-node` node above by a full 90 degrees just yet so it would be visible in this example._ 

<span class="cta">
[Up next: Setting images &raquo;](./setting-images.md)
</span>
