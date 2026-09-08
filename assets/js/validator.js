/**
 * Validator
 * This class handles form validation using native HTML5 validation rules along with custom error handling.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Validator {

	/**
	 * The form element.
	 * 
	 * @type {HTMLFormElement}
	 */
	form;

	/**
	 * The class that is added to the input field when it is invalid.
	 * 
	 * @type {string}
	 */
	invalidInputClass = "is-invalid";

	/**
	 * The class that is added to the input field when it is valid.
	 * 
	 * @type {string}
	 */
	validInputClass = "is-valid";

	/**
	 * The class that is added to the submit buttons when the form is submitted.
	 * 
	 * @type {string}
	 */
	isDisabledClass = "is-disabled";

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
	 * Callback function that is called after the form has been submitted.
	 * 
	 * @type {function():void|null}
	 */
	submitCallback = null;

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
	 * Callback function that is called when all input fields are validated and one or more of them are invalid.
	 * 
	 * @type {function(Element[]):void|null}
	 */
	hasInvalidCallback = null;

	/**
	 * Creates a validator.
	 * 
	 * @param {Object} options
	 * @param {HTMLFormElement} options.form - The form element.
	 * @param {string} options.invalidInputClass - The class that is added to the input field when it is invalid.
	 * @param {string} options.validInputClass - The class that is added to the input field when it is valid.
	 * @param {string} options.isDisabledClass - The class that is added to the submit buttons when the form is submitted.
	 * @param {Object<string, string>} options.messages - Error messages for different types of errors.
	 * @param {Object<string, string>} options.messageAttrs - Attributes that hold custom error messages for different types of errors.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the validator been initialized.
	 * @param {function():void|null} options.submitCallback - Callback function that is called after the form has been submitted.
	 * @param {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement, string, string):void|null} options.invalidCallback - Callback function that is called after an input field is validated as invalid inside the form.
	 * @param {function(HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement):void|null} options.validCallback - Callback function that is called after an input field is validated inside the form.
	 * @param {function(function(Element[]):void|null} options.hasInvalidCallback - Callback function that is called when all input fields are validated and one or more of them are invalid.
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
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.form.setAttribute("novalidate", "novalidate");
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Validates the specified input element.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - The input element to be validated.
	 * @param {boolean} checkSimilarControls - Indicates whether to check checkboxes and radios with the same name.
	 * @returns {boolean} `true` if the input element is valid; otherwise, `false`.
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
			const groupElems = Array.from(this.form.elements).filter((elem) => (elem.name == input.name));
			const checkedElems = groupElems.filter((elem) => elem.checked);
			const requiredElems = groupElems.filter((elem) => elem.required);
			if (requiredElems.length) {
				groupElems.forEach((elem) => {
					if (elem instanceof HTMLInputElement) {
						if (checkedElems.length == 0 || elem.checked) {
							elem.setAttribute("required", "required");
						} else {
							elem.removeAttribute("required");
						}
						this.validateInput(elem, false);
					}
				});
			}
		}
		return isValid;
	}

	/**
	 * Validates all input elements within the form.
	 * 
	 * @returns {boolean} `true` if all input elements are valid; otherwise, `false`.
	 */
	validateAllInputs() {
		let invalidInputs = Array.from(this.form.elements).filter((elem) => {
			if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement || elem instanceof HTMLTextAreaElement) {
				return !this.validateInput(elem, false);
			}
		});
		if (invalidInputs.length) {
			invalidInputs[0].focus();
			if (typeof(this.hasInvalidCallback) == "function") this.hasInvalidCallback(invalidInputs);
		}
		return !invalidInputs.length;
	}

	/**
	 * Disables all submit buttons within the form.
	 * 
	 * @returns {void}
	 */
	disableSubmitButtons() {
		this.#disableInnerSubmitButtons();
		this.#disableOuterSubmitButtons();
	}

	/**
	 * Enables all submit buttons within the form.
	 * 
	 * @returns {void}
	 */
	enableSubmitButtons() {
		this.#enableInnerSubmitButtons();
		this.#enableOuterSubmitButtons();
	}

	/**
	 * Retrieves the type of the first error that occurred during input validation.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - The input element whose error type to be retrieved.
	 * @returns {string} The error type.
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
	 * Retrieves the message related to the specified error type.
	 * 
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - The input element whose error message to be retrieved.
	 * @param {string} errorType - The type of the error.
	 * @returns {string} The error message.
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
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - The invalid input element.
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
	 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - The valid input element.
	 * @returns {void}
	 */
	#isInputValid(input) {
		input.classList.add(this.validInputClass);
		if (typeof(this.validCallback) == "function") this.validCallback(input);
	}

	/**
	 * Disables all submit buttons located inside the form.
	 * 
	 * @returns {void}
	 */
	#disableInnerSubmitButtons() {
		const buttons = this.form.querySelectorAll("button[type=submit]");
		buttons.forEach((button) => {
			button.classList.add(this.isDisabledClass);
		});
	}

	/**
	 * Disables all submit buttons located outside the form.
	 * 
	 * @returns {void}
	 */
	#disableOuterSubmitButtons() {
		if (this.form.id == "") return;
		const buttons = document.querySelectorAll(`button[form=${this.form.id}]`);
		buttons.forEach((button) => {
			button.classList.add(this.isDisabledClass);
		});
	}

	/**
	 * Enables all submit buttons located inside the form.
	 * 
	 * @returns {void}
	 */
	#enableInnerSubmitButtons() {
		const buttons = this.form.querySelectorAll("button[type=submit]");
		buttons.forEach((button) => {
			button.classList.remove(this.isDisabledClass);
		});
	}

	/**
	 * Enables all submit buttons located outside the form.
	 * 
	 * @returns {void}
	 */
	#enableOuterSubmitButtons() {
		if (this.form.id == "") return;
		const buttons = document.querySelectorAll(`button[form=${this.form.id}]`);
		buttons.forEach((button) => {
			button.classList.remove(this.isDisabledClass);
		});
	}

	/**
	 * Adds event listeners related to the validator.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.form.addEventListener("submit", this);
		this.form.addEventListener("input", this);
		window.addEventListener("pagehide", this);
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
				if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || HTMLTextAreaElement) {
					this.validateInput(event.target);
				}
				break;
			case "submit":
				if (event.target == this.form) {
					if (!this.form.checkValidity()) {
						if (!this.validateAllInputs()) {
							event.preventDefault();
						}
					} else {
						this.disableSubmitButtons();
						if (typeof(this.submitCallback) == "function") this.submitCallback();
					}
				} 
				break;
			case "pagehide":
				this.enableSubmitButtons();
				break;
		}
	}
};

export { Validator };