//the state bag is really only stored in memory.

//this list of states and types is essentially a schema, mostly
//for use by the authoring tool.  Arbitrary states can be set/get
//from the state bag at runtime, but this declaration allows
//authoring controls to be exposed.  There may be additional (powerful)
//things we can do with static analysis based on these annotations.

//any numerical state in the state bag can backed by a Transitionable. Any time
//that a state.set is called, a transition can be passed to make
//the state tween.  This get/set interface gives the state bag total
//control over notifying subscribers of changes.

//note that type annotations are something we can iterate on; the simplest version
//of this would be a json blob that is strictly declarations of
//default values.  We could add annotations optionally and later on.

////with annotations:
// {
//   listItems: {
//     type: 'Array<Object>',
//     defaultValue: []
//   },
//   headerTransitionDuration: {
//     type: "Integer",
//     defaultValue: 2000
//   }
// }

//without annotations
{
  listItems: [],
  headerTransitionDuration: 2000
}