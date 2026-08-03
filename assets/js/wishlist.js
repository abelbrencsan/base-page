/**
 * Wishlist
 * This class is designed to add and remove items from a wishlist.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class Wishlist {

	/**
	 * The key name of the local storage where the added items are stored.
	 * 
	 * @type {string|null}
	 */
	storageKeyName = "wishlist";

	/**
	 * Triggers that add or remove their related item from the wishlist on click.
	 * 
	 * @type {{elem:HTMLButtonElement,id:number,data:any}[]}
	 */
	triggers = [];

	/**
	 * The initial data from which the initial items are added to the wishlist (overwrites existing local storage).
	 * 
	 * @type {{id:number,data:any}[]|null}
	 */
	initialData = null;

	/**
	 * The class added to the trigger elements when their related item is added to the wishlist.
	 * 
	 * @type {string}
	 */
	triggerAddedClass = "is-added";

	/**
	 * Callback function that is called after the wishlist has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after an item is added to the wishlist.
	 * 
	 * @type {function(number):void|null}
	 */
	addCallback = null;

	/**
	 * Callback function that is called after an item is removed from the wishlist.
	 * 
	 * @type {function(number):void|null}
	 */
	removeCallback = null;

	/**
	 * Callback function that is called after an item is added to or removed from the wishlist.
	 * 
	 * @type {function(number):void|null}
	 */
	updateCallback = null;

	/**
	 * Callback function that is called after the wishlist has been cleared.
	 * 
	 * @type {function():void|null}
	 */
	clearCallback = null;

	/**
	 * List of items added to the wishlist.
	 * 
	 * @type {WishlistItem[]}
	 */
	items = [];

	/**
	 * Creates a wishlist.
	 * 
	 * @param {Object} options
	 * @param {string|null} options.storageKeyName - The key name of the local storage where the added items are stored.
	 * @param {{elem:HTMLButtonElement,id:number,data:any}[]} options.triggers - Triggers that add or remove their related item from the wishlist on click.
	 * @param {{id:number,data:any}[]|null} options.initialData - The initial data from which the initial items are added to the wishlist (overwrites existing local storage).
	 * @param {string} options.triggerAddedClass - The class added to the trigger elements when their related item is added to the wishlist.
	 * @param {function():void|null} options.initCallback - Callback function that is called after the wishlist has been initialized.
	 * @param {function(number):void|null} options.addCallback - Callback function that is called after an item is added to the wishlist.
	 * @param {function(number):void|null} options.removeCallback - Callback function that is called after an item is removed from the wishlist.
	 * @param {function(number):void|null} options.updateCallback - Callback function that is called after an item is added to or removed from the wishlist.
	 * @param {function():void|null} options.clearCallback - Callback function that is called after the wishlist has been cleared.
	 * @returns {Wishlist}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the wishlist
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		this.#load();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Adds an item to the wishlist.
	 * 
	 * @param {number} id - The ID of the wishlist item.
	 * @param {any} data - Any additional data that belongs to the item.
	 * @param {boolean} skipCallback - Indicates whether to skip callback functions after the item is added.
	 * @returns {void}
	 */
	add(id, data = null, skipCallback = false) {
		if (!this.includes(id)) {
			this.items.push(new WishlistItem({
				id: id,
				data: data
			}));
			this.#saveStorageData();
			this.#updateTriggers();
			if (!skipCallback) {
				if (typeof(this.addCallback) == "function") this.addCallback(id);
				if (typeof(this.updateCallback) == "function") this.updateCallback(id);
			}
		}
	}

	/**
	 * Removes the item with the specified ID from the wishlist.
	 * 
	 * @param {number} id - The ID of the wishlist item.
	 * @param {boolean} skipCallback - Indicates whether to skip callback functions after the item is removed.
	 * @returns {void}
	 */
	remove(id, skipCallback = false) {
		this.items = this.items.filter((item) => item.id != id);
		this.#saveStorageData();
		this.#updateTriggers();
		if (!skipCallback) {
			if (typeof(this.removeCallback) == "function") this.removeCallback(id);
			if (typeof(this.updateCallback) == "function") this.updateCallback(id);
		}	
	}

	/**
	 * Detects whether an item with the specified ID is added to the wishlist.
	 * 
	 * @param {number} id - The ID of the wishlist item.
	 * @returns {boolean} `true` if the item is added to the wishlist; otherwise, `false`.
	 */
	includes(id) {
		return this.items.some((item) => item.id == id);
	}

	/**
	 * Adds or removes an item from the wishlist.
	 * 
	 * @param {number} id - The ID of the wishlist item.
	 * @param {any} data - Any additional data that belongs to the item.
	 * @param {boolean} skipCallback - Indicates whether to skip callback functions after the item is added or removed.
	 * @returns {void}
	 */
	toggle(id, data = null, skipCallback = false) {
		if (this.includes(id)) {
			this.remove(id, skipCallback);
		} else {
			this.add(id, data, skipCallback);
		}
	}

	/**
	 * Retrieves the item with the specified ID from the wishlist.
	 * 
	 * @param {number} id - The ID of the wishlist item.
	 * @returns {WishlistItem|undefined} The found item, or `undefined` if no item is found.
	 */
	get(id) {
		return this.items.find((item) => item.id == id);
	}

	/**
	 * Removes all items from the wishlist.
	 * 
	 * @param {boolean} skipCallback - Indicates whether to skip callback functions after the wishlist has been cleared.
	 * @returns {void}
	 */
	clear(skipCallback = false) {
		this.items = [];
		this.#removeStorageData();
		this.#updateTriggers();
		if (!skipCallback) {
			if (typeof(this.clearCallback) == "function") this.clearCallback();
		}
	}

	/**
	 * Adds a new trigger to the wishlist.
	 * 
	 * @param {HTMLButtonELement} elem - The trigger element that adds or removes the item on click.
	 * @param {number} id - The ID of the wishlist item.
	 * @param {any} data - Any additional data that belongs to the item.
	 * @returns {void}
	 */
	addTrigger(elem, id, data = null) {
		elem.addEventListener("click", this);
		this.#updateTrigger(elem, id);
		this.triggers.push({
			elem: elem,
			id: id,
			data: data
		});
	}

	/**
	 * Retrieves the item IDs that are added to the wishlist.
	 * 
	 * @returns {number[]} The IDs of the items.
	 */
	getIds() {
		return this.items.map((item) => item.id );
	}

	/**
	 * Retrieves the items as a JSON-encoded string.
	 * 
	 * @returns {string} The items as a JSON-encoded string.
	 */
	getEncodedData() {
		return JSON.stringify(this.items);
	}

	/**
	 * Loads the items from the initial data or from the local storage.
	 * 
	 * @returns {void}
	 */
	#load() {
		this.initialData = this.initialData || this.#getStorageData();
		if (this.initialData === null) return;
		if (this.initialData.length) {
			this.initialData.forEach((row) => {
				this.add(row.id, row.data, true);
			});
		} else {
			this.#saveStorageData();
		}
	}

	/**
	 * Saves the wishlist items to the local storage as a JSON-encoded string.
	 * 
	 * @returns {void}
	 */
	#saveStorageData() {
		if (!this.storageKeyName) return;
		this.#setStorageData(this.getEncodedData());
	}

	/**
	 * Sets the local storage data with the specified JSON-encoded string.
	 * 
	 * @param {string} encodedData - The JSON-encoded data to be set.
	 * @returns {void}
	 */
	#setStorageData(encodedData) {
		if (!this.storageKeyName) return;
		localStorage.setItem(this.storageKeyName, encodedData);
	}

	/**
	 * Retrieves the storage data as an object that can be converted to wishlist items.
	 * 
	 * @returns {{id:number,data:any}[]|null} - The storage data as an object.
	 */
	#getStorageData() {
		if (!this.storageKeyName) return null; 
		const encodedData = localStorage.getItem(this.storageKeyName);
		return JSON.parse(encodedData);
	}

	/**
	 * Removes the storage data.
	 * 
	 * @returns {void}
	 */
	#removeStorageData() {
		if (!this.storageKeyName) return;
		localStorage.removeItem(this.storageKeyName);
	}

	/**
	 * Updates the triggers.
	 * 
	 * @returns {void}
	 */
	#updateTriggers() {
		this.triggers.forEach((trigger) => {
			this.#updateTrigger(trigger.elem, trigger.id);
		});
	}

	/**
	 * Updates a trigger.
	 * 
	 * @param {HTMLButtonELement} elem - The trigger element to be updated.
	 * @param {number} id - The ID of the wishlist item.
	 * @returns {void}
	 */
	#updateTrigger(elem, id) {
		elem.classList.toggle(this.triggerAddedClass, this.includes(id));
	}

	/**
	 * Adds event listeners related to the wishlist.
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
					if (event.target == trigger.elem) {
						this.toggle(trigger.id, trigger.data);
					}
				});
				break;
		}
	}
}

/**
 * Wishlist item
 * This class is designed to represent an item in the wishlist.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class WishlistItem {

	/**
	 * The ID of the wishlist item.
	 * 
	 * @type {number}
	 */
	id;

	/**
	 * Any additional data that belongs to the item.
	 * 
	 * @type {any}
	 */
	data = null;

	/**
	 * Creates a wishlist item.
	 * 
	 * @param {Object} options
	 * @param {number} options.id - The ID of the wishlist item.
	 * @param {any} options.data - Any additional data that belongs to the item.
	 * @returns {WishlistItem}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.id !== "number") {
			throw "Wishlist item \"id\" must be a number";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}
	}
}

export { Wishlist };