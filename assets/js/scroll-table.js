import { Glider } from "./glider.js";

/**
 * Scroll Table
 * This class is designed to create multi-column response lists with headers synchronized on scroll.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class ScrollTable {

	/**
	 * The wrapper element that contains the header and body elements.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The header element whose scroll position is synchronized with the body scroll.
	 * 
	 * @type {HTMLElement}
	 */
	header;

	/**
	 * The body element whose scroll position synchronizes with the header.
	 * 
	 * @type {HTMLElement}
	 */
	body;

	/**
	 * The trigger element that scrolls the body backward when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	prevTrigger = null;

	/**
	 * The trigger element that scrolls the body forward when clicked.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	nextTrigger = null;
	
	/**
	 * Callback function that is called after the scroll table has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * The glider used for backward and forward scrolling.
	 * 
	 * @type {Glider|null}
	 */
	glider = null;

	/**
	 * Creates a scroll table.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element that contains the header and body elements.
	 * @param {HTMLElement} options.header - The header element whose scroll position is synchronized with the body scroll.
	 * @param {HTMLElement} options.body - The body element whose scroll position synchronizes with the header.
	 * @param {HTMLButtonElement|null} options.prevTrigger - The trigger element that scrolls the body backward when clicked.
	 * @param {HTMLButtonElement|null} options.nextTrigger - The trigger element that scrolls the body forward when clicked.
	 * @param {function():void} options.initCallback - Callback function that is called after the scroll table has been initialized.
	 * @returns {ScrollTable}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Scroll table \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.header instanceof HTMLElement)) {
			throw "Scroll table \"header\" must be an `HTMLElement`";
		}
		if (!(options.body instanceof HTMLElement)) {
			throw "Scroll table \"body\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the scroll table
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#initGlider();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Synchronizes the header scroll position with the body scroll position.
	 * 
	 * @returns {void}
	 */
	syncHeader() {
		this.header.scrollLeft = this.body.scrollLeft;
	}

	/**
	 * Initializes the glider used for backward and forward scrolling.
	 * 
	 * @returns {void}
	 */
	#initGlider() {
		if (this.prevTrigger === null || this.nextTrigger === null) return;
		this.glider = new Glider({
			wrapper: this.wrapper,
			viewport: this.body,
			prevTrigger: this.prevTrigger,
			nextTrigger: this.nextTrigger,
			items: Array.from(this.body.children),
			hasRewind: false
		});
	}

	/**
	 * Adds event listeners related to the scroll table.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.body.addEventListener("scroll", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "scroll":
				this.syncHeader();
		}
	}
}

export { ScrollTable };