/**
 * Dropdown
 * This class is designed to handle dropdown menus and their interactions.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Dropdown {

	/**
	 * The element that appears when the dropdown is opened.
	 * 
	 * @type {HTMLElement}
	 */
	element;

	/**
	 * The trigger element that opens the dropdown on click.
	 * 
	 * @type {HTMLButtonElement}
	 */
	trigger;

	/**
	 * The close button element that closes the dropdown on click.
	 * 
	 * @type {HTMLButtonElement|null}
	 */
	closeButton = null;

	/**
	 * The class that is added to the dropdown element after it has been opened.
	 * 
	 * @type {string}
	 */
	isOpenedClass = "is-opened";

	/**
	 * The class that is added to the dropdown trigger after it has been opened.
	 * 
	 * @type {string}
	 */
	isActiveClass = "is-active";

	/**
	 * The class that is added to the dropdown's parent element after it has been opened.
	 * 
	 * @type {string}
	 */
	hasOpenedDropdownClass = "has-opened-dropdown";

	/**
	 * Callback function that is called after the dropdown has been initialized.
	 * 
	 * @type {function(Dropdown):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the dropdown has been opened.
	 * 
	 * @type {function(Dropdown):void|null}
	 */
	openCallback = null;

	/**
	 * Callback function that is called after the dropdown has been closed.
	 * 
	 * @type {function(Dropdown):void|null}
	 */
	closeCallback = null;

	/**
	 * Indicates whether the dropdown is opened.
	 * 
	 * @type {boolean}
	 */
	isOpened = false;

	/**
	 * List of opened dropdown items.
	 * 
	 * @type {Dropdown[]}
	 */
	static openedDropdowns = [];

	/**
	 * Number of initialized dropdowns.
	 * 
	 * @type {number}
	 */
	static itemCount = 0;

	/**
	 * Creates a dropdown.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.element - The element that appears when the dropdown is opened.
	 * @param {HTMLButtonElement} options.trigger - The trigger element that opens the dropdown on click.
	 * @param {HTMLButtonElement|null} options.closeButton - The close button element that closes the dropdown on click.
	 * @param {string} options.isOpenedClass - The class that is added to the dropdown element after it has been opened.
	 * @param {string} options.isActiveClass - The class that is added to the dropdown trigger after it has been opened.
	 * @param {string} options.hasOpenedDropdownClass - The class that is added to the dropdown's parent element after it has been opened.
	 * @param {function(Dropdown):void|null} options.initCallback - Callback function that is called after the dropdown has been initialized.
	 * @param {function(Dropdown):void|null} options.openCallback - Callback function that is called after the dropdown has been opened.
	 * @param {function(Dropdown):void|null} options.closeCallback - Callback function that is called after the dropdown has been closed.
	 * @returns {Dropdown}
	 */
	constructor(options) {

		// Test required options
		if (!(options.element instanceof HTMLElement)) {
			throw "Dropdown \"element\" must be an `HTMLElement`";
		}
		if (!(options.trigger instanceof HTMLButtonElement)) {
			throw "Dropdown \"trigger\" must be an `HTMLButtonElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the dropdown
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#setClosedAttributes();
		if (typeof(this.initCallback) == "function") this.initCallback(this);
		Dropdown.itemCount++;
	}

	/**
	 * Toggles the dropdown state: opens the dropdown if it is closed, or closes it if it is open.
	 * 
	 * @returns {void}
	 */
	toggle() {
		if (this.isOpened) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * Opens the dropdown.
	 * 
	 * @returns {void}
	 */
	open() {
		Dropdown.#closeDropdowns(this.element);
		this.#setOpenedAttributes();
		this.isOpened = true;
		this.#addToOpenedDropdowns();
		if (typeof(this.openCallback) == "function") this.openCallback(this);
	}

	/**
	 * Closes the dropdown.
	 * 
	 * @returns {void}
	 */
	close() {
		this.#setClosedAttributes();
		this.isOpened = false;
		this.#removeFromOpenedDropdowns();
		if (this.element.contains(document.activeElement)) {
			this.trigger.focus();
		}
		if (typeof(this.closeCallback) == "function") this.closeCallback(this);
	}

	/**
	 * Sets the attributes of the trigger and dropdown element when the dropdown is closed.
	 * 
	 * @returns {void}
	 */
	#setClosedAttributes() {
		this.trigger.setAttribute("aria-expanded", "false");
		this.element.setAttribute("aria-hidden", "true");
		this.trigger.classList.remove(this.isActiveClass);
		this.element.classList.remove(this.isOpenedClass);
		this.element.parentNode.classList.remove(this.hasOpenedDropdownClass);
	}

	/**
	 * Sets the attributes of the trigger and dropdown element when the dropdown is opened.
	 * 
	 * @returns {void}
	 */
	#setOpenedAttributes() {
		this.trigger.setAttribute("aria-expanded", "true");
		this.element.setAttribute("aria-hidden", "false");
		this.trigger.classList.add(this.isActiveClass);
		this.element.classList.add(this.isOpenedClass);
		this.element.parentNode.classList.add(this.hasOpenedDropdownClass);
	}

	/**
	 * Adds the dropdown to the list of opened dropdowns.
	 * 
	 * @returns {void}
	 */
	#addToOpenedDropdowns() {
		Dropdown.openedDropdowns.push(this);
	}

	/**
	 * Remove the dropdown from the list of opened dropdowns.
	 * 
	 * @returns {void}
	 */
	#removeFromOpenedDropdowns() {
		const index = Dropdown.openedDropdowns.indexOf(this);
		if (index > -1) {
			Dropdown.openedDropdowns.splice(index, 1);
		}
	}

	/**
	 * Adds event listeners related to the dropdown.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		if (Dropdown.itemCount == 0) {
			Dropdown.#addGlobalEvents();
		}
		if (this.closeButton) {
			this.closeButton.addEventListener("click", this);
		}
		this.trigger.addEventListener("click", this);
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
				if (this.trigger.contains(event.target)) {
					this.toggle();
				}
				else if (this.closeButton && this.closeButton.contains(event.target)) {
					this.close();
				}
				break;
		}
	}

	/**
	 * Executes after a key is pressed.
	 * Closes the last opened dropdown on `Escape` key press.
	 * Closes all dropdowns on `Tab` key press that do not include the target element of the event.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	static #isKeyPressed(event) {
		if (event.key == "Escape") {
			if (Dropdown.openedDropdowns.length) {
				Dropdown.openedDropdowns.at(-1).close();
			}
		} else if (event.key == "Tab") {
			Dropdown.#closeDropdowns(event.target);
		}
	}

	/**
	 * Executes after the body is clicked.
	 * Closes dropdowns that do not include the target element of the event.
	 * 
	 * @param {Event} event - The event to be handled.
	 * @returns {void}
	 */
	static #isBodyClicked(event) {
		let isClickedInsideDropdown = false;
		Dropdown.openedDropdowns.forEach((dropdown) => {
			if (dropdown.trigger.contains(event.target) || dropdown.element.contains(event.target)) {
				isClickedInsideDropdown = true;
			}
		});
		if (!isClickedInsideDropdown) {
			Dropdown.#closeDropdowns(event.target);
		}
	}

	/**
	 * Closes dropdowns that do not include the specified excluded target element.
	 * 
	 * @param {HTMLElement} excludedTarget - The target element inside the dropdown that should remain open.
	 * @returns {void}
	 */
	static #closeDropdowns(excludedTarget) {
		let closingDropdowns = [];
		Dropdown.openedDropdowns.forEach((dropdown) => {
			if (!dropdown.trigger.contains(excludedTarget) && !dropdown.element.contains(excludedTarget)) {
				closingDropdowns.push(dropdown);
			}
		});
		closingDropdowns.map((dropdown) => dropdown.close());
	}

	/**
	 * Adds global event listeners related to all dropdown instances.
	 * 
	 * @returns {void}
	 */
	static #addGlobalEvents() {
		document.body.addEventListener("keyup", Dropdown.#isKeyPressed);
		document.body.addEventListener("click", Dropdown.#isBodyClicked);
	}
}

export { Dropdown };