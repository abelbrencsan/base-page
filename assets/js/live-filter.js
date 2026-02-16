/**
 * Live Filter
 * This class is designed to filter lists or tables in real-time based on user input.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class LiveFilter {

	/**
	 * Represents the wrapper element that contains both the input and the filterable items.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents an input element used for filtering.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * An array of items that can be filtered in real-time.
	 * 
	 * @type {LiveFilterItem[]}
	 */
	items = [];

	/**
	 * The class added to the wrapper of the item when it is filtered out.
	 * 
	 * @type {string}
	 */
	isFilteredClass = "is-filtered";

	/**
	 * The class added to the wrapper when at least one item is filtered out.
	 * 
	 * @type {string}
	 */
	hasFilteredClass = "has-filtered-item";

	/**
	 * Callback function that is called after the live filter has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the live filter has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a live filter.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {HTMLInputElement} options.input
	 * @param {LiveFilterItem[]} options.items
	 * @param {string} options.isFilteredClass
	 * @param {string} options.hasFilteredClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {LiveFilter}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Live filter \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.input instanceof HTMLInputElement)) {
			throw "Live filter \"input\" must be an `HTMLInputElement`";
		}
		options.items.forEach((item) => {
			if (!(item instanceof LiveFilterItem)) {
				throw 'Live filter item must be a `LiveFilterItem`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the live filter
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.filter();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Filters the items based on the current the input value.
	 * 
	 * @returns {void}
	 */
	filter() {
		const value = this.input.value.toLowerCase();
		this.wrapper.classList.remove(this.hasFilteredClass);
		this.items.forEach((item) => {
			item.wrapper.classList.remove(this.isFilteredClass);
			if (!item.content.toLowerCase().includes(value)) {
				item.wrapper.classList.add(this.isFilteredClass);
				this.wrapper.classList.add(this.hasFilteredClass);
			}
		});
	}

	/**
	 * Destroys the live filter.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.#destroyItems();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Destroys the live filter items.
	 * 
	 * @returns {void}
	 */
	#destroyItems() {
		this.items.forEach((item) => {
			item.destroy();
		});
	}

	/**
	 * Adds event listeners related to the live filter.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.input.addEventListener("input", this);
	}

	/**
	 * Removes event listeners related to the live filter.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.input.removeEventListener("input", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "input":
				this.filter();
				break;
		}
	}
}

/**
 * Live filter item
 * This class is designed to create an item for a live filter.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class LiveFilterItem {

	/**
	 * Represents the wrapper element to which the class is added when an item is filtered out.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The content examined to determine if it includes the filter phrase.
	 * 
	 * @type {string}
	 */
	content = "";

	/**
	 * Callback function that is called after the live filter item has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the live filter item has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a live filter item.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {string} options.content
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {TourSceneTrigger}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Live filter item \"wrapper\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the live filter item
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the live filter item.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}
}

export { LiveFilter, LiveFilterItem };