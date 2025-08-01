/**
 * Autocomplete
 * This class is designed to provide suggestions for text inputs.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Autocomplete {

	/**
	 * Represents an input element to which the suggestions belong.
	 * 
	 * @type {HTMLInputElement}
	 */
	input;

	/**
	 * The ID of the list element to which suggestions are appended.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * A function that is called to retrieve the available suggestions.
	 * 
	 * @type {function(string,function(Array<string>)):void}
	 */
	getSuggestions;

	/**
	 * A function that is called to handle how the suggestion is rendered.
	 * 
	 * @type {function(any,string):string}
	 */
	renderItem;

	/**
	 * Function that is called to handle how the selected suggestions appears in the input.
	 * 
	 * @type {function(any,string):string}
	 */
	renderInputValue;

	/**
	 * The minimum number of characters required before the suggestions appear.
	 * 
	 * @type {number}
	 */
	minChars = 1;

	/**
	 * The delay before `getSuggestions` is called to retrieve the available suggestions.
	 * 
	 * @type {number}
	 */
	delay = 250;

	/**
	 * The maximum number of suggestions to render.
	 * 
	 * @type {number|null}
	 */
	maxSuggestions = null;

	/**
	 * Classes added to the list element to which suggestions are appended.
	 * 
	 * @type {Array<string>}
	 */
	listClasses = ["autocomplete"];

	/**
	 * Classes added to the list item where a suggestion is rendered.
	 * 
	 * @type {Array<string>}
	 */
	itemClasses = [];

	/**
	 * The class added to the list element when the autocomplete is open.
	 * 
	 * @type {string}
	 */
	isOpenClass = "is-open";

	/**
	 * The class added to the input element when it has an open autocomplete.
	 * 
	 * @type {string}
	 */
	hasOpenAutocompleteClass = "has-open-autocomplete";

	/**
	 * The class added to the list item when it is highlighted.
	 * 
	 * @type {string}
	 */
	isHighlightedClass = "is-highlighted";

	/**
	 * Callback function that is called after the autocomplete has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the autocomplete is opened.
	 * 
	 * @type {function():void|null}
	 */
	openCallback = null;

	/**
	 * Callback function that is called after the autocomplete is closed.
	 * 
	 * @type {function():void|null}
	 */
	closeCallback = null;

	/**
	 * Callback function that is called after a suggestion is selected.
	 * 
	 * @type {function(any):void|null}
	 */
	selectCallback = null;

	/**
	 * Callback function that is called after the autocomplete has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Represents an HTML list to which suggestions are appended.
	 * 
	 * @type {HTMLUListElement|null}
	 */
	list = null;

	/**
	 * The ID of the timeout created for the delay before `getSuggestions` is called.
	 * 
	 * @type {number|null}
	 */
	timeoutId = null;

	/**
	 * The suggestions from which the list items are rendered.
	 * 
	 * @type {Array<any>}
	 */
	suggestions = [];

	/**
	 * The index of the highlighted suggestion.
	 * 
	 * @type {number|null}
	 */
	highlightIndex = null;

	/**
	 * Checks whether the autocomplete is open.
	 * 
	 * @type {boolean}
	 */
	isOpen = false;

	/**
	 * Creates an autocomplete.
	 * 
	 * @param {Object} options
	 * @param {HTMLInputElement} options.input
	 * @param {function(string,function(Array<string>)):void} options.getSuggestions
	 * @param {function(any,string):string} options.renderItem
	 * @param {function(any,string):string} options.renderInputValue
	 * @param {number} options.minChars
	 * @param {number} options.delay
	 * @param {number|null} options.maxSuggestions
	 * @param {Array<string>} options.listClasses
	 * @param {Array<string>} options.itemClasses
	 * @param {string} options.isOpenClass
	 * @param {string} options.hasOpenAutocompleteClass
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.openCallback
	 * @param {function():void} options.closeCallback
	 * @param {function(any):void} options.selectCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {Autocomplete}
	 */
	constructor(options) {

		// Test required options
		if (!(options.input instanceof HTMLInputElement)) {
			throw "Autocomplete \"input\" must be an `HTMLInputElement`";
		}
		if (typeof options.id !== "string") {
			throw "Autocomplete \"id\" must be a string";
		}
		if (!(options.getSuggestions instanceof Function)) {
			throw "Autocomplete \"getSuggestions\" must be a `Function`";
		}
		if (!(options.renderItem instanceof Function)) {
			throw "Autocomplete \"renderItem\" must be a `Function`";
		}
		if (!(options.renderInputValue instanceof Function)) {
			throw "Autocomplete \"renderInputValue\" must be a `Function`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the autocomplete
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#createList();
		this.#initInputAttributes();
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the autocomplete.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeEvents();
		this.#removeInputAttributes();
		this.#destroyList();
		this.timeoutId = null;
		this.suggestions = [];
		this.highlightIndex = null;
		this.isOpen = false;
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Displays the suggestions.
	 * 
	 * @returns {void}
	 */
	#show() {
		clearTimeout(this.timeoutId);
		if (this.input.value.length < this.minChars) {
			this.#hide();
		}
		else {
			this.timeoutId = setTimeout(() => {
				const currentTimeout = this.timeoutId;
				this.getSuggestions(this.input.value, (suggestions) => {
					if (currentTimeout == this.timeoutId) {
						if (this.maxSuggestions) {
							suggestions = suggestions.splice(0,this.maxSuggestions);
						}
						this.#createItems(suggestions);
						if (this.suggestions.length) {
							this.#open();
						} else {
							this.#hide();
						}

					}
				});
			}, this.delay);
		}
	}

	/**
	 * Hides the suggestions.
	 * 
	 * @returns {void}
	 */
	#hide() {
		this.#removeItems();
		this.#close();
	}

	/**
	 * Creates the items from the specified suggestions and appends them to the list.
	 * 
	 * @param {Array<any>} suggestions
	 * @returns {void}
	 */
	#createItems(suggestions) {
		this.#removeItems();
		this.suggestions = suggestions;
		if (this.input.value.length >= this.minChars) {
			suggestions.forEach((suggestion, index) => {
				if (this.list) {
					let item = document.createElement("li");
					item.id = `${this.id}-option-${index + 1}`;
					item.classList.add(...this.itemClasses);
					item.setAttribute("tabindex", "-1");
					item.setAttribute("aria-selected", "false");
					item.setAttribute("role", "option");
					item.innerHTML = this.renderItem(suggestion, this.input.value);
					this.list.appendChild(item);
				}
			});
		}
	}

	/**
	 * Removes the items from the list.
	 * 
	 * @returns {void}
	 */
	#removeItems() {
		if (!this.list) return;
		while (this.list.lastChild) {
			this.list.removeChild(this.list.lastChild);
		}
		this.highlightIndex = null;
		this.input.removeAttribute("aria-activedescendant");
		this.suggestions = [];
		this.#setScrollPositions();
	}

	/**
	 * Opens the autocomplete.
	 * 
	 * @returns {void}
	 */
	#open() {
		if (!this.list) return;
		this.list.classList.add(this.isOpenClass);
		this.input.classList.add(this.hasOpenAutocompleteClass);
		this.input.setAttribute("aria-expanded", "true");
		this.isOpen = true;
		if (this.openCallback) this.openCallback.call(this);
	}

	/**
	 * Closes the autocomplete.
	 * 
	 * @returns {void}
	 */
	#close() {
		if (!this.list) return;
		this.list.classList.remove(this.isOpenClass);
		this.input.classList.remove(this.hasOpenAutocompleteClass);
		this.input.setAttribute("aria-expanded", "false");
		this.isOpen = false;
		if (this.closeCallback) this.closeCallback.call(this);
	}

	/**
	 * Highlights the previous item in the list.
	 * 
	 * @returns {void}
	 */
	#highlightPrevItem() {
		if (this.highlightIndex === null) {
			this.highlightIndex = this.suggestions.length - 1;
		} else if (this.highlightIndex <= 0) {
			this.highlightIndex = null;
		} else {
			this.highlightIndex--;
		}
		this.#updateHighlights();
		this.#setScrollPositions();
	}

	/**
	 * Highlights the next item in the list.
	 * 
	 * @returns {void}
	 */
	#highlightNextItem() {
		if (this.highlightIndex === null) {
			this.highlightIndex = 0;
		} else if (this.highlightIndex >= this.suggestions.length - 1) {
			this.highlightIndex = null;
		} else {
			this.highlightIndex++;
		}
		this.#updateHighlights();
		this.#setScrollPositions();
	}

	/**
	 * Selects the highlighted item.
	 * 
	 * @returns {void}
	 */
	#selectHighlightedItem() {
		if (this.highlightIndex !== null && this.highlightIndex <= this.suggestions.length - 1) {
			this.#selectSuggestion(this.suggestions[this.highlightIndex]);
			this.highlightIndex = null;
		}
		this.#updateHighlights();
		this.#hide();
	}

	/**
	 * Selects the specified suggestion.
	 * 
	 * @param {any} suggestion
	 * @returns {void}
	 */
	#selectSuggestion(suggestion) {
		this.input.value = this.renderInputValue(suggestion, this.input.value);
		if (typeof(this.selectCallback) == "function") this.selectCallback(suggestion);
	}

	/**
	 * Updates the highlights.
	 * 
	 * @returns {void}
	 */
	#updateHighlights() {
		if (!this.list) return;
		this.input.removeAttribute("aria-activedescendant");
		this.list.childNodes.forEach((item, index) => {
			item.classList.remove(this.isHighlightedClass);
			item.setAttribute("aria-selected", "false");
			if (this.highlightIndex == index) {
				item.classList.add(this.isHighlightedClass);
				item.setAttribute("aria-selected", "true");
				this.input.setAttribute("aria-activedescendant", item.id);
			}
		});
	}

	/**
	 * Sets the scroll position of the list to ensure the highlighted item remains visible.
	 * 
	 * @returns {void}
	 */
	#setScrollPositions() {
		if (!this.list) return;
		if (this.highlightIndex === null) {
			this.list.scrollTop = 0;
		}
		else if (this.highlightIndex <= this.list.childNodes.length - 1) {
			let item = this.list.childNodes[this.highlightIndex];
			if (item.offsetTop + item.offsetHeight > this.list.scrollTop + this.list.offsetHeight) {
				this.list.scrollTop = (item.offsetTop - this.list.offsetHeight) + item.offsetHeight;
			}
			else if (item.offsetTop < this.list.scrollTop) {
				this.list.scrollTop = item.offsetTop;
			}
		}
	}

	/**
	 * Creates the list to which suggestions are appended.
	 * 
	 * @returns {void}
	 */
	#createList() {
		this.list = document.createElement("ul");
		this.list.id = this.id;
		this.list.classList.add(...this.listClasses);
		this.list.setAttribute("role", "listbox");
		this.input.parentNode.appendChild(this.list);
	}

	/**
	 * Destroys the list to which suggestions are appended.
	 * 
	 * @returns {void}
	 */
	#destroyList() {
		this.list.remove();
		this.list = [];
	}

	/**
	 * Initializes the attributes of the input element.
	 * 
	 * @returns {void}
	 */
	#initInputAttributes() {
		this.input.setAttribute("autocomplete", "off");
		this.input.setAttribute("autocorrect", "off");
		this.input.setAttribute("autocapitalize", "off");
		this.input.setAttribute("aria-expanded", "false");
		this.input.setAttribute("aria-controls", this.id);
		this.input.setAttribute("role", "combobox");
		this.input.setAttribute("aria-autocomplete", "both");
	}

	/**
	 * Removes the attributes from the input element.
	 * 
	 * @returns {void}
	 */
	#removeInputAttributes() {
		this.input.removeAttribute("autocomplete");
		this.input.removeAttribute("autocorrect");
		this.input.removeAttribute("autocapitalize");
		this.input.removeAttribute("aria-expanded");
		this.input.removeAttribute("aria-controls");
		this.input.removeAttribute("role");
		this.input.removeAttribute("aria-autocomplete");
	}

	/**
	 * Adds event listeners related to the autocomplete.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		if (this.list) {
			this.list.addEventListener("mousedown", this);
		}
		this.input.addEventListener("focus", this);
		this.input.addEventListener("blur", this);
		this.input.addEventListener("input", this);
		this.input.addEventListener("keydown", this);
		this.input.addEventListener("keyup", this);
	}

	/**
	 * Remove event listeners related to the autocomplete.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		if (this.list) {
			this.list.removeEventListener("mousedown", this);
		}
		this.input.removeEventListener("focus", this);
		this.input.removeEventListener("blur", this);
		this.input.removeEventListener("input", this);
		this.input.removeEventListener("keydown", this);
		this.input.removeEventListener("keyup", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "mousedown":
				this.#onListMouseDown(event);
				break;
			case "focus":
				this.#show();
				break;
			case "blur":
				this.#hide();
				break;
			case "input":
				this.#show();
				break;
			case "keydown":
				if (event.key == "ArrowUp" && this.isOpen) {
					event.preventDefault();
					this.#highlightPrevItem();
				}
				if (event.key == "ArrowDown" && this.isOpen) {
					event.preventDefault();
					this.#highlightNextItem();
				}
				if (event.key == "Enter" && this.highlightIndex !== null) {
					event.preventDefault();
					this.#selectHighlightedItem();
				}
				break;
			case "keyup":
				if (event.key == 'Escape') {
					this.#hide();
				}
				break;
		}
	}

	/**
	 * Executes when the mouse is pressed while the pointer is over the list element.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#onListMouseDown(event) {
		this.list.childNodes.forEach((item, index) => {
			if (item.contains(event.target)) {
				this.highlightIndex = index;
				this.#selectHighlightedItem();
			}
		});
	}
}

export { Autocomplete };