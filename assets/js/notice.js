/**
 * Notice
 * This class is designed to handle dismissible notices.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Notice {

	/**
	 * The wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The button element that dismisses the notice.
	 * 
	 * @type {HTMLButtonElement}
	 */
	dismissButton;

	/**
	 * The class that is added to the notice element when it starts to be dismissed.
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
	 * Creates a notice.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element.
	 * @param {HTMLButtonElement} options.dismissButton - The button element that dismisses the notice.
	 * @param {string} options.isDismissingClass - The class that is added to the notice element when it starts to be dismissed.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the notice has been initialized.
	 * @param {function():void|null} options.isDismissedCallback - Callback function that is called after the notice has been dismissed.
	 * @returns {Notice}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Notice \"wrapper\" must be an `HTMLElement`";
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
		this.wrapper.classList.add(this.isDismissingClass);
	}

	/**
	 * Executes after the dismissing transition has ended.
	 * Remove the dialog.
	 * 
	 * @returns {void}
	 */
	isDismissed() {
		this.#removeEvents();
		this.wrapper.remove();
		if (typeof(this.isDismissedCallback) == "function") this.isDismissedCallback();
	}


	/**
	 * Adds event listeners related to the notice.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.dismissButton.addEventListener("click", this);
		this.wrapper.addEventListener("transitionend", this);
	}

	/**
	 * Removes event listeners related to the notice.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.dismissButton.removeEventListener("click", this);
		this.wrapper.removeEventListener("transitionend", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
				if (this.wrapper == event.target) {
					this.isDismissed();
				}
				break;
		}
	}
}

export { Notice };