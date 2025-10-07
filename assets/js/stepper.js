/**
 * Stepper
 * This class is designed to create step-up and step-down controls for numeric inputs.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Stepper {

	/**
	 * Represents an input element whose value can be stepped up and down.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * Represents the button that increments the value.
	 * 
	 * @type {HTMLButtonElement}
	 */
	stepUpTrigger;

	/**
	 * Represents the button that decrements the value.
	 * 
	 * @type {HTMLButtonElement}
	 */
	stepDownTrigger;

	/**
	 * Represents the indicator where the current value is rendered to in a formatted way.
	 * 
	 * @type {HTMLElement|null}
	 */
	indicator = null;

	/**
	 * Function that is called to handle how the current value is rendered in the indicator.
	 * 
	 * @type {function(number):void|null}
	 */
	formatter = (value) => value;

	/**
	 * Callback function that is called after the stepper has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the stepper has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a stepper.
	 * 
	 * @param {Object} options
	 * @param {HTMLInputElement} options.input
	 * @param {HTMLButtonElement} options.stepUpTrigger
	 * @param {HTMLButtonElement} options.stepDownTrigger
	 * @param {HTMLElement|null} options.indicator
	 * @param {function(number):void|null} options.formatter
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Stepper}
	 */
	constructor(options) {

		// Test required options
		if (!(options.input instanceof HTMLInputElement)) {
			throw "Stepper \"input\" must be an `HTMLInputElement`";
		}
		if (options.input.type != "number") {
			// throw "Stepper \"input\" type must be `number`";
		}
		if (!(options.stepUpTrigger instanceof HTMLButtonElement)) {
			throw "Stepper \"stepUpTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.stepDownTrigger instanceof HTMLButtonElement)) {
			throw "Stepper \"stepDownTrigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the stepper
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.input.value = this.inputValue;
		this.#isInputChanged();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Increments the current value of the input.
	 * 
	 * @returns {void}
	 */
	stepUp() {
		this.input.stepUp();
		this.#isInputChanged();
		this.#triggerInputEvent();
	}

	/**
	 * Decrements the current value of the input.
	 * 
	 * @returns {void}
	 */
	stepDown() {
		this.input.stepDown();
		this.#isInputChanged();
		this.#triggerInputEvent();
	}

	/**
	 * Destroys the stepper.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	* Retrieves the current value of the input.
	* 
	* @return {number}
	*/
	get inputValue() {
		return Number(this.input.value);
	}

	/**
	 * The value of the input has changed.
	 * 
	 * @returns {void}
	 */
	#isInputChanged() {
		if (this.indicator) {
			this.indicator.innerHTML = this.formatter(this.inputValue);
		}
	}

	/**
	 * Triggers the input event manually.
	 * 
	 * @returns {void}
	 */
	#triggerInputEvent() {
		const inputEvent = new Event("input", { bubbles: true });
		this.input.dispatchEvent(inputEvent);
	}

	/**
	 * Adds event listeners related to the stepper.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.stepUpTrigger.addEventListener("click", this);
		this.stepDownTrigger.addEventListener("click", this);
		this.input.addEventListener("input", this);
	}

	/**
	 * Removes event listeners related to the stepper.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.stepUpTrigger.removeEventListener("click", this);
		this.stepDownTrigger.removeEventListener("click", this);
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
			case "click":
				switch (event.target) {
					case this.stepUpTrigger:
						this.stepUp();
						break;
					case this.stepDownTrigger:
						this.stepDown();
						break;
				}
				break;
			case "input":
				this.#isInputChanged();
				break;
		}
	}
}

export { Stepper };