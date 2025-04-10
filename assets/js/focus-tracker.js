/**
 * Focus Tracker
 * This class is designed to detect focus changes that occur through keyboard interactions.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class FocusTracker {

	/**
	 * The class added to the focused element when the user is using the keyboard.
	 * 
	 * @type {string}
	 */
	className = "keyboard-focus";

	/**
	 * Callback function that is called after the focus tracker been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the focus tracker has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Indicates whether the user is using keyboard.
	 * 
	 * @type {boolean}
	 */
	isKeyboardUsed = true;

	/**
	 * Creates a focus tracker.
	 * 
	 * @param {Object} options
	 * @param {string} options.className
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {FocusTracker}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the focus tracker
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the focus tracker.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Detects whether the user is using keyboard.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#detectIsKeyboardUsed(event) {
		this.isKeyboardUsed = (event.type === "keydown");
	}

	/**
	 * Adds a specified class to the target element when focus changes via keyboard interaction.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#addFocus(event) {
		if (this.isKeyboardUsed) {
			event.target.classList.add(this.className);
		}
	}

	/**
	 * Removes a specified class from the target element when focus is lost.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#removeFocus(event) {
		event.target.classList.remove(this.className);
	}

	/**
	 * Adds event listeners related to the focus tracker.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		document.body.addEventListener("keydown", this);
		document.body.addEventListener("mousedown", this);
		document.body.addEventListener("focusin", this);
		document.body.addEventListener("focusout", this);
	}

	/**
	 * Remove event listeners related to the focus tracker.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		document.body.removeEventListener("keydown", this);
		document.body.removeEventListener("mousedown", this);
		document.body.removeEventListener("focusin", this);
		document.body.removeEventListener("focusout", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "keydown":
				this.#detectIsKeyboardUsed(event);
				break;
			case "mousedown":
				this.#detectIsKeyboardUsed(event);
				break;
			case "focusin":
				this.#addFocus(event);
				break;
			case "focusout":
				this.#removeFocus(event);
				break;
		}
	}
}

export { FocusTracker };