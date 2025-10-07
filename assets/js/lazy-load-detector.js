/**
 * Lazy load detector
 * This class is designed to detect when an element that is loaded lazily has completed loading.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class LazyLoadDetector {

	/**
	 * Represents an image that is detected by the lazy load detector when it is loaded.
	 * 
	 * @type {HTMLImageElement}
	 */
	element;

	/**
	 * The class added to the element after it has been loaded.
	 * 
	 * @type {string}
	 */
	isLoadedclassName = "is-loaded";

	/**
	 * Callback function that is called after the lazy load detector has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the element has been loaded.
	 * 
	 * @type {function():void|null}
	 */
	isLoadedCallback = null;

	/**
	 * Callback function that is called after the lazy load detector has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a lazy load detector.
	 * 
	 * @param {Object} options
	 * @param {HTMLImageElement} options.element
	 * @param {string} options.isLoadedclassName
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isLoadedCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {LazyLoadDetector}
	 */
	constructor(options) {

		// Test required options
		if (!(options.element instanceof HTMLImageElement)) {
			throw "Lazy load detector \"element\" must be an `HTMLImageElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the lazy load detector
		this.handleEvent = (event) => this.#handleEvents(event);
		if (this.element.complete) {
			this.#isLoaded();
		} else {
			this.#addEvents();
		}
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the lazy load detector.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Executes after the element has been loaded.
	 * 
	 * @returns {void}
	 */
	#isLoaded() {
		this.#removeEvents();
		this.element.classList.add(this.isLoadedclassName);
		if (typeof(this.isLoadedCallback) == "function") this.isLoadedCallback();
	}

	/**
	 * Adds event listeners related to the lazy load detector.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.element.addEventListener("load", this);
	}

	/**
	 * Removes event listeners related to the lazy load detector.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.element.removeEventListener("load", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "load":
				this.#isLoaded(event);
				break;
		}
	}
}

export { LazyLoadDetector };