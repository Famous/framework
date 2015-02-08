famous.declareEvents({
  customClickEvent: function(args, moduleState, childState){ //childState is the listitem module's state bag, since that's the element to which the handler is attached
    //note that this is defined in the template, on the zackbrown.totolist.listitem tag.
    var index = childState.get('index');

    //in eventHandlers, both moduleState and childState can be
    //both SET and GET

    moduleState.set('selectedIndex', index);

  },
  otherEventName: function(args){
    //handler
    //should we switch over target?  and break out
    //behavior accordingly?  and/or should we be able
    //to specify events more granularly, perhaps
    //in the template?

    //yes, specify in the template.  The state bag
    //exposed by the module to which the event is bound
    //will be passed as an argument as well as the standard
    //event args.  This supports, e.g. getting the
    //index of the clicked item in a repeated list
    //(since it can be exposed by its state bag.)
  };
});