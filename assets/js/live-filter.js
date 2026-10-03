/**
 * Live Filter
 * This class is designed to filter lists or tables in real-time based on user input.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class LiveFilter {

	/**
	 * The wrapper element that contains both the input and the filterable items.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The input element used for filtering.
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
	 * The class that is added to the wrapper of the item when it is filtered out.
	 * 
	 * @type {string}
	 */
	isFilteredClass = "is-filtered";

	/**
	 * The class that is added to the wrapper when at least one item is filtered out.
	 * 
	 * @type {string}
	 */
	hasFilteredClass = "has-filtered-item";

	/**
	 * The class that is added to the wrapper when all item are filtered out.
	 * 
	 * @type {string}
	 */
	allFilteredClass = "all-filtered";

	/**
	 * Callback function that is called after the live filter has been initialized.
	 * 
	 * @type {function(LiveFilter):void|null}
	 */
	initCallback = null;

	/**
	 * Creates a live filter.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains both the input and the filterable items.
	 * @param {HTMLInputElement} options.input - The input element used for filtering.
	 * @param {LiveFilterItem[]} options.items - An array of items that can be filtered in real-time.
	 * @param {string} options.isFilteredClass - The class that is added to the wrapper of the item when it is filtered out.
	 * @param {string} options.hasFilteredClass - The class that is added to the wrapper when at least one item is filtered out.
	 * @param {string} options.allFilteredClass - The class that is added to the wrapper when all item are filtered out.
	 * @param {function(LiveFilter):void|null} options.initCallback - Callback function that is called after the live filter has been initialized.
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
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Filters the items based on the current the input value.
	 * 
	 * @returns {void}
	 */
	filter() {
		const value = this.input.value.toLowerCase();
		this.wrapper.classList.remove(this.hasFilteredClass);
		this.wrapper.classList.add(this.allFilteredClass);
		this.items.forEach((item) => {
			item.wrapper.classList.remove(this.isFilteredClass);
			if (!item.content.toLowerCase().includes(value)) {
				item.wrapper.classList.add(this.isFilteredClass);
				this.wrapper.classList.add(this.hasFilteredClass);
			} else {
				this.wrapper.classList.remove(this.allFilteredClass);
			}
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
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
	 * The wrapper element to which the class is added when an item is filtered out.
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
	 * Creates a live filter item.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element to which the class is added when an item is filtered out.
	 * @param {string} options.content - The content examined to determine if it includes the filter phrase.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the live filter item has been initialized.
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
}

export { LiveFilter, LiveFilterItem };