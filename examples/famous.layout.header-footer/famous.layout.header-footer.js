
famous.module({
	name: "famous.layout.header-footer",
	behaviors: {
		"#header-container": {
			"famous.core.size": function(headerSize, direction){
				if(direction === 'VERTICAL'){
					return [undefined, headerSize];
				}else{
					[headerSize, undefined];
				}
			},
			"famous.transform.translate": [0,0,0],
			"famous.control-flow.yield": function(){
				//this returns a selector (alternatively, returns a filter function of (DOM Elements -> DOM Elements))
				//that describes which nodes from the PARENT to pass through into this element in this module.
				return "#header"
			}
		},
		"#content-container": {
			"famous.core.size": function(headerSize, footerSize, direction, $size){
				var magnitude = direction === 'VERTICAL' ? $size[1] : $size[0];
				var contentSize = magnitude - (headerSize + footerSize);
				return direction === 'VERTICAL' ? [undefined, contentSize] : [contentSize, undefined];
			},
			"famous.transform.translate": function(headerSize){
				return direction === 'VERTICAL' ? [0, headerSize, 0] : [headerSize, 0, 0];
			},
			"famous.control-flow.yield": "#content"
		},
		"#footer-container": {
			"famous.core.size": function(footerSize){
				return direction === 'VERTICAL' ? [undefined, footerSize] : [footerSize, undefined];
			},
			"famous.transform.origin": function(direction){
				return direction === 'VERTICAL' ? [0, 1, 0] : [1, 0, 0]
			}
			"famous.control-flow.yield": "#footer"
		}
	},
	events: {
		//"behavior."-prefixed events are "special" handlers that define the public-facing
		//API for behaviors.  For example, the declaration of "behavior.header-size" here
		//means that a <famous.layout.header-footer> element can have its "header-size"
		//set via a selector + functional behavior.  The "special" piece is that the library handles
		//knowing when to reevaluate those behaviors and automatically invokes the behavior
		//function, then fires a "behavior.header-size" event with the result of that function
		//as a member of the event args.
		"behavior.header-size": function(args, state){
			state.set('headerSize', args.$payload);
		},
		"behavior.content-size": function(args, state){
			state.set('contentSize', args.$payload);
		},
		"behavior.footer-size": function(args, state){
			state.set('footerSize', args.$payload);
		},
		"behavior.direction": function(args, state){
			var direction = args.$payload;
			if(direction !== "VERTICAL" && direction !== "HORIZONTAL"){
				throw new Error("The only acceptable values for a HeaderFooterLayout's Direction are 'VERTICAL' and 'HORIZONTAL'");
			}
			state.set('direction', direction);
		}
	},
	states: {
		//$size is maintained automatically
		headerSize: 0,
		footerSize: 0,
		direction: 'VERTICAL'
	},
	template: "famous.layout.header-footer.template.html"
});