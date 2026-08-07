/**
 * Glider
 * This class is designed to create responsive gliders.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Glider {

	/**
	 * The wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The viewport element within which the items glide.
	 * 
	 * @type {HTMLElement}
	 */
	viewport;

	/**
	 * The trigger that scrolls the glider to the previous item when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	prevTrigger;

	/**
	 * The trigger that scrolls the glider to the next item when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	nextTrigger;

	/**
	 * An array of items that are gliding within the viewport.
	 * 
	 * @type {Array<HTMLElement>}
	 */
	items;

	/**
	 * Indicates whether the glider jumps back to the first or last item when no next or previous items are available.
	 * 
	 * @type {boolean}
	 */
	hasRewind = true;

	/**
	 * The threshold between 0 and 1 indicating how much of the element must be visible to be marked as visible.
	 * 
	 * @type {number}
	 */
	threshold = 0.5;

	/**
	 * The delay in milliseconds after the glider automatically scrolls forward to the next item. 
	 *
	 * @type {number}
	 */
	autoplay = 0;

	/**
	 * The trigger that stops or restarts the autoplay.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	autoplayTrigger = null;

	/**
	 * The class that is added to the items while they are visible within the viewport.
	 * 
	 * @type {string}
	 */
	isItemVisibleClass = "is-visible";

	/**
	 * The class that is added to the wrapper element when the viewport is scrollable.
	 * 
	 * @type {string}
	 */
	isScrollableClass = "is-scrollable";

	/**
	 * The class that is added to the wrapper element when the viewport reaches the first glide.
	 * 
	 * @type {string}
	 */
	isFirstGlideClass = "is-first-glide";

	/**
	 * The class that is added to the wrapper element when the viewport reaches the last glide.
	 * 
	 * @type {string}
	 */
	isLastGlideClass = "is-last-glide";

	/**
	 * The class that is added to the wrapper element when the autoplay is enabled.
	 * 
	 * @type {string}
	 */
	hasAutoplayClass = "has-autoplay";

	/**
	 * The class that is added to the wrapper when the autoplay has been stopped.
	 * 
	 * @type {string}
	 */
	isAutoplayStoppedClass = "is-autoplay-stopped";

	/**
	 * Callback function that is called after the glider has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the autoplay has been started.
	 * 
	 * @type {function():void|null}
	 */
	startAutoplayCallback = null;

	/**
	 * Callback function that is called after the autoplay has been stopped.
	 * 
	 * @type {function():void|null}
	 */
	stopAutoplayCallback = null;

	/**
	 * The ID of the interval created to handle autoplay.
	 * 
	 * @type {number|null}
	 */
	intervalId = null;

	/**
	 * The Intersection Observer API used to detect visible items within the glider.
	 * 
	 * @type {IntersectionObserver}
	 */
	observer;

	/**
	 * The width which the viewport should be scrolled.
	 * 
	 * @returns {number}
	 */
	get itemScrollWidth() {
		return this.items.length ? this.items[0].offsetWidth : 0;
	}

	/**
	 * Indicates whether the viewport is scrollable.
	 * 
	 * @returns {boolean}
	 */
	get isScrollable() {
		return this.viewport.scrollWidth > this.viewport.offsetWidth;
	}

	/**
	 * The scroll position of the last glide.
	 * 
	 * @returns {number}
	 */
	get maxScrollLeft() {
		return this.viewport.scrollWidth - this.viewport.clientWidth;
	}

	/**
	 * Creates a glider.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element.
	 * @param {HTMLElement} options.viewport - The viewport element within which the items glide.
	 * @param {HTMLButtonElement} options.prevTrigger - The trigger that scrolls the glider to the previous item when clicked.
	 * @param {HTMLButtonElement} options.nextTrigger - The trigger that scrolls the glider to the next item when clicked.
	 * @param {Array<HTMLElement>} options.items - An array of items that are gliding within the viewport.
	 * @param {boolean} options.hasRewind - Indicates whether the glider jumps back to the first or last item when no next or previous items are available.
	 * @param {number} options.threshold - The threshold between 0 and 1 indicating how much of the element must be visible to be marked as visible.
	 * @param {number} options.autoplay - The delay in milliseconds after the glider automatically scrolls forward to the next item. 
	 * @param {HTMLButtonElement|null} options.autoplayTrigger - The trigger that stops or restarts the autoplay.
	 * @param {string} options.isItemVisibleClass - The class that is added to the items while they are visible within the viewport.
	 * @param {string} options.isScrollableClass - The class that is added to the wrapper element when the viewport is scrollable.
	 * @param {string} options.isFirstGlideClass - The class that is added to the wrapper element when the viewport reaches the first glide.
	 * @param {string} options.isLastGlideClass - The class that is added to the wrapper element when the viewport reaches the last glide.
	 * @param {string} options.hasAutoplayClass - The class that is added to the wrapper element when the autoplay is enabled.
	 * @param {string} options.isAutoplayStoppedClass - The class that is added to the wrapper when the autoplay has been stopped.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the glider has been initialized.
	 * @param {function():void|null} options.startAutoplayCallback - Callback function that is called after the autoplay has been started.
	 * @param {function():void|null} options.stopAutoplayCallback - Callback function that is called after the autoplay has been stopped.
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
		if (!(options.prevTrigger instanceof HTMLButtonElement)) {
			throw "Glider \"prevTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.nextTrigger instanceof HTMLButtonElement)) {
			throw "Glider \"nextTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.items instanceof Array)) {
			throw 'Glider \"items\" must be an `array`';
		}
		options.items.forEach((item) => {
			if (!(item instanceof HTMLElement)) {
				throw 'Glider item must be an `HTMLElement`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the glider
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.observer = this.#initObserver();
		this.items.forEach((item) => this.observer.observe(item));
		this.startAutoplay();
		this.wrapper.classList.toggle(this.hasAutoplayClass, this.autoplay);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Scrolls the glider back to the previous item, or rewinds to the last item if rewind is enabled.
	 * 
	 * @returns {void}
	 */
	scrollBack() {
		let scrollLeft = this.viewport.scrollLeft - this.itemScrollWidth;
		this.#scrollTo(scrollLeft);
	}

	/**
	 * Scrolls the glider forward to the next item, or rewinds to the first item if rewind is enabled.
	 * 
	 * @returns {void}
	 */
	scrollForward() {
		let scrollLeft = this.viewport.scrollLeft + this.itemScrollWidth;
		this.#scrollTo(scrollLeft);
	}

	/**
	 * Scrolls the glider to the item with the specified index.
	 * 
	 * @param {number} index - The index of the item.
	 * @param {string} behavior - The behavior of the scroll.
	 * @returns {void}
	 */
	scrollToItem(index, behavior = "smooth") {
		let scrollLeft = index * this.itemScrollWidth;
		this.#scrollTo(scrollLeft, behavior);
	}

	/**
	 * Starts the autoplay.
	 * 
	 * @returns {void}
	 */
	startAutoplay() {
		if (this.intervalId || !this.autoplay) return;
		this.#setAutoplayInterval();
		this.wrapper.classList.remove(this.isAutoplayStoppedClass);
		if (typeof(this.startAutoplayCallback) == "function") this.startAutoplayCallback();
	}

	/**
	 * Stops the autoplay.
	 * 
	 * @returns {void}
	 */
	stopAutoplay() {
		if (!this.intervalId || !this.autoplay) return;
		clearInterval(this.intervalId);
		this.intervalId = null;
		this.wrapper.classList.add(this.isAutoplayStoppedClass);
		if (typeof(this.stopAutoplayCallback) == "function") this.stopAutoplayCallback();
	}

	/**
	 * Initializes the intersection observer API to detect visible items within the viewport.
	 * 
	 * @returns {IntersectionObserver} The created intersection observer.
	 */
	#initObserver() {
		return new IntersectionObserver((entries) => {
			entries.forEach((entry) => this.#processObserverEntry(entry));
			this.wrapper.classList.toggle(this.isScrollableClass, this.isScrollable);
			this.#resetAutoplay();
		}, { root: this.viewport, threshold: this.threshold });
	}

	/**
	 * Processes an entry within the intersection observer API.
	 * 
	 * @param {IntersectionObserverEntry} entry - The intersection observer entry to be processed.
	 * @returns {void}
	 */
	#processObserverEntry(entry) {
		entry.target.classList.toggle(this.isItemVisibleClass, entry.isIntersecting);
		if (entry.target == this.items[0]) {
			this.wrapper.classList.toggle(this.isFirstGlideClass, entry.isIntersecting);
			if (!this.hasRewind) {
				this.prevTrigger.toggleAttribute("disabled", entry.isIntersecting);
			}
		}
		if (entry.target == this.items[this.items.length - 1]) {
			this.wrapper.classList.toggle(this.isLastGlideClass, entry.isIntersecting);
			if (!this.hasRewind) {
				this.nextTrigger.toggleAttribute("disabled", entry.isIntersecting);
			}
		}
	}

	/**
	 * Scrolls the glider to the specified scroll position.
	 * 
	 * @param {number} scrollLeft - The horizontal scroll position to be set.
	 * @param {string} behavior - The behavior of the scroll.
	 * @returns {void}
	 */
	#scrollTo(scrollLeft, behavior = "smooth") {
		let clampedScrollLeft = this.#clampScrollLeft(scrollLeft);
		this.viewport.scrollTo({
			left: clampedScrollLeft,
			behavior: behavior
		});
	}

	/**
	 * Retrieves the clamped value of the specified scroll position to ensure it stays within the available range.
	 * 
	 * @param {number} scrollLeft - The horizontal scroll position to be set.
	 * @returns {number} The clamped value of the scroll position.
	 */
	#clampScrollLeft(scrollLeft) {
		let clampedScrollLeft = Math.min(Math.max(0, scrollLeft), this.maxScrollLeft);
		if (this.hasRewind) {
			let isAtFirstGlide = Math.floor(this.viewport.scrollLeft) <= 0;
			let isAtLastGlide = Math.ceil(this.viewport.scrollLeft) >= this.maxScrollLeft;
			if (clampedScrollLeft <= 0 && isAtFirstGlide) {
				clampedScrollLeft = this.maxScrollLeft;
			}
			else if (clampedScrollLeft >= this.maxScrollLeft && isAtLastGlide) {
				clampedScrollLeft = 0;
			}
		}
		return clampedScrollLeft;
	}

	/**
	 * Clears the current autoplay and starts a new one. 
	 * 
	 * @returns {void}
	 */
	#resetAutoplay() {
		if (!this.intervalId || !this.autoplay) return;
		clearInterval(this.intervalId);
		this.#setAutoplayInterval();
	}
	
	/**
	 * Sets the interval for the autoplay.
	 * 
	 * @returns {void}
	 */
	#setAutoplayInterval() {
		this.intervalId = setInterval(() => this.scrollForward(), this.autoplay);
	}

	/**
	 * Adds event listeners related to the glider.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.prevTrigger.addEventListener("click", this);
		this.nextTrigger.addEventListener("click", this);
		if (this.autoplayTrigger) this.autoplayTrigger.addEventListener("click", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				switch (event.target) {
					case this.prevTrigger:
						this.scrollBack();
						break;
					case this.nextTrigger:
						this.scrollForward();
						break;
					case this.autoplayTrigger:
						if (this.intervalId) {
							this.stopAutoplay();
						} else {
							this.startAutoplay();
						}
						break;
				}
		}
	}
}

export { Glider };