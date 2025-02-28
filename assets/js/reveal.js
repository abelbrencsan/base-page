/**
 * Reveal
 * This class is designed to detect when the specified elements are above, below, or within the viewport.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Reveal {

	/**
	 * The percentage of the target's visibility after the position has been checked.
	 * 
	 * @type {number}
	 */
	threshold = 0;

	/**
	 * The class added to an element that is above the viewport.
	 * 
	 * @type {string}
	 */
	aboveViewportClass = "above-viewport";

	/**
	 * The class added to an element that is below the viewport.
	 * 
	 * @type {string}
	 */
	belowViewportClass = "below-viewport";

	/**
	 * The class added to an element that is in the viewport.
	 * 
	 * @type {string}
	 */
	inViewportClass = "in-viewport";

	/**
	 * Callback function that is called after the reveal has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the reveal has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The intersection observer used to detect intersections of elements.
	 * 
	 * @type {IntersectionObserver}
	 */
	#observer = null;

	/**
	 * The elements that are added to the reveal.
	 * 
	 * @type {Array<HTMLElement>}
	 */
	#elems = [];

	/**
	 * Creates a reveal.
	 * 
	 * @param {Object} options
	 * @param {number} options.threshold
	 * @param {string} options.aboveViewportClass
	 * @param {string} options.belowViewportClass
	 * @param {string} options.inViewportClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Reveal}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the reveal
		const observerOptions = { threshold: this.threshold };
		this.#observer = new IntersectionObserver(this.reveal.bind(this), observerOptions);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Handles the reveals.
	 * 
	 * @param {Array<IntersectionObserverEntry>} entries
	 * @param {IntersectionObserver} _observer
	 * @returns {void}
	 */
	reveal(entries, _observer) {
		entries.forEach((entry) => {
			this.#resetElem(entry.target);
			if (entry.intersectionRatio > this.threshold) {
				entry.target.classList.add(this.inViewportClass);
			} else {
				if (entry.boundingClientRect.top > 0) {
					entry.target.classList.add(this.aboveViewportClass);
				} else {
					entry.target.classList.add(this.belowViewportClass);
				}
			}
		});
	}

	/**
	 * Adds the specified element to the reveal.
	 * 
	 * @param {HTMLElement} elem
	 * @return {void}
	 */
	add(elem) {
		this.#observer.observe(elem);
		this.#elems.push(elem);
	}

	/**
	 * Removes the specified element from the reveal.
	 * 
	 * @param {HTMLElement} elem
	 * @return {void}
	 */
	remove(elem) {
		this.#observer.unobserve(elem);
		this.#elems = this.#elems.filter((e) => {
			if (elem === e) this.#resetElem(elem);
			return elem !== e;
		})
	}

	/**
	 * Destroys the reveal.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#observer.disconnect();
		this.#elems.forEach((elem) => {
			this.#resetElem(elem);
		});
		this.#elems = [];
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Resets the attributes and classes of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @returns {void}
	 */
	#resetElem(elem) {
		elem.classList.remove(this.inViewportClass);
		elem.classList.remove(this.aboveViewportClass);
		elem.classList.remove(this.belowViewportClass);
	}
};

export { Reveal };