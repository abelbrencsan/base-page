/**
 * Range indicator
 * This class is designed to create an indicator for range inputs that automatically updates on value changes.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class RangeIndicator {

	/**
	 * The range input element whose value is displayed in the indicator.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * The indicator of the range input in which the value is displayed.
	 * 
	 * @type {HTMLElement}
	 */
	indicator;

	/**
	 * Function that is called to format the value.
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
	 * Creates a range indicator.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.input - The range input element whose value is displayed in the indicator.
	 * @param {HTMLElement} options.indicator - The indicator of the range input in which the value is displayed.
	 * @param {function():void|null} options.formatter - Function that is called to format the value.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the range input has been initialized.
	 * @param {function():void|null} options.isValueChangedCallback - Callback function that is called after the range input value has changed.
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
	* Get the current value of the range input.
	* 
	* @return {number} The value as a number.
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
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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