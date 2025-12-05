import { Dialog } from "../js/dialog.js";
import { Glider } from "../js/glider.js";

/**
 * Slideshow
 * This class is designed to create image slideshows within a dialog.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Slideshow {

	/**
	 * The source of the slideshow dialog that is loaded.
	 * 
	 * @type {string}
	 */
	source;

	/**
	 * The HTML content that is appended to the close button of the dialog.
	 * 
	 * @type {string}
	 */
	closeButtonHTML = "";

	/**
	 * The label that is added to the close button of the dialog.
	 * 
	 * @type {string|null}
	 */
	closeButtonLabel = "Close";

	/**
	 * Represents the wrapper element of the slideshow glider.
	 * 
	 * @type {HTMLElement}
	 */
	gliderWrapper;

	/**
	 * Represents the viewport element of the slideshow glider in which the items glide.
	 * 
	 * @type {HTMLElement}
	 */
	gliderViewport;

	/**
	 * Represents a button that scrolls the slideshow glider to the previous item.
	 * 
	 * @type {HTMLButtonElement}
	 */
	gliderPrevTrigger;

	/**
	 * Represents a button that scrolls the slideshow glider to the next item.
	 * 
	 * @type {HTMLButtonElement}
	 */
	gliderNextTrigger;

	/**
	 * List of items inside the slideshow glider viewport.
	 * 
	 * @type {HTMLElement[]}
	 */
	gliderItems;

	/**
	 * List of slideshow triggers that open the dialog on click.
	 * 
	 * @type {SlideshowTrigger[]}
	 */
	triggers = [];

	/**
	 * Custom classes to be added to the slideshow dialog.
	 * 
	 * @type {string[]}
	 */
	customClasses = [];

	/**
	 * A glider that allows the images to scroll vertically inside the slideshow.
	 * 
	 * @type {Glider|null}
	 */
	glider = null;

	/**
	 * A dialog that handles opening and closing the slideshow.
	 * 
	 * @type {Dialog|null}
	 */
	dialog = null;

	/**
	 * Callback function that is called after the slideshow has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the slideshow has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a slideshow.
	 *
	 * @param {Object} options
	 * @param {string} options.source
	 * @param {string} options.closeButtonHTML
	 * @param {string|null} options.closeButtonLabel
	 * @param {HTMLElement} options.gliderWrapper
	 * @param {HTMLElement} options.gliderViewport
	 * @param {HTMLButtonElement} options.gliderPrevTrigger
	 * @param {HTMLButtonElement} options.gliderNextTrigger
	 * @param {HTMLElement[]} options.gliderItems
	 * @param {SlideshowTrigger[]} options.triggers
	 * @param {string[]} options.customClasses
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Slideshow}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.source !== "string") {
			throw "Slideshow \"source\" option must be a string";
		}
		if (!(options.gliderWrapper instanceof HTMLElement)) {
			throw "Slideshow \"gliderWrapper\" must be an `HTMLElement`";
		}
		if (!(options.gliderViewport instanceof HTMLElement)) {
			throw "Slideshow \"gliderViewport\" must be an `HTMLElement`";
		}
		if (!(options.gliderPrevTrigger instanceof HTMLButtonElement)) {
			throw "Slideshow \"gliderPrevTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.gliderNextTrigger instanceof HTMLButtonElement)) {
			throw "Slideshow \"gliderNextTrigger\" must be an `HTMLButtonElement`";
		}
		if (!(options.gliderItems instanceof Array)) {
			throw 'Slideshow \"gliderItems\" must be an `array`';
		}
		options.gliderItems.forEach((gliderItem) => {
			if (!(gliderItem instanceof HTMLElement)) {
				throw 'Slideshow glider item must be an `HTMLElement`';
			}
		});

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the slideshow
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#createGlider();
		this.#createDialog();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Adds the specified element as a trigger.
	 * 
	 * @param {SlideshowTrigger} trigger
	 * @returns {void}
	 */
	addTrigger(trigger) {
		trigger.elem.addEventListener("click", this);
		this.triggers.push(trigger);
	}

	/**
	 * Scrolls the slideshow glider to the item with the specified index.
	 * 
	 * @param {number} index
	 * @param {behavior} string
	 * @returns {void}
	 */
	scrollToItem(index, behavior = "instant") {
		if (!this.glider) return;
		this.glider.scrollToItem(index, behavior);
	}
	
	/**
	 * Destroys the slideshow.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (this.glider) this.glider.destroy();
		if (this.dialog) this.dialog.destroy();
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Creates the glider that allows the images to scroll vertically inside the slideshow.
	 * 
	 * @returns {void}
	 */
	#createGlider() {
		this.glider = new Glider({
			wrapper: this.gliderWrapper,
			viewport: this.gliderViewport,
			prevTrigger: this.gliderPrevTrigger,
			nextTrigger: this.gliderNextTrigger,
			items: this.gliderItems,
			hasRewind: false
		});
	}

	/**
	 * Creates the dialog that handles opening and closing the slideshow.
	 * 
	 * @returns {void}
	 */
	#createDialog() {
		this.dialog = new Dialog({
			type: "dialog",
			source: this.source,
			customClasses: this.customClasses,
			closeButtonHTML: this.closeButtonHTML,
			closeButtonLabel: this.closeButtonLabel,
		});
	}

	/**
	 * Adds event listeners related to the slideshow.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.triggers.forEach((trigger) => {
			trigger.elem.addEventListener("click", this);
		});
	}

	/**
	 * Removes event listeners related to the slideshow.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.triggers.forEach((trigger) => {
			trigger.elem.removeEventListener("click", this);
		});
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
				this.triggers.forEach((trigger) => {
					if (trigger.elem.contains(event.target)) {
						event.preventDefault();
						this.dialog.open();
						this.scrollToItem(trigger.index);
					}
				});
				break;
		}
	}
}

/**
 * Slideshow trigger
 * This class is designed to create triggers for slideshows.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class SlideshowTrigger {

	/**
	 * Represents a trigger element that opens the slideshow dialog when clicked.
	 * 
	 * @type {HTMLElement}
	 */
	elem;

	/**
	 * The index of the slideshow glider item to which the glider scrolls when the trigger is clicked.
	 * 
	 * @type {number}
	 */
	index = 0;

	/**
	 * Creates a slideshow trigger.
	 * 
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.elem
	 * @param {number} options.index
	 * @returns {SlideshowTrigger}
	 */
	constructor(options) {

		// Test required options
		if (!(options.elem instanceof HTMLElement)) {
			throw "Slideshow trigger \"elem\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}
}

export { Slideshow, SlideshowTrigger };