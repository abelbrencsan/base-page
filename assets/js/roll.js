/**
 * Roll
 * This class is designed to create controls for rolls where scroll-driven animations are not supported.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Roll {

	/**
	 * Represents the wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents the viewport element in which the items roll.
	 * 
	 * @type {HTMLElement}
	 */
	viewport;

	/**
	 * Represents a collection of nodes inside the viewport.
	 * 
	 * @type {NodeList}
	 */
	items;

	/**
	 * Represents a button that scrolls the roll to left.
	 * 
	 * @type {HTMLButtonElement}
	 */
	prevTrigger;

	/**
	 * Represents a button that scrolls the roll to right.
	 * 
	 * @type {HTMLButtonElement}
	 */
	nextTrigger;

	/**
	 * Callback function that is called after the roll has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the roll has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a roll.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLElement} options.viewport
	 * @param {NodeList} options.items
	 * @param {HTMLButtonElement} options.prevTrigger
	 * @param {HTMLButtonElement} options.nextTrigger
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Roll}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Roll \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.viewport instanceof HTMLElement)) {
			throw "Roll \"viewport\" must be an `HTMLElement`";
		}
		if (!(options.items instanceof NodeList)) {
			throw "Roll \"items\" must be an `NodeList`";
		}
		if (!(options.prevTrigger instanceof HTMLButtonElement)) {
			throw "Roll \"prevTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.nextTrigger instanceof HTMLButtonElement)) {
			throw "Roll \"nextTrigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the roll
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Scrolls the roll back.
	 * If scrolling backward is not possible, it loops back to the last item.
	 * 
	 * @returns {void}
	 */
	scrollBack() {
		let maxScrollLeft = this.#getViewportMaxScrollLeft();
		let scrollOffset = this.#getScrollOffset() * -1;
		if (this.viewport.scrollLeft == 0) {
			scrollOffset = maxScrollLeft;
		}
		this.viewport.scrollBy({
			left: scrollOffset,
			behavior: "smooth",
		});
	}

	/**
	 * Scrolls the roll forward.
	 * If scrolling forward is not possible, it loops back to the first item.
	 * 
	 * @returns {void}
	 */
	scrollForward() {
		let maxScrollLeft = this.#getViewportMaxScrollLeft();
		let scrollOffset = this.#getScrollOffset();
		if (this.viewport.scrollLeft == maxScrollLeft) {
			scrollOffset = maxScrollLeft * -1;
		}
		this.viewport.scrollBy({
			left: scrollOffset,
			behavior: "smooth",
		});
	}

	/**
	 * Destroys the roll.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the maximum left scroll offset possible for the viewport.
	 * 
	 * @returns {number}
	 */
	#getViewportMaxScrollLeft() {
		return this.viewport.scrollWidth - this.viewport.clientWidth;
	}

	/**
	 * Retrieves the pixel offset by which the viewport should be scrolled.
	 * 
	 * @returns {number}
	 */
	#getScrollOffset() {
		if (this.items.length) {
			return this.items[0].offsetWidth;
		}
		else {
			return 0;
		}
	}

	/**
	 * Adds event listeners related to the roll.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.prevTrigger.addEventListener("click", this);
		this.nextTrigger.addEventListener("click", this);
	}

	/**
	 * Removes event listeners related to the roll.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.prevTrigger.removeEventListener("click", this);
		this.nextTrigger.removeEventListener("click", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				if (this.prevTrigger.contains(event.target)) {
					this.scrollBack();
				}
				else if (this.nextTrigger.contains(event.target)) {
					this.scrollForward();
				}
				break;
		}
	}
}

export { Roll };