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
	 * @type {Array<{elem:HTMLButtonElement,id:number,data:any}>}
	 */
	triggers = [];

	/**
	 * The initial data from which the initial items are added to the wishlist (overwrites existing local storage).
	 * 
	 * @type {Array<{id:number,data:any}|null}
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
	 * Callback function that is called after the wishlist has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * List of items added to the wishlist.
	 * 
	 * @type {Array<WishlistItem>}
	 */
	items = [];

	/**
	 * Creates a wishlist.
	 * 
	 * @param {Object} options
	 * @param {string|null} options.storageKeyName
	 * @param {Array<{elem:HTMLButtonElement,id:number,data:any}>} options.triggers
	 * @param {Array<{id:number,data:any}|null} options.initialData
	 * @param {function():void|null} options.initCallback
	 * @param {function(number):void|null} options.addCallback
	 * @param {function(number):void|null} options.removeCallback
	 * @param {function(number):void|null} options.updateCallback
	 * @param {function():void|null} options.clearCallback
	 * @param {function():void|null} options.destroyCallback
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
	 * @param {number} id
	 * @param {any} data
	 * @param {bool} skipCallback
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
	 * @param {number} id
	 * @param {bool} skipCallback
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
	 * @param {number} id
	 * @returns {void}
	 */
	includes(id) {
		return this.items.some((item) => item.id == id);
	}

	/**
	 * Adds or removes an item from the wishlist.
	 * 
	 * @param {number} id
	 * @param {any} data
	 * @param {bool} skipCallback
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
	 * @param {number} id
	 * @returns {WishlistItem|undefined}
	 */
	get(id) {
		return this.items.find((item) => item.id == id);
	}

	/**
	 * Removes all items from the wishlist.
	 * 
	 * @param {bool} skipCallback
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
	 * @param {HTMLButtonELement} elem
	 * @param {number} id
	 * @param {any} data
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
	 * @returns {Array<number>}
	 */
	getIds() {
		return this.items.map((item) => item.id );
	}

	/**
	 * Retrieves the items as a JSON-encoded string.
	 * 
	 * @returns {string}
	 */
	getEncodedData() {
		return JSON.stringify(this.items);
	}

	/**
	 * Destroys the wishlist.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.clear();
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
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
	 * @param {string} encodedData
	 * @returns {void}
	 */
	#setStorageData(encodedData) {
		if (!this.storageKeyName) return;
		localStorage.setItem(this.storageKeyName, encodedData);
	}

	/**
	 * Retrieves the storage data as an object that can be converted to wishlist items.
	 * 
	 * @returns {Array<{id:number,data:any}>|null}
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
	 * @param {HTMLButtonELement} elem
	 * @param {number} id
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
	 * Removes event listeners related to the wishlist.
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
	 * @param {number} options.id
	 * @param {any} options.data
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