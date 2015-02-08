//does a module ('zackbrown.todolist') need to be declared here?
//or can module association be handled
//implicitly based on the context under which
//this is loaded?

famous.declareBehaviors(
  {
    //these are behaviorHandler declarations, sort of like directive
    //declarations in AngularJS
    handlers: {
      someCustomBehavior: function(element, elementBag, payloadFn){
        //the role of this function is essentially to manipulate
        //the element based on the returned value of the invoked
        //payloadFn.  Any sort of stateful values here can be manipulated
        //using the elementBag (e.g. for a persistent vector for
        //transform values so that we don't thrash the GC.)  The elementBag
        //is associated with the element at the library level by
        //uniquely ID'ing every element 
      }
    },

    //these are the standard behavior declarations
    behaviors: {
      "#repeat-me": {
        //we can do DI below without worrying about minification BECAUSE
        //we can build the dependency map at upload time:  again,
        //we do not support the upload of minified code.  We will minify
        //it before deployment for the end-user, but we will have already
        //built a map of behaviors -> dependencies at upload-time.
        "famous.controlflow.repeat": function(listItems){
          //assume listItems is [1,2,3,4,5];
          var returnData = listItems.map(function(d, i){
            return {
              id: d,
              text: d //this will be evented to
                      //the child via setState({'text': d});
                      //(this is an implementation detail of the famous.controlflow.repeat behavior handler.
            }
          })

          return returnData;
          // ^ array of state injections which will be
          //evented to the child module.  Any time
          //this function is re-evaluated, these
          //states will be re-evented to children.

          //the number of elements here determines how
          //many instances of "zackbrown.todolist.listitem" are
          //instantiated.  The logic for handling this spinning
          //up and down exists in the famous.controlflow.repeat
          //declaration.

          //destruction/creation is also handled by
          //famous.controlflow.repeat—by convention, a
          //unique id ('id' field) tells it how to keep
          //track of a distinct entity, i.e. to move
          //an item instead of creating/destroying one
          //(similar to trackby in angularjs)

          //the child can subscribe to these events
          //however it would like, e.g. by allowing
          //the events to overwrite state every time
          //that the event is triggered, or
          //only setting at constructor time.
        },

      },
      "#main-layout": {
        //when values are constant, simply return them, not
        //wrapped in a function.
        "famous.transform.size": [undefined, undefined],

        "headerSize": function(){
          //note that this is actually
          //famous.layout.headerfooter.headerSize,
          //but since famous.layout.headerfooter is imported below,
          //this shorthand can be used.  A static analysis
          //step can be used to determine if there are conflicting
          //"headerSize" definitions, similar to C#
          return [undefined, state.get('headerHeight')];
        },
        "footerSize": function(){
          return [undefined, state.get('footerHeight')];
        }
      }
    },

    //these are namespace imports, similar to `using`
    //statements in C#.  These make the code terser above,
    //e.g. for setting headerSize instead of famous.layout.headerfooter.headerSize
    imports: [
      //"famous.transform", //would allow "famous.transform.size" to be expressed as "size"
      "famous.layout.headerfooter"
    ]
  }
);