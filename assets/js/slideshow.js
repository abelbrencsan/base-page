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
	 * The source of the slideshow dialog to be loaded.
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
	 * The wrapper element of the slideshow glider.
	 * 
	 * @type {HTMLElement}
	 */
	gliderWrapper;

	/**
	 * The viewport element of the slideshow glider within which the items glide.
	 * 
	 * @type {HTMLElement}
	 */
	gliderViewport;

	/**
	 * The trigger that scrolls the slideshow glider to the previous item when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	gliderPrevTrigger;

	/**
	 * The trigger that scrolls the slideshow glider to the next item when clicked.
	 * 
	 * @type {HTMLButtonElement}
	 */
	gliderNextTrigger;

	/**
	 * An array of items that are gliding within the slideshow glider viewport.
	 * 
	 * @type {HTMLElement[]}
	 */
	gliderItems;

	/**
	 * An array of slideshow triggers that open the dialog on click.
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
	 * Callback function that is called after the slideshow has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * The glider that allows the images to scroll vertically inside the slideshow.
	 * 
	 * @type {Glider|null}
	 */
	glider = null;

	/**
	 * The dialog that handles opening and closing the slideshow.
	 * 
	 * @type {Dialog|null}
	 */
	dialog = null;

	/**
	 * Creates a slideshow.
	 *
	 * @param {Object} options
	 * @param {string} options.source - The source of the slideshow dialog to be loaded.
	 * @param {string} options.closeButtonHTML - The HTML content that is appended to the close button of the dialog.
	 * @param {string|null} options.closeButtonLabel - The label that is added to the close button of the dialog.
	 * @param {HTMLElement} options.gliderWrapper - The wrapper element of the slideshow glider.
	 * @param {HTMLElement} options.gliderViewport - The viewport element of the slideshow glider within which the items glide.
	 * @param {HTMLButtonElement} options.gliderPrevTrigger - The trigger that scrolls the slideshow glider to the previous item when clicked.
	 * @param {HTMLButtonElement} options.gliderNextTrigger - The trigger that scrolls the slideshow glider to the next item when clicked.
	 * @param {HTMLElement[]} options.gliderItems - An array of items that are gliding within the slideshow glider viewport.
	 * @param {SlideshowTrigger[]} options.triggers - An array of slideshow triggers that open the dialog on click.
	 * @param {string[]} options.customClasses - Custom classes to be added to the slideshow dialog.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the slideshow has been initialized.
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
	 * @param {SlideshowTrigger} trigger - The trigger to be added.
	 * @returns {void}
	 */
	addTrigger(trigger) {
		trigger.elem.addEventListener("click", this);
		this.triggers.push(trigger);
	}

	/**
	 * Scrolls the slideshow glider to the item with the specified index.
	 * 
	 * @param {number} index - The index of the slideshow item to scroll to.
	 * @param {behavior} string - The behavior of the scroll.
	 * @returns {void}
	 */
	scrollToItem(index, behavior = "instant") {
		if (!this.glider) return;
		this.glider.scrollToItem(index, behavior);
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
	 * Handles events.
	 * 
	 * @param {Event} event - The event to be handled.
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
	 * The trigger element that opens the slideshow dialog when clicked.
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
	 * @param {Object} options
	 * @param {HTMLElement} options.elem - The trigger element that opens the slideshow dialog when clicked.
	 * @param {number} options.index - The index of the slideshow glider item to which the glider scrolls when the trigger is clicked.
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