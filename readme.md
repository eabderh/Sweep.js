
# Sweep.js

Sweep.js is a quick utility for allowing sideways swiping when viewing a
website on a mobile device.

Please check out the [sweep.webm](http://www.bytekite.io/static/sweep.webm)
demo video which shows a quick demo of Sweep.js in action on a smartphone. To try
out Seep.js yourself, just view my website,
[bytekite.io](http://www.bytekite.io), on a smartphone and swipe the screen
horizontally.

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

As a note, the website moves sideways by the adjustment of the css "left" value
(both in *px* and *vw* values) on the main sliding element. I personally use it
to move a container sliding element with a static navigation element and a
element with content back and forth across the viewport. The user can then
choose between seeing the navigation panel and the content with a single swipe.

While the user moves the sliding element the css "left" pixel value is
adjusted. As soon as the user lets go, a certain element class is set on the
sliding element and this activates certain css style rules, such as moving the
sliding element 100vw to the left or right. More info can be found under
**Sample Usage**.

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

### Sample Usage

#####Javascript usage:

Further explanation in the source.
```javascript
var sweep = new Sweep({
  elementID:      'platform', // ID of element that does the sliding
  classNameBase:  'sweep',
  classNames:     ['sweep_fixedpane', 'sweep_contentpane'], // names of CSS rules shown below
  startIndex:     0,
  count:          2,
  angle:          20,
  dragLength:     20
});
```

#####Accompanying CSS usage:

The *platform* element contains both a *fixedpane* element and a *contentpane*
element that are next to each other and each 100vw in width.

Show the *fixedpane* element (navigation).
```css
#platform.sweep_fixedpane {
  left: 0;
}
```


Show the *contentpane* element (content) by shifting the *platform* element a
full screens width left.
```css
#platform.sweep_contentpane {
  left: -100vw;
}
```

### Bugs

I haven't had much of an issue with the utility itself but there are some bugs
with the setup I used on my website. Some phones, such as apple, do not like
the way I move around static/fixed elements so I've had to hack a bit to make
it work. However, the utility itself seems to be very stable with no issues.


### Shout-out

This project was mainly inspired by jakestfu's
[Snap.js](https://github.com/jakiestfu/Snap.js/) along with many others.


