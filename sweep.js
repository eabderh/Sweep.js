// sweep.js



function Sweep(config) {
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
	var state = {
		dragAction 		: false,
		slideAction 	: false,
		slideStart 		: true,
		slideBase 		: 0,
		moveVector 		: {},
		index 			: 0,
		offsetX 		: 0
	};
	var callback = {
		start: function (event) {
			var xy = pointer.eventProc(event);
			state.moveVector.init(xy);
			state.dragAction 		= true;
			state.slideAction 		= false;
			state.slideStart 		= false;
		},
		move: function (event) {
			if (state.dragAction) {
				var moveVector = state.moveVector;
				var xy = pointer.eventProc(event);
				moveVector.newHead(xy);
				var length = moveVector.length();
				if (state.slideAction) {
					if (state.slideStart) {
						state.slideBase = utils.getLeftPX();
						state.slideStart = false;
					}
					var moveOutput = utils.processVector();
					if (utils.validIndex(moveOutput.index)) {
						utils.setLeftPX(state.slideBase + moveOutput.offset);
					}
				}
				else if (length < config.dragLength) {
					var angle = moveVector.angle();
					if (angle < (config.angle * (Math.PI / 180.0))) {
						state.slideAction = true;
						state.slideStart = true;
					}
				}
			}
		},
		end: function (event) {
			if (state.slideAction) {
				var moveVector = state.moveVector;
				var length = moveVector.length();
				var moveOutput = utils.processVector();
				if ((length > 100) && utils.validIndex(moveOutput.index)) {
					utils.setIndex(moveOutput.index);
				}
				utils.cleanTransition();
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
	this.setIndexSmooth = function (index) {
		utils.setIndex(index);
		utils.setTransition();
	}
	this.nextSmooth = function () {
		index = (state.index + 1) % config.count;
		utils.setIndex(index);
		utils.setTransition();
	}
}

//(function (window, document) {
//})(window, document)

// DEBUG
//var sweep = function () {
//}
//var d = new sweep();

