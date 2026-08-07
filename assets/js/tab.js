/**
 * Tab
 * This class is designed to create responsive tabbed content.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tab {

	/**
	 * The wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * A collection of nodes that includes the triggers for the tab.
	 * 
	 * @type {NodeList}
	 */
	triggers;

	/**
	 * A collection of nodes that includes the panels for the tab.
	 * 
	 * @type {NodeList}
	 */
	panels;

	/**
	 * The index of the selected tab item.
	 * 
	 * @type {number}
	 */
	index = 0;

	/**
	 * The class that is added to the selected tab trigger and panel.
	 * 
	 * @type {string}
	 */
	isActiveClass = "is-active";

	/**
	 * The class that is added to the wrapper after the tab has been initialized.
	 * 
	 * @type {string}
	 */
	isInitializedClass = "is-initialized";

	/**
	 * Callback function that is called after the tab has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Creates a tab.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper - The wrapper element.
	 * @param {NodeList} options.triggers - A collection of nodes that includes the triggers for the tab.
	 * @param {NodeList} options.panels - A collection of nodes that includes the panels for the tab.
	 * @param {number} options.index - The index of the selected tab item.
	 * @param {string} options.isActiveClass - The class that is added to the selected tab trigger and panel.
	 * @param {string} options.isInitializedClass - The class that is added to the wrapper after the tab has been initialized.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the tab has been initialized.
	 * 
	 * @returns {Tab}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Tab \"wrapper\" must be an `HTMLElement`";
		}
		if (!(options.triggers instanceof NodeList)) {
			throw "Tab \"triggers\" must be an `NodeList`";
		}
		if (!(options.panels instanceof NodeList)) {
			throw "Tab \"panels\" must be an `NodeList`";
		}
		if (options.triggers.length !== options.panels.length) {
			throw "Tab \"triggers\" and \"panels\" must contain the same number of elements";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the tab
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.select(this.index);
		this.wrapper.classList.add(this.isInitializedClass);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Selects the tab item at the specified index.
	 * 
	 * @param {number} index - The index to be selected.
	 * @returns {void}
	 */
	select(index) {
		this.index = this.#getValidIndex(index);		
		this.triggers.forEach((trigger, index) => {
			if (index !== this.index) {
				this.#setInactive(index);
			}
		});
		this.#setActive(this.index);
	}

	/**
	 * Checks whether the specified index is valid and returns a valid index if it is not.
	 * 
	 * @param {number} index - The index to be checked.
	 * @returns {number}
	 */
	#getValidIndex(index) {
		if (this.triggers.length - 1 < index) return 0;
		if (index < 0) return this.triggers.length - 1;
		return index;
	}

	/**
	 * Sets the attributes and classes of the tab item at the specified index as active.
	 * 
	 * @param {number} index - The index to be set as active.
	 * @returns {void}
	 */
	#setActive(index) {
		this.triggers[index].classList.add(this.isActiveClass);
		this.panels[index].classList.add(this.isActiveClass);
		this.triggers[index].setAttribute("aria-selected", true);
		this.triggers[index].setAttribute("tabindex", 0);
		this.panels[index].setAttribute("aria-hidden", false);
		this.panels[index].setAttribute("tabindex", 0);
	}

	/**
	 * Sets the inactive attributes and classes of the item at the specified index.
	 * 
	 * @param {number} index - The index to be set as inactive.
	 * @returns {void}
	 */
	#setInactive(index) {
		this.triggers[index].classList.remove(this.isActiveClass);
		this.panels[index].classList.remove(this.isActiveClass);
		this.triggers[index].setAttribute("aria-selected", false);
		this.triggers[index].setAttribute("tabindex", -1);
		this.panels[index].setAttribute("aria-hidden", true);
		this.panels[index].setAttribute("tabindex", -1);
	}


	/**
	 * Adds event listeners related to the tab.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("keydown", this);
		this.triggers.forEach((trigger) => {
			trigger.addEventListener("click", this);
		});
	}

	/**
	 * Executes after a key is pressed.
	 * Selects the previous tab on left arrow key press.
	 * Selects the next tab on left arrow key press.
	 * 
	 * @param {string} key - The value of the pressed key.
	 * @returns {void}
	 */
	#isKeyPressed(key) {
		switch (key) {
			case "ArrowLeft":
				this.select(this.index - 1);
				this.triggers[this.index].focus();
				break;
			case "ArrowRight":
				this.select(this.index + 1);
				this.triggers[this.index].focus();
				break;
		}
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
				this.triggers.forEach((trigger, index) => {
					if (trigger.contains(event.target)) {
						this.select(index);
					}
				});
				break;
			case "keydown":
				this.#isKeyPressed(event.key);
				break;
		}
	}
}

export { Tab };