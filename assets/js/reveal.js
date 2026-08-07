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
	 * The class that is added to an element that is above the viewport.
	 * 
	 * @type {string}
	 */
	aboveViewportClass = "above-viewport";

	/**
	 * The class that is added to an element that is below the viewport.
	 * 
	 * @type {string}
	 */
	belowViewportClass = "below-viewport";

	/**
	 * The class that is added to an element that is in the viewport.
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
	 * The intersection observer used to detect intersections of elements.
	 * 
	 * @type {IntersectionObserver}
	 */
	#observer = null;

	/**
	 * The elements that are added to the reveal.
	 * 
	 * @type {HTMLElement[]}
	 */
	#elems = [];

	/**
	 * Creates a reveal.
	 * 
	 * @param {Object} options
	 * @param {number} options.threshold - The percentage of the target's visibility after the position has been checked.
	 * @param {string} options.aboveViewportClass - The class that is added to an element that is above the viewport.
	 * @param {string} options.belowViewportClass - The class that is added to an element that is below the viewport.
	 * @param {string} options.inViewportClass - The class that is added to an element that is in the viewport.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the reveal has been initialized.
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
	 * @param {IntersectionObserverEntry[]} entries - The entries to be handled.
	 * @returns {void}
	 */
	reveal(entries) {
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
	 * @param {HTMLElement} elem - The element to be added.
	 * @return {void}
	 */
	add(elem) {
		this.#observer.observe(elem);
		this.#elems.push(elem);
	}

	/**
	 * Removes the specified element from the reveal.
	 * 
	 * @param {HTMLElement} elem - The element to be removed.
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
	 * Resets the attributes and classes of the specified element.
	 * 
	 * @param {HTMLElement} elem - The element to be reset.
	 * @returns {void}
	 */
	#resetElem(elem) {
		elem.classList.remove(this.inViewportClass);
		elem.classList.remove(this.aboveViewportClass);
		elem.classList.remove(this.belowViewportClass);
	}
};

export { Reveal };