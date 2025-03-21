/**
 * Range indicator
 * This class is designed to create an indicator for range inputs that automatically updates on value changes.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class RangeIndicator {

	/**
	 * Represents an input range element.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * Represents the indicator of the range input where the value is displayed.
	 * 
	 * @type {HTMLElement}
	 */
	indicator;

	/**
	 * Function that is called to handle custom formatting of the value.
	 * 
	 * @type {function():void|null}
	 */
	formatter = null;

	/**
	 * Callback function that is called after the range input has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the range input value has changed.
	 * 
	 * @type {function():void|null}
	 */
	isValueChangedCallback = null;

	/**
	 * Callback function that is called after the range indicator has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Initial inner HTML of the indicator.
	 * 
	 * @type {string}
	 */
	#initialInnerHTML = "";

	/**
	 * Creates a range indicator.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.input
	 * @param {HTMLElement} options.indicator
	 * @param {function():void} options.formatter
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isValueChangedCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {RangeIndicator}
	 */
	constructor(options) {

		// Test required options
		if (!(options.input instanceof HTMLInputElement)) {
			throw "Range indicator \"input\" must be an `HTMLInputElement`";
		}
		if (options.input.type != "range") {
			throw "Type of the range indicator \"input\" must be `range`";
		}
		if (!(options.indicator instanceof HTMLElement)) {
			throw "Range indicator \"indicator\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the range indicator
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#initialInnerHTML = this.indicator.innerHTML;
		this.#addEvents();
		this.updateIndicator();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Updates the indicator with the current range input value.
	 * 
	 * @returns {void}
	 */
	updateIndicator() {
		let value = this.inputValue;
		if (typeof(this.formatter) == "function") {
			this.indicator.innerHTML = this.formatter(value);
		} else {
			this.indicator.innerHTML = value;
		}
	}

	/**
	 * Destroys the range indicator.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.indicator.innerText = this.#initialInnerHTML;
		this.#initialInnerHTML = "";
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	* Get the current value of the range input.
	* 
	* @return {number}
	*/
	get inputValue() {
		return Number(this.input.value);
	}

	/**
	 * Executes after the range input value has changed.
	 * 
	 * @returns {void}
	 */
	#isValueChanged() {
		this.updateIndicator();
		if (typeof(this.isValueChangedCallback) == "function") this.isValueChangedCallback();
	}

	/**
	 * Adds event listeners related to the range indicator.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.input.addEventListener("input", this);
	}

	/**
	 * Remove event listeners related to the range indicator.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.input.removeEventListener("input", this);
	}

	/**
	 * Handle events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "input":
				this.#isValueChanged();
				break;
		}
	}
}

export { RangeIndicator };