/**
 * Validator
 * This class handles form validation using native HTML5 validation rules along with custom error handling.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Validator {

	/**
	 * Represents the form element.
	 * 
	 * @type {HTMLFormElement}
	 */
	form;

	/**
	 * The class added to the input field when it is invalid.
	 * 
	 * @type {string}
	 */
	invalidInputClass = "is-invalid";

	/**
	 * The class added to the input field when it is valid.
	 * 
	 * @type {string}
	 */
	validInputClass = "is-valid";

	/**
	 * Error messages for different types of errors.
	 * 
	 * @type {Object<string, string>}
	 */
	messages = {
		"badInput": "Bad input",
		"patternMismatch": "Pattern mismatch",
		"rangeOverflow": "Range overflow",
		"rangeUnderflow": "Range underflow",
		"stepMismatch": "Step mismatch",
		"tooLong": "Too long",
		"tooShort": "Too short",
		"typeMismatch": "Type mismatch",
		"valueMissing": "Value missing",
		"unknown": "Unknown"
	};

	/**
	 * Attributes that hold custom error messages for different types of errors.
	 * 
	 * @type {Object<string, string>}
	 */
	messageAttrs = {
		"badInput": "data-validator-bad-input",
		"patternMismatch": "data-validator-pattern-mismatch",
		"rangeOverflow": "data-validator-range-overflow",
		"rangeUnderflow": "data-validator-range-underflow",
		"stepMismatch": "data-validator-step-mismatch",
		"tooLong": "data-validator-too-long",
		"tooShort": "data-validator-too-short",
		"typeMismatch": "data-validator-type-mismatch",
		"valueMissing": "data-validator-value-missing",
		"unknown": "data-validator-unknown"
	};

	/**
	 * Callback function that is called after the validator been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after an input field is validated as invalid inside the form.
	 * 
	 * @type {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement, string, string):void|null}
	 */
	invalidCallback = null;

	/**
	 * Callback function that is called after an input field is validated inside the form.
	 * 
	 * @type {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement):void|null}
	 */
	validCallback = null;

	/**
	 * Callback function that is called after the validator has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a validator.
	 * 
	 * @param {Object} options
	 * @param {HTMLFormElement} options.form
	 * @param {string} options.invalidInputClass
	 * @param {string} options.validInputClass
	 * @param {Object} options.messages
	 * @param {Object} options.messageAttrs
	 * @param {function():void} options.initCallback
	 * @param {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement, string, string):void} options.invalidCallback
	 * @param {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement):void} options.validCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Validator}
	 */
	constructor(options) {

		// Test required options
		if (!(options.form instanceof HTMLFormElement)) {
			throw "Validator \"form\" must be a `HTMLFormElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the validator
		this.handleEvent = function(event) {
			this.#handleEvents(event);
		};
		this.#addEvents();
		this.form.setAttribute("novalidate", "novalidate");
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Validates the specified input element.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input
	 * @param {boolean} checkSimilarControls
	 * @returns {boolean}
	 */
	validateInput(input, checkSimilarControls = true) {
		const isValid = input.checkValidity();
		input.classList.remove(this.invalidInputClass);
		input.classList.remove(this.validInputClass);
		if (isValid) {
			this.#isInputValid(input);
		} else {
			this.#isInputInvalid(input);
		}
		if (checkSimilarControls && ["checkbox", "radio"].includes(input.type)) {
			Array.from(this.form.elements).forEach((elem) => {
				if (input != elem && input.name == elem.name) {
					this.validateInput(elem, false);
				}
			});
		}
		return isValid;
	}

	/**
	 * Validates all input elements within the form.
	 * 
	 * @returns {boolean}
	 */
	validateAllInputs() {
		let invalidInputs = Array.from(this.form.elements).filter((elem) => {
			if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement || elem instanceof HTMLTextAreaElement) {
				return !this.validateInput(elem, false);
			}
		});
		if (invalidInputs.length) {
			invalidInputs[0].focus();
		}
		return !invalidInputs.length;
	}

	/**
	 * Destroys the validator.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.form.removeAttribute("novalidate");
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Gets the error type of the first error that occurred during input validation.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement} input
	 * @returns {string}
	 */

	#getErrorType(input) {
		for (let key in this.messages) {
			if (key in input.validity && input.validity[key]) {
				return key;
			}
		}
		return "unknown";
	}

	/**
	 * Gets the message related to the specified error type.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement} input
	 * @param {string} errorType
	 * @returns {string}
	 */
	#getErrorMessage(input, errorType) {
		if (errorType in this.messageAttrs && input.hasAttribute(this.messageAttrs[errorType])) {
			return input.getAttribute(this.messageAttrs[errorType]);
		} else if (errorType in this.messages) {
			return this.messages[errorType];
		}
		return "";
	}

	/**
	 * Executes when the input element is invalid.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement} input
	 * @returns {void}
	 */
	#isInputInvalid(input) {
		let errorType = this.#getErrorType(input);
		let message = this.#getErrorMessage(input, errorType);
		input.classList.add(this.invalidInputClass);
		if (typeof(this.invalidCallback) == "function") this.invalidCallback(input, message, errorType);
	}

	/**
	 * Executes when the input element is valid.
	 * 
	 * @returns {void}
	 */
	#isInputValid(input) {
		input.classList.add(this.validInputClass);
		if (typeof(this.validCallback) == "function") this.validCallback(input);
	}

	/**
	 * Adds event listeners related to the validator.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.form.addEventListener("submit", this);
		this.form.addEventListener("input", this);
	}

	/**
	 * Adds event listeners related to the validator.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.form.removeEventListener("submit", this);
		this.form.removeEventListener("input", this);
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
				if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
					this.validateInput(event.target);
				}
				break;
			case "submit":
				if (event.target == this.form) {
					if (!this.form.checkValidity()) {
						if (!this.validateAllInputs()) {
							event.preventDefault();
						}
					}
				}
				break;
		}
	}
};

export { Validator };