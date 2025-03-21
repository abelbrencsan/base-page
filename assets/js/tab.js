/**
 * Tab
 * This class is designed to create responsive tabbed content.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Tab {

	/**
	 * Represents the wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * Represents a collection of nodes that includes the triggers for the tab.
	 * 
	 * @type {NodeList}
	 */
	triggers;

	/**
	 * Represents a collection of nodes that includes the panels for the tab.
	 * 
	 * @type {NodeList}
	 */
	panels;

	/**
	 * The index of the selected tab.
	 * 
	 * @type {number}
	 */
	index = 0;

	/**
	 * The class added to the selected tab trigger and panel.
	 * 
	 * @type {string}
	 */
	isActiveClass = "is-active";

	/**
	 * The class added to the wrapper after the tab has been initialized.
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
	 * Callback function that is called after the tab has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a tab.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {NodeList} options.triggers
	 * @param {NodeList} options.panels
	 * @param {number} options.index
	 * @param {string} options.isActiveClass
	 * @param {string} options.isInitializedClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
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
	 * @param {number} index
	 * @returns {void}
	 */
	select(index) {
		this.index = this.#getValidIndex(index);		
		this.triggers.forEach((_trigger, index) => {
			if (index !== this.index) {
				this.#setInactive(index);
			}
		});
		this.#setActive(this.index);
	}

	/**
	 * Destroys the tab.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.triggers.forEach((_trigger, index) => {
			this.#reset(index);
		});
		this.wrapper.classList.remove(this.isInitializedClass);
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Checks whether the specified index is valid and returns a valid index if it is not.
	 * 
	 * @param {number} index
	 * @returns {number}
	 */
	#getValidIndex(index) {
		if (this.triggers.length - 1 < index) return 0;
		if (index < 0) return this.triggers.length - 1;
		return index;
	}

	/**
	 * Sets the attributes and classes of the item at the specified index as active.
	 * 
	 * @param {number} index
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
	 * @param {number} index
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
	 * Resets the attributes and classes of the item at the specified index.
	 * 
	 * @param {number} index
	 * @returns {void}
	 */
	#reset(index) {
		this.triggers[index].classList.remove(this.isActiveClass);
		this.panels[index].classList.remove(this.isActiveClass);
		this.triggers[index].removeAttribute("aria-selected");
		this.triggers[index].removeAttribute("tabindex");
		this.panels[index].removeAttribute("aria-hidden");
		this.panels[index].removeAttribute("tabindex");
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
	 * Remove event listeners related to the tab.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.wrapper.removeEventListener("keydown", this);
		this.triggers.forEach((trigger) => {
			trigger.removeEventListener("click", this);
		});
	}

	/**
	 * Executes after a key is pressed.
	 * Selects the previous tab on left arrow key press.
	 * Selects the next tab on left arrow key press.
	 * 
	 * @param {Event} event
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
	 * Handle events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "click":
				this.triggers.forEach((trigger, index) => {
					if (trigger === event.target) {
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