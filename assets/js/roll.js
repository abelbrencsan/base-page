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
	 * The ID of the timeout used to detect when scrolling has ended.
	 * 
	 * @type {null|number}
	 */
	timeoutId = null;

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
		this.#updateTriggerStatus(this.viewport.scrollLeft);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Scrolls the roll back.
	 * If scrolling backward is not possible, it loops back to the last item.
	 * 
	 * @returns {void}
	 */
	scrollBack() {
		let scrollOffset = this.#getScrollOffset();
		let scrollLeft = this.viewport.scrollLeft - scrollOffset;
		this.#updateTriggerStatus(scrollLeft);
		this.viewport.scrollTo({
			left: scrollLeft,
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
		let scrollOffset = this.#getScrollOffset();
		let scrollLeft = this.viewport.scrollLeft + scrollOffset;
		this.#updateTriggerStatus(scrollLeft);
		this.viewport.scrollTo({
			left: scrollLeft,
			behavior: "smooth",
		});
	}

	/**
	 * Enables / disables triggers when scrolling backward or forward is not available.
	 * 
	 * @param {number} scrollLeft
	 * @returns {void}
	 */
	#updateTriggerStatus(scrollLeft) {
		let maxScrollLeft = this.#getViewportMaxScrollLeft();
		this.prevTrigger.removeAttribute("disabled");
		this.nextTrigger.removeAttribute("disabled");
		if (scrollLeft <= 0) {
			this.prevTrigger.setAttribute("disabled", "disabled");
		}
		if (scrollLeft >= maxScrollLeft) {
			this.nextTrigger.setAttribute("disabled", "disabled");
		}
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
	 * Destroys the roll.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the pixel offset by which the viewport should be scrolled.
	 * 
	 * @returns {number}
	 */
	#getScrollOffset() {
		return this.items.length ? this.items[0].offsetWidth : 0;
	}

	/**
	 * Adds event listeners related to the roll.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.prevTrigger.addEventListener("click", this);
		this.nextTrigger.addEventListener("click", this);
		this.viewport.addEventListener("scroll", this);
	}

	/**
	 * Removes event listeners related to the roll.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.prevTrigger.removeEventListener("click", this);
		this.nextTrigger.removeEventListener("click", this);
		this.viewport.removeEventListener("scroll", this);
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
			case "scroll":
				if (this.timeoutId) clearTimeout(this.timeoutId);
				this.timeoutId = setTimeout(() => {
					this.#updateTriggerStatus(this.viewport.scrollLeft);
				}, 300);
		}
	}
}

export { Roll };