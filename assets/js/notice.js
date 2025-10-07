/**
 * Notice
 * This class is designed to make notices dismissible.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Notice {

	/**
	 * Represents a notice element.
	 * 
	 * @type {HTMLElement}
	 */
	element;

	/**
	 * Represents a button that dismisses the notice.
	 * 
	 * @type {HTMLButtonElement}
	 */
	dismissButton;

	/**
	 * The class added to the notice element when it starts to be dismissed.
	 * 
	 * @type {string}
	 */
	isDismissingClass = "is-dismissing";

	/**
	 * Callback function that is called after the notice has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the notice has been dismissed.
	 * 
	 * @type {function():void|null}
	 */
	isDismissedCallback = null;

	/**
	 * Callback function that is called after the notice has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a notice.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.element
	 * @param {HTMLButtonElement} options.dismissButton
	 * @param {string} options.isDismissingClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isDismissedCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Notice}
	 */
	constructor(options) {

		// Test required options
		if (!(options.element instanceof HTMLElement)) {
			throw "Notice \"element\" must be an `HTMLElement`";
		}
		if (!(options.dismissButton instanceof HTMLButtonElement)) {
			throw "Notice \"dismissButton\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the notice
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Dismisses the notice.
	 * 
	 * @returns {void}
	 */
	dismiss() {
		this.element.classList.add(this.isDismissingClass);
	}

	/**
	 * Executes after the dismissing transition has ended.
	 * Remove the dialog.
	 * 
	 * @returns {void}
	 */
	isDismissed() {
		this.#removeEvents();
		this.element.remove();
		if (typeof(this.isDismissedCallback) == "function") this.isDismissedCallback();
	}

	/**
	 * Destroys the notice.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Adds event listeners related to the notice.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.dismissButton.addEventListener("click", this);
		this.element.addEventListener("transitionend", this);
	}

	/**
	 * Removes event listeners related to the notice.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.dismissButton.removeEventListener("click", this);
		this.element.removeEventListener("transitionend", this);
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
				if (this.dismissButton.contains(event.target)) {
					this.dismiss();
				}
				break;
			case "transitionend":
				if (this.element == event.target) {
					this.isDismissed();
				}
				break;
		}
	}
}

export { Notice };