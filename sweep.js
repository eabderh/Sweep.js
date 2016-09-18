// sweep.js

/*
 * @param {Object[]} config
 * @param {string} config[].elementID - sliding element that is moved by
 * 		adjusting css 'left' style
 * @param {string} config[].classNameBase
 * @param {string} config[].classNames - names of the classes to be applied ot
 * 		sliding elementID to make it lock into place
 * @param {number} config[].startIndex
 * @param {number} config[].count - same as length of classNames
 * @param {number} config[].angle - angle were a movement counts, used so
 * 		up/down movements don't register
 * @param {number} config[].dragLength - length to drag to be considerd a slide
 */
function Sweep(config) {
	/*
	 * different pointing devices and the corresponding event names
	 */
	var PointerOptions = {
		mouse: {
			events: {
				start: 	'mousedown',
				move: 	'mousemove',
				end: 	'mouseup'
				},
			eventProc: function (event) {
				return [event.pageX,
						event.pageY];
			}
		},
		touch: {
			events: {
				start: 	'touchstart',
				move: 	'touchmove',
				end: 	'touchend'
			},
			eventProc: function (event) {
				return [event.touches[0].pageX,
						event.touches[0].pageY];
			}
		},
		getPointer: function (touchEnabled) {
			return touchEnabled ? this.touch : this.mouse;
		}
	};
	/**
	 * quick collection of some tools needed
	 */
	var ElementUtils = {
		addClass: function (element, classAdded) {
			element.classList.add(classAdded);
			///element.className += ' ' + newClassName;
		},
		setElementLeftPX: function (element, left) {
			var leftString = left + 'px';
			element.style.left = leftString;
		},
		setElementLeftString: function (element, leftString) {
			element.style.left = leftString;
		},
		getComputedLeftPX: function (element) {
			var leftString = window
				.getComputedStyle(element, null)
				.getPropertyValue('left');
			return parseInt(leftString, 10);
		},
		getLeftString: function (element) {
			return element.style.left;
		}
	}
	/**
	 * vector module used in calcuating the vector of the users movement
	 */
	var VectorModule =  function () {
		var Vector = function () {
			this.head 			= [0,0];
			this.tail 			= [0,0];
		}
		Vector.prototype.init = function (headxy) {
			this.head = headxy;
			this.tail = headxy;
		}
		Vector.prototype.newHead = function (newxy) {
			this.head = newxy;
		}
		Vector.prototype.diff = function () {
			return [this.head[0] - this.tail[0],
					this.head[1] - this.tail[1]];
		}
		Vector.prototype.delta = function (d) {
			return [Math.abs(this.head[0] - this.tail[0]),
					Math.abs(this.head[1] - this.tail[1])];
		}
		Vector.prototype.angle = function () {
			delta = this.delta();
			return Math.atan2(delta[1], delta[0]);
		}
		Vector.prototype.length = function () {
			delta = this.delta();
			return Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
		}
		return Vector;
	}
	/**
	 * some utils specifically for the sweep.js functionality
	 */
	var utils = {
		setTransition: function () {
			slideElement.addEventListener('transitionend', this.unsetTransition);
			slideElement.style.transition = 'left .4s ease';
		},
		unsetTransition: function () {
			slideElement.removeEventListener(
				'transitionend',
				this.unsetTransition, false);
			slideElement.style.transition = null;
		},
		getLeftPX: function () {
			return ElementUtils.getComputedLeftPX(slideElement);
		},
		unsetLeft: function () {
			ElementUtils.setElementLeftString(slideElement, null)
		},
		setLeftPX: function (left) {
			ElementUtils.setElementLeftPX(slideElement, left);
		},
		setIndex: function (index) {
			slideElement.className = slideElement.className.replace(
				classNames[state.index],
				classNames[index]
			);
			state.index = index;
		},
		cleanTransition: function () {
			var leftString = ElementUtils.getLeftString(slideElement)
			this.unsetLeft();
			if ((leftString !== "") && (leftString !== "0px")) {
				this.setTransition();
			}
		},
		swipeDir: function (offset) {
			return Math.sign(offset);
		},
		getIndexOffset: function (offset) {
			return (- this.swipeDir(offset));
		},
		validIndex: function (index) {
			return ((0 <= index) && (index <= maxIndex));
		},
		processVector: function () {
			var offsetX = state.moveVector.diff()[0];
			var indexOffset = utils.getIndexOffset(offsetX);
			return {
				offset: offsetX,
				index: state.index + indexOffset
			};
		}
	}
	/*
	 * variables saved between the different calls to the callback functions
	 */
	var state = {
		dragAction 		: false,
		slideAction 	: false,
		slideStart 		: true,
		slideBase 		: 0,
		moveVector 		: {},
		index 			: 0,
		offsetX 		: 0
	};
	/*
	 * All callback functions called in movement events.
	 */
	var callback = {
		/*
		 * gets called when the movement is started, as in finger down or mouse
		 * button press
		 */
		start: function (event) {
			var xy = pointer.eventProc(event);
				// process event by calling a internal function to get the x/y
				// position of the user action on the screen
			state.moveVector.init(xy);
			state.dragAction 	= true;
			state.slideAction 	= false;
			state.slideStart 	= false;
		},
		/*
		 * called while user is moving finger/mouse even if there was no button
		 * press.
		 * called continuously unless finger/mouse is still.
		 */
		move: function (event) {
			// check if there is actual dragging movement, as in finger/mouse
			// button down and dragging across the sceen
			if (state.dragAction) {
				var moveVector = state.moveVector;
				var xy = pointer.eventProc(event);
					// process event by calling a internal function to get the
					// x/y position of the user action on the screen
				moveVector.newHead(xy);
				var length = moveVector.length();
				// check if the sliding element can be moved
				if (state.slideAction) {
					if (state.slideStart) {
						state.slideBase = utils.getLeftPX();
						state.slideStart = false;
					}
					var moveOutput = utils.processVector();
					// check if the sliding element should be moved according
					// to the direction of the users movement
					if (utils.validIndex(moveOutput.index)) {
						utils.setLeftPX(state.slideBase + moveOutput.offset);
					}
				}
				// check if the user has moved enough and in the right
				// direction to warrant sliding action
				else if (length < config.dragLength) {
					var angle = moveVector.angle();
					if (angle < (config.angle * (Math.PI / 180.0))) {
						state.slideAction = true;
						state.slideStart = true;
					}
				}
			}
		},
		/*
		 * called at end of movement, when user releases finger/mouse button
		 */
		end: function (event) {
			// check if there was draggin movement before release
			if (state.slideAction) {
				var moveVector = state.moveVector;
				var length = moveVector.length();
				var moveOutput = utils.processVector();
				// check if there was enough sideways movement by the user to
				// warrant changing the element shown in the viewport
				// if yes, set a new index
				if ((length > 100) && utils.validIndex(moveOutput.index)) {
					utils.setIndex(moveOutput.index);
					// change the classes of sliding element
				}
				utils.cleanTransition();
				// make a clean transition between sliding actions
			}
			state.dragAction = false;
		}
	}
	//startup
	// NOTE: uncomment below if touchEnabled variable is NOT global. Also
	// pass variable in config object.
	//var touchEnabled = config.touchEnabled;
	var slideElement = document.getElementById(config.elementID);

	var pointer = PointerOptions.getPointer(touchEnabled);
	var Vector = VectorModule();

	state.moveVector = new Vector();
	state.index = config.startIndex;

	var maxIndex = config.count - 1;

	var classNameBase = config.classNameBase;
	var classNames = config.classNames;
	//var matchClassName = new RegExp( + '|', 'g');
	ElementUtils.addClass(slideElement, classNameBase);
	ElementUtils.addClass(slideElement, classNames[state.index]);

	/*
	 * enabling function that sets up all the event listeners
	 */
	this.enable = function () {
		slideElement.addEventListener(
			pointer.events.start, callback.start, false
		);
		slideElement.addEventListener(
			pointer.events.move, callback.move, false
		);
		slideElement.addEventListener(
			pointer.events.end, callback.end, false
		);
	}
	/*
	 * disabling function that removes all the event listeners
	 */
	this.disable = function () {
		slideElement.removeEventListener(
			pointer.events.start, callback.start, false
		);
		slideElement.removeEventListener(
			pointer.events.move, callback.move, false
		);
		slideElement.removeEventListener(
			pointer.events.end, callback.end, false
		);
	}
	/*
	 * set certain index and smoothly transition to it
	 * makes the sliding element move the corresponding element into the
	 * viewport
	 */
	this.setIndexSmooth = function (index) {
		utils.setIndex(index);
		utils.setTransition();
	}
	/*
	 * increment index and smoothly transition to it
	 * makes the sliding element move the corresponding element into the
	 * viewport
	 * useful for adding buttons that can be manually pressed
	 */
	this.nextSmooth = function () {
		index = (state.index + 1) % config.count;
		utils.setIndex(index);
		utils.setTransition();
	}
}


// DEBUG
//var sweep = function () {
//}
//var d = new sweep();

