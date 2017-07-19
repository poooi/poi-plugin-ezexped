This document describes auto-switch mechanism.

Auto-switch is an attempt of trying to switch between fleets automatically
depending on user in-game actions, this minimizes user interaction while
keeps the most related info on plugin panel.

Note that for the rest part of this document, auto-switch always refers to
the mechanism that allows switching between fleets of EZ Exped
depending on user's in-game actions.

Not to be confused with the mechanism of poi's "switching between plugins automatically".

# Current Behavior & Implementation


  - When changing fleet composition or equipments, auto-switch tries to focus
    on fleet that we are working on.

    This is handled by `store/auto-switch.es`: poi dispatchs network communication
    as redux actions. If any of these actions is related to a fleet member change
    or a change of equipments of fleet members, an asynchronous action is dispatched
    for switching to that fleet in EZ Exped.

    Note: There is one exception however: depriving an equipment
    from a fleet member to a non-fleet member does not trigger
    the auto-switch mechanism.

  - When user switch to "expedition" screen in game, auto-switch mechanism
    picks the first available fleet and make EZ Exped switch to that fleet.

    This is also handled by `store/auto-switch.es` as switching to
    expedition screen sends a network packet.

  - After a fleet is send, auto-switch further checks whether there are more fleets to
    send and switch focus to it.

    This is handled by `observer/next-fleet.es`. An observer can observe changes
    of a redux store and perform actions accordingly.

    The current implementation observes the array of available fleets
    (by "available fleet" I mean fleets that can be sent to expeditions,
    so this excludes main fleets), and always switches to the first available one.

    If no fleet is availble, we may have sent all fleets out (except of course
    main fleets), in this case we will switch focus to main fleet if
    user wishes to show main fleets in EZ Exped (i.e. "Hide main fleet" setting is `false`).

    I admit there is not really a very good reason for doing this,
    but if all fleets are sent, we only have main fleet to play with,
    so let's focus on it.

  - When a fleet returns, auto-switch mechanism will switch focus to that fleet.

    (TODO) this is now poorly handled: despite that `observer/next-fleet.es`
    does a good job when we are sending fleets out, it doesn't work well
    when a fleet returns. This is because first available fleet is not
    always the returning fleet. For this reason, we'll be:

    - monitoring network packets to figure out the returning fleet and switch to it
    - modify the observer so it only cares about sending fleets out, does nothing when
      fleet returns.
