
# Sweep.js

Sweep.js is a quick utility for allowing sideways swiping when viewing a
website on a mobile device.

Please check out the video - *sweep.webm* - in the repository. It shows a quick
demo of Sweep.js in action on my website ([*bytekite.io*](https://www.bytekite.io)).

### Description

Sweep.js is written in pure javascript and is supported on all devices that
support javascript touch/mouse events.

Sweep.js uses these touch/mouse events in event listeners to get the
coordinates of where the pointing device (finger or mouse) is. Using this
information, it can be seen what kind of motion the user is making on the
website. If the motion satisfies the conditions of a sideways swipe, the whole
website layout is shifted in accordance to the users motion. Once the user
discontinues the motion, the website layout is adjusted to the desired sideways
position depending on how far the user has moved the website layout sideways.

As a note, the website moves sideways by the adjusting of the css "left" pixel
amount on any element. I personally use it to move a container element with a
static navigation element and a element with content back and forth across the
viewport. The user can then choose between seeing the navigation panel and the
content with a single swipe.

### Advantages

The main advantage of Seep.js is how smoothly it operates. It's not a large and
bloated piece of software and it has certain optimizations that make it run
almost as smooth as a native application instead of a browser application.

Apart from the Sweep.js utility itself, the kind of navigation it allows on a
website is much easier to use than most other kinds of navigation
bars, lists, etc. The sideways motion is especially intuitive for smartphone
users and keeps the small screen free of any blocking navigation buttons. As
shown in the demo, I personally still keep the "burger" navigation button
simply because new users are more adverse to a blank screen.

### Credit

This project was mainly inspired by jakestfu's
[Snap.js](https://github.com/jakiestfu/Snap.js/) along with many others.


