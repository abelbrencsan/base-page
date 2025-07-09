/**
 * Sortable list
 * This class is designed to enable drag-and-drop sorting of items within a list.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class SortableList {

	/**
	 * Represents the list wrapper element.
	 * 
	 * @type {HTMLUListElement}
	 */
	wrapper;

	/**
	 * The class that is added to the dragged list item while it is dragged.
	 * 
	 * @type {string}
	 */
	isDraggingClass = "is-dragging";

	/**
	 * The class that is added to the wrapper while a list item is dragged.
	 * 
	 * @type {string}
	 */
	hasDraggingClass = "has-dragging";

	/**
	 * The class that is added to the list item while the dragged item is over it and would be placed above it if dropped.
	 * 
	 * @type {string}
	 */
	isAboveClass = "is-above";

	/**
	 * The class that is added to the list item while the dragged item is over it and would be placed below it if dropped.
	 * 
	 * @type {string}
	 */
	isBelowClass = "is-below";

	/**
	 * A function that is called to retrieve the transfer data of the dragged list item.
	 * 
	 * @type {function(HTMLLIElement):string|null}
	 */
	getTransferData = () => null;

	/**
	 * Callback function that is called after the sortable list has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after dragging has started.
	 * 
	 * @type {function():void|null}
	 */
	dragStartCallback = null;

	/**
	 * Callback function that is called after dragging has ended.
	 * 
	 * @type {function():void|null}
	 */
	dragEndCallback = null;

	/**
	 * Callback function that is called after the dragged list item is dropped.
	 * 
	 * @type {function(HTMLLIElement):void|null}
	 */
	dropCallback = null;

	/**
	 * Callback function that is called after the sortable list has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The current dragged list item.
	 * 
	 * @type {HTMLLIElement|null}
	 */
	draggedItem = null;

	/**
	 * Indicates whether the dragged list item has to be placed below the item where it is dropped.
	 * 
	 * @type {boolean}
	 */
	isBelow = false;

	/**
	 * Creates a sortable list.
	 * 
	 * @param {Object} options
	 * @param {HTMLUListElement} options.wrapper
	 * @param {string} options.isDraggingClass
	 * @param {string} options.hasDraggingClass
	 * @param {string} options.isAboveClass
	 * @param {string} options.isBelowClass
	 * @param {function(HTMLLIElement):string|null} options.getTransferData
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.dragStartCallback
	 * @param {function():void} options.dragEndCallback
	 * @param {function(HTMLLIElement):void} options.dropCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {SortableList}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLUListElement)) {
			throw "Sortable list \"wrapper\" must be an `HTMLUListElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the sortable list
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the sortable list.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#resetInsertionMarkers();
		this.wrapper.classList.remove(this.hasDraggingClass);
		if (this.draggedItem) {
			this.draggedItem.classList.remove(this.isDraggingClass);
		}
		this.draggedItem = null;
		this.isBelow = false;
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Executes after a draggable list item has been started dragging.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingStarted(event) {
		if (!event.target.draggable) return;
		this.draggedItem = this.#getListItem(event.target);
		if (this.draggedItem) {
			const transferData = this.getTransferData(this.draggedItem);
			const {x, y} = this.#getDragOffsetPosition(event.clientX, event.clientY);
			event.dataTransfer.setData("text/plain", transferData);
			event.dataTransfer.setDragImage(this.draggedItem, x, y);
			this.wrapper.classList.add(this.hasDraggingClass);
			this.draggedItem.classList.add(this.isDraggingClass);
			if ("vibrate" in navigator) navigator.vibrate(100);
			if (typeof(this.dragStartCallback) == "function") this.dragStartCallback();
		}
	}

	/**
	 * Executes after the dragged list item is over a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggedOver(event) {
		if (!this.draggedItem) return;
		event.preventDefault();
		const targetItem = this.#getListItem(event.target);
		if (targetItem) {
			this.#resetInsertionMarkers();
			if (this.#detectIsCursorBelow(targetItem, event.clientY)) {
				targetItem.classList.add(this.isBelowClass);
				this.isBelow = true;
			} else {
				targetItem.classList.add(this.isAboveClass);
				this.isBelow = false;
			}
		}
	}

	/**
	 * Executes after the dragging of a list item has ended.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingEnded(event) {
		if (!this.draggedItem) return;
		event.preventDefault();
		this.#resetInsertionMarkers();
		this.wrapper.classList.remove(this.hasDraggingClass);
		this.draggedItem.classList.remove(this.isDraggingClass);
		this.draggedItem = null;
		this.isBelow = false;
		if (typeof(this.dragEndCallback) == "function") this.dragEndCallback();
	}

	/**
	 * Executes after the dragged list item leaves a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingLeft(event) {
		if (!this.draggedItem) return;
		const isOutside = this.#detectIsCursorOutside(event.clientX, event.clientY);
		if (isOutside) this.#resetInsertionMarkers();
	}

	/**
	 * Executes after the dragged list item is dropped on a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDropped(event) {
		if (!this.draggedItem) return;
		event.preventDefault();
		const targetItem = this.#getListItem(event.target);
		if (targetItem) {
			if (this.isBelow) {
				targetItem.parentNode.insertBefore(this.draggedItem, targetItem.nextSibling);
			} else {
				targetItem.parentNode.insertBefore(this.draggedItem, targetItem);
			}
			if (typeof(this.dropCallback) == "function") this.dropCallback(targetItem);
		}
	}

	/**
	 * Retrieves the list item that is equal to or a parent of the specified element.
	 * 
	 * @param {HTMLElement} target
	 * @returns {HTMLLIElement|null}
	 */
	#getListItem(target) {
		let listItem = null;
		Array.from(this.wrapper.children).forEach((item) => {
			if ((item == target || item.contains(target)) && item instanceof HTMLLIElement) {
				listItem = item;
			}
		});
		return listItem;
	}

	/**
	 * Retrieves the offset position of the cursor relative to the dragged list item when dragging has started.
	 * 
	 * @param {number} clientX
	 * @param {number} clientY
	 * @returns {{x: number, y: number}}
	 */
	#getDragOffsetPosition(clientX, clientY) {
		const domRect = this.draggedItem.getBoundingClientRect();
		return {
			x: clientX - domRect.x,
			y: clientY - domRect.y
		};
	}

	/**
	 * Resets the markers on all list items that indicate the insertion position of the dragged list item.
	 * 
	 * @returns {void}
	 */
	#resetInsertionMarkers() {
		Array.from(this.wrapper.children).forEach((item) => {
			item.classList.remove(this.isAboveClass);
			item.classList.remove(this.isBelowClass);
		});
	}

	/**
	 * Detects whether the cursor is below the first half of the specified list item's height.
	 * 
	 * @param {HTMLLIElement} listItem
	 * @param {number} clientY
	 * @returns {boolean}
	 */
	#detectIsCursorBelow(listItem, clientY) {
		const domRect = listItem.getBoundingClientRect();
		const offset = domRect.y + (domRect.height / 2);
		return clientY - offset > 0;
	}

	/**
	 * Detects whether the cursor is outside of the wrapper.
	 * 
	 * @param {number} clientX
	 * @param {number} clientY
	 * @returns {boolean}
	 */
	#detectIsCursorOutside(clientX, clientY) {
		const { top, bottom, left, right } = this.wrapper.getBoundingClientRect();
		const isXOut = clientX < left || clientX > right;
		const isYOut = clientY < top || clientY > bottom;
		return isXOut || isYOut;
	}

	/**
	 * Adds event listeners related to the sortable list.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("dragstart", this);
		this.wrapper.addEventListener("dragover", this);
		this.wrapper.addEventListener("dragend", this);
		this.wrapper.addEventListener("dragleave", this);
		this.wrapper.addEventListener("drop", this);
	}

	/**
	 * Remove event listeners related to the sortable list.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.wrapper.removeEventListener("dragstart", this);
		this.wrapper.removeEventListener("dragover", this);
		this.wrapper.removeEventListener("dragend", this);
		this.wrapper.removeEventListener("dragleave", this);
		this.wrapper.removeEventListener("drop", this);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "dragstart":
				this.#isDraggingStarted(event);
				break;
			case "dragover":
				this.#isDraggedOver(event);
				break;
			case "dragend":
				this.#isDraggingEnded(event);
				break;
			case "dragleave":
				this.#isDraggingLeft(event);
				break;
			case "drop":
				this.#isDropped(event);
				break;
		}
	}
}

export { SortableList };