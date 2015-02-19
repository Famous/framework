Here's an example of a self-contained component -- one that doesn't rely on any globally namespaced behaviors. This illustrates how all the moving pieces could fit together, with an example of how components can interface with the underlying platform.

As I said in my commit comment, I feel like for clarity we need to separate out the notion of a "behavior" from a "behavior handler", which I've renamed to "renderer". Relatedly, for defining events at the environment level, we have something called a "valve".

That is, a _renderer_'s job is to actually do something at the platform level (side effects) with the result (payload) of the behavior it is mapped to.

And a _valve_'s job is to set up listeners to 'native' events; valves are referred to by name in the template.

See [sketch-01.png](sketch-01.png) for some add'l context.

    BEST.component({
      assets: {
        'frowny.jpg': './assets/images/frowny.jpg'
      },

      template: `
        <mister.busy click='click'>
          <img src="${frowny.jpg}">
        </mister.busy>
      `,

      valves: {
        click: function($environment, $registrants) {
          $registrants.each(function(registrant) {
            $environment.addEventListener('click', function(event) {
              registrant(event);
            });
          });
        }
      },

      states: {
        doorbell: false
      },

      events: {
        click: function($state) {
          $state.set('doorbell', true);
        }
      },

      behaviors: {
        size: function(doorbell, $state) {
          return [123, 456];
        }
      },

      renderers: {
        size: function($metal, $payload) {
          $metal.getContext().setSize($payload[0], $payload[1]);
        }
      }
    });
