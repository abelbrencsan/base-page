/**
 * Lazy load detector
 * This class is designed to detect when an element that is loaded lazily has completed loading.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class LazyLoadDetector {

	/**
	 * The image that is detected by the lazy load detector when it is loaded.
	 * 
	 * @type {HTMLImageElement}
	 */
	element;

	/**
	 * The class that is added to the element after it has been loaded.
	 * 
	 * @type {string}
	 */
	isLoadedclassName = "is-loaded";

	/**
	 * Callback function that is called after the lazy load detector has been initialized.
	 * 
	 * @type {function(LazyLoadDetector):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the element has been loaded.
	 * 
	 * @type {function(LazyLoadDetector):void|null}
	 */
	isLoadedCallback = null;

	/**
	 * Creates a lazy load detector.
	 * 
	 * @param {Object} options
	 * @param {HTMLImageElement} options.element - The image that is detected by the lazy load detector when it is loaded.
	 * @param {string} options.isLoadedclassName - The class that is added to the element after it has been loaded.
	 * @param {function(LazyLoadDetector):void|null} options.initCallback - Callback function that is called after the lazy load detector has been initialized.
	 * @param {function(LazyLoadDetector):void|null} options.isLoadedCallback - Callback function that is called after the element has been loaded.
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
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Executes after the element has been loaded.
	 * 
	 * @returns {void}
	 */
	#isLoaded() {
		this.#removeEvents();
		this.element.classList.add(this.isLoadedclassName);
		if (typeof(this.isLoadedCallback) == "function") this.isLoadedCallback(this);
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
	 * @param {Event} event - The event to be handled.
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