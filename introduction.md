# Introduction

> BEST
>
> Behavior - Event - State - Tree
>
> An architecture and a framework
> for building consistent, modular,
> and extensible applications.

This guide is an introduction to the BEST architecture and framework, intended for intermediate-to-advanced developers. If you're interested in the high-level concepts and principles, see [In Theory](#in-theory). If you want to dive into actual code, skip down to [In Practice](#in-practice).

- - - -

## Overview

BEST is an architectural pattern developed at [Famous](http://famous.org) for building composable applications. The acronym stands for _behavior_ _event_ _state_ _tree_, for the main ingredients of modules that have both stateful and functional characteristics.

BEST is more than a handful of recommendations and priciples, however. It's also an open-source development platform that you can begin using today. Developed to work hand-in-hand with the Famous rendering engine, Famous studio editing tools, and Famous cloud services, it's ideal for modern UI development.

- - - -

## In theory

User interfaces are [state machines](http://en.wikipedia.org/wiki/Finite-state_machine#Example:_a_turnstile). Visual elements depict the current state; user interactions occur, prompting the elements to transition to new states; and so on. In one sense, BEST is simply a nomenclature for this flow.

### Structure and data flow

Data in BEST modules flows in one direction. User actions and programmatic events trigger event functions, which mutate the module's internal state. Changed state values are piped to behavior functions, which return values of their own. The behaviors values (which can represent style, content, or animation characteristics) are applied to nodes in the scene graph.

#### Behaviors

Behaviors are _pure functions triggered by changes in state_. They return values that describe how visual elements should reflect the newly established state. For example, the following behavior function responds to changes in `clickCount`, reflecting a new `position` back to a `view` element in its scene:

    view: {
        position: function(clickCount) {
            return Math.sin(clickCount / 1000);
        }
    }

#### Events

Events are functions that respond to user interactions and other phenomena. Their job is to _mutate state values_ that are managed by the module to which they belong. (How exactly the state mutation occurs should be considered an implementation detail of the function.) In this example, a `click` input event on a `surface` element has the effect of incrementing the state value `clickCount`:

    surface: {
        click: function($state) {
            $state.incr('clickCount');
        }
    }

#### States

States are the _arbitrary (and serializable) values_ encapsulated by a module. These values can describe the module's current state at any time. States must be isolated and cannot be shared between modules; only a module's event functions are permitted write-access to states. The default value for all of a module's states can be given as a simple object:

    { clickCount: 0 }

#### Trees

Trees are _declarative representations of the [scene graph](http://en.wikipedia.org/wiki/Scene_graph)_, which describes the structure of an application's visual elements. Each module has only one tree. The tree can be represented by any language that can adequately describe a [tree structure](http://en.wikipedia.org/wiki/Tree_%28graph_theory%29), for example, XML:

    <view>
        <surface></surface>
    </view>

### Ancillary patterns

#### Relational joins

To keep module code as concise and declarative as possible, in implementation of the BEST architecture should make use of a [relational join](http://en.wikipedia.org/wiki/Relational_algebra#Joins_and_join-like_operators) system that can apply behaviors to any subset of a module's visual elements. Consider this snippet, which expresses that "the `position` return value should apply to all `view` elements":

    // behavior
    view: {
        position: function(clickCount) {
            return 200;
        }
    }
    // tree
    <view>
        <view></view>
    </view>
    <other></other>

#### Dependency injection

A robust [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) system allows the intent of a module's behaviors to be communicated clearly. The ideal implementation of the BEST architecture will perform dependency injection transparently, for both behavior and event functions. Consider the following example, which expresses that "the view's position is a function of the tally":

    // behavior
    view: {
        position: function(tally) {
            return tally / 123;
        }
    }

### Benefits of the architecture

#### Isolated statefulness

Even simple interfaces can depend on a lot of state manipulation. Add user interactions, input fields, and remote data-loading to the mix, and statefulness can balloon; scattered state can be particularly difficult to debug. With BEST, every module's state is entirely encapsulated, and can only be mutated in one place: event functions. This enclosure makes it much more obvious where and when state has changed, and what the precise effects of each change are.

#### Strict messaging interface

Since state in BEST cannot be shared between modules, event functions become the only conduit for one module to affect the internal state of another. BEST strictly enforces the important idea of [message passing](http://en.wikipedia.org/wiki/Object-oriented_programming#Dynamic_dispatch.2Fmessage_passing) from object-oriented programming: Developers must think carefully about the interface they want their module to expose, and it should be the responsibility of the module, not external code, to decide how to change.

#### Declarative composition

Because BEST is an architecture for scene-graph applications (for example, [Famous](http://famous.org)), and since every BEST module's scene graph is described by a declarative tree, composing and extending scenes is as easy as copying and pasting a line of code. Consider this snippet, in which a developer has placed a carousel, a video, and a accordion list into three-column layout. Any of these components could be trivially replaced by another one.

    <layout-3-col>
        <col> <carousel> ... </carousel> </col>
        <col> <video> ... </video> </col>
        <col> <accordion> ... </accordion> </col>
    </layout-3-col>

#### Pure effects

Behaviors functions are pure functions: They may have no observable side-effects, and they must always return the same result for the same argument values. The upshot is that, for any given snapshot of the state values, the rendered scene will always look precisely the same. In applications that manage time, such as [Famous](http://famous.org), and those that incorporate reproducible [randomness](http://en.wikipedia.org/wiki/Pseudorandom_number_generator), frame-by-frame replayability becomes possible.

- - - -

## In practice

Coming soon!

- - - -

## Authors

Matthew Trost <matthew@famo.us>

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt.
