This is a stab at figuring out what happens...

## Where the rubber meets the road!

So, it's turtles all the way down ... until it's not.

If core functionality like controlling size via behaviors is implemented at the BEST component level, then all BEST components ultimately need some predefined way of interfacing with the "metal", i.e., getting access to the underlying framework and creating effects there.

**Who would drive on a metal road, and why are these turtles made of rubber?**

Essentially, BEST components need to be able to do three things:

* Globally expose behaviors that can be used by all other BEST components
* Implement the result of those behaviors by talking to the rendering engine directly
* Handing some portion of that control to the consumers of the exposed behavior

I think we can do this via a combination of namespacing and dependency injection.

### Globally exporting a behavior / event

Your BEST component can have a `globals` property, inside which you put behaviors that you want to expose to all other BEST components in the ecosystem. Other BEST components can refer to these by name.

    // A component called 'babadook.dook'
    BEST.component({
      globals: {
        behaviors: {
          dooook: function() {
            // Do something scary
          }
        }
      }
    });

    // Some other component
    BEST.component({
      behaviors: {
        'babadook.dook.dooook': function() {
          // Return some value
        }
      }
    });

But for this to be useful, that "base" component's global export needs to be able to access the underlying rendering engine, and also handle the result of the function that implements it. I propose that we incorporate two special dependency-injectable parameters:

    * `$metal` -- access to the underlying API -- this is an instance of a `View`
    * `$output` -- the output of the function that uses the "base" function

Here's an example showing how we might accomplish `famous.context.size`.

    // A component called 'famous.context'
    BEST.component({
      globals: {
        behaviors: {
          size: function($metal, $output) {
            $metal.getContext().setSize($output);
          }
        }
      }
    });

    // Some other component which uses a behavior exported by the base one
    BEST.component({
      behaviors: {
        'famous.context.size': function(state) {
          return [100, 100];
        }
      }
    });
