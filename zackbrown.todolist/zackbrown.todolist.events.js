famous.declareEvents({
  customClickEvent: function(args, moduleState, listItemState){ //listItemState is the child module's state bag
    //note that this is defined in the template, on the zackbrown.totolist.listitem tag.
    var index = listItemState.get('index');
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