/**
 * Glider
 * This class is designed to create responsive content gliders.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Glider {

	/**
	 * Represents the wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents the viewport element in which the items glide.
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
	 * Represents a button that scrolls the glider to the previous item.
	 * 
	 * @type {HTMLButtonElement}
	 */
	prevTrigger;

	/**
	 * Represents a button that scrolls the glider to the next item.
	 * 
	 * @type {HTMLButtonElement}
	 */
	nextTrigger;

	/**
	 * Indicates whether the glider jumps back to the first item or to the last item when there is no next or previous item available.
	 * 
	 * @type {boolean}
	 */
	hasRewind = true;

	/**
	 * The class added to the wrapper element if the glider is scrollable (wider than the viewport).
	 * 
	 * @type {string}
	 */
	isScrollableClass = "is-scrollable";

	/**
	 * The class added to the wrapper element while the glider is scrolling.
	 * 
	 * @type {string}
	 */
	isScrollingClass = "is-scrolling";

	/**
	 * Callback function that is called after the glider has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is invoked after the glider becomes scrollable.
	 * 
	 * @type {function():void|null}
	 */
	isScrollableCallback = null;

	/**
	 * Callback function that is called after the glider has started scrolling.
	 * 
	 * @type {function():void|null}
	 */
	isScrollStartedCallback = null;

	/**
	 * Callback function that is called after the glider scrolling has ended.
	 * 
	 * @type {function():void|null}
	 */
	isScrollEndedCallback = null;

	/**
	 * Callback function that is called after the glider has been destroyed.
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
	 * Creates a glider.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLElement} options.viewport
	 * @param {NodeList} options.items
	 * @param {HTMLButtonElement} options.prevTrigger
	 * @param {HTMLButtonElement} options.nextTrigger
	 * @param {boolean} options.hasRewind
	 * @param {string} options.isScrollableClass
	 * @param {string} options.isScrollingClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isScrollableCallback
	 * @param {function():void} options.isScrollStartedCallback
	 * @param {function():void} options.isScrollEndedCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Glider}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Glider \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.viewport instanceof HTMLElement)) {
			throw "Glider \"viewport\" must be an `HTMLElement`";
		}
		if (!(options.items instanceof NodeList)) {
			throw "Glider \"items\" must be an `NodeList`";
		}
		if (!(options.prevTrigger instanceof HTMLButtonElement)) {
			throw "Glider \"prevTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.nextTrigger instanceof HTMLButtonElement)) {
			throw "Glider \"nextTrigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the glider
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.detectIsScrollable.call(this);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the glider.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.wrapper.classList.remove(this.isScrollableClass);
		this.wrapper.classList.remove(this.isScrollingClass);
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Retrieves the index of the currently active item in the glider.
	 * 
	 * @returns {number|null}
	 */
	getActiveIndex() {
		const offset = Math.floor(this.viewport.scrollLeft);
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].offsetLeft >= offset) {
				return i;
			}
		}
	}

	/**
	 * Retrieves the last possible active index in the glider.
	 * 
	 * @returns {number|null}
	 */
	getLastActiveIndex() {
		const maxOffsetWidth = this.viewport.scrollWidth - this.viewport.offsetWidth;
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].offsetLeft >= maxOffsetWidth) {
				return i;
			}
		}
	}

	/**
	 * Retrieves the scroll position of the item at the specified index in the glider.
	 * 
	 * @param {number|null} index
	 * @returns {number}
	 */
	getPositionByIndex(index) {
		if (index === null) return 0;
		if (index < 0) {
			index = 0;
			if (this.hasRewind) {
				index = this.getLastActiveIndex();
			}
		}
		else if (index >= this.getLastActiveIndex() + 1) {
			index = index - 1;
			if (this.hasRewind) {
				index = 0;
			}
		}
		return this.items[index].offsetLeft;
	}

	/**
	 * Scrolls the glider back to the previous item.
	 * If the current item is the first one, loop back to the last item.
	 * 
	 * @returns {void}
	 */
	scrollBack() {
		const activeIndex = this.getActiveIndex();
		const pos = this.getPositionByIndex(activeIndex - 1);
		this.viewport.scrollTo({
			left: pos,
			behavior: "smooth",
		});
	}

	/**
	 * Scrolls the glider forward to the previous item.
	 * If the current item is the last one, loop back to the first item.
	 * 
	 * @returns {void}
	 */
	scrollForward() {
		let activeIndex = this.getActiveIndex();
		let pos = this.getPositionByIndex(activeIndex + 1);
		this.viewport.scrollTo({
			left: pos,
			behavior: "smooth",
		});
	}

	/**
	 * Scrolls the glider to the item with the specified index.
	 * 
	 * @param {number} index
	 * @param {behavior} string
	 * @returns {void}
	 */
	scrollTo(index, behavior = "smooth") {
		let pos = this.getPositionByIndex(index);
		this.viewport.scrollTo({
			left: pos,
			behavior: behavior,
		});
	}

	/**
	 * Detect whether the glider is currently scrollable.
	 * 
	 * @returns {void}
	 */
	detectIsScrollable() {
		let isScrollable = false;
		this.wrapper.classList.remove(this.isScrollableClass);
		if (this.viewport.offsetWidth < this.viewport.scrollWidth) {
			isScrollable = true;
			this.wrapper.classList.add(this.isScrollableClass);
		}
		if (typeof(this.isScrollableCallback) == "function") this.isScrollableCallback(isScrollable);
	}

	/**
	 * Executes after the glider has started scrolling.
	 * 
	 * @returns {void}
	 */
	#isScrollStarted() {
		this.wrapper.classList.add(this.isScrollingClass);
		if (typeof(this.isScrollStartedCallback) == "function") this.isScrollStartedCallback();
	}

	/**
	 * Executes after the glider scrolling has ended.
	 * 
	 * @returns {void}
	 */
	#isScrollEnded() {
		this.timeoutId = null;
		this.wrapper.classList.remove(this.isScrollingClass);
		if (typeof(this.isScrollEndedCallback) == "function") this.isScrollEndedCallback();
	}

	/**
	 * Adds event listeners related to the glider.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.prevTrigger.addEventListener("click", this);
		this.nextTrigger.addEventListener("click", this);
		this.viewport.addEventListener("scroll", this);
	}

	/**
	 * Remove event listeners related to the glider.
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
				if (this.timeoutId === null) {
					this.#isScrollStarted();

				} else {
					clearTimeout(this.timeoutId);
				}
				this.timeoutId = setTimeout(() => {
					this.#isScrollEnded();
				}, 300);
				break;
		}
	}
}

export { Glider };