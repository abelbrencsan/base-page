/**
 * Sortable tree
 * This class is designed to enable drag-and-drop sorting of items within nested lists.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class SortableTree {

	/**
	 * Represents the tree wrapper element.
	 * 
	 * @type {HTMLElement}
	 */
	wrapper;

	/**
	 * The CSS selector used to find all tree nodes within the wrapper.
	 * 
	 * @type {string}
	 */
	nodeSelector = "";

	/**
	 * The CSS selector used to find the wrappers of the subtrees.
	 * 
	 * @type {string}
	 */
	subtreeSelector = "";

	/**
	 * The CSS selector used to find the collapse triggers for the subtrees within the nodes.
	 * 
	 * @type {string}
	 */
	collapseTriggerSelector = "";

	/**
	 * The CSS selector used to match blocks that can add new nodes to the wrapper.
	 * 
	 * @type {string}
	 */
	blockSelector = "";

	/**
	 * Indicates whether the subtrees are collapsible.
	 * 
	 * @type {boolean}
	 */
	isCollapsible = true;

	/**
	 * The class that is added to the subtree when collapsed.
	 * 
	 * @type {string}
	 */
	isCollapsedClass = "is-collapsed";

	/**
	 * The class that is added to the node when its subtree is collapsed.
	 * 
	 * @type {string}
	 */
	hasCollapsedSubtreeClass = "has-collapsed-subtree";

	/**
	 * The class that is added to the dragged node while it is dragged.
	 * 
	 * @type {string}
	 */
	isDraggingClass = "is-dragging";

	/**
	 * The class that is added to the wrapper while a node is dragged.
	 * 
	 * @type {string}
	 */
	hasDraggingClass = "has-dragging";

	/**
	 * The class that is added to the target node while the dragged item is over it and would be placed above it if dropped.
	 * 
	 * @type {string}
	 */
	isAboveClass = "is-above";

	/**
	 * The class that is added to the target node while the dragged item is over it and would be placed below it if dropped.
	 * 
	 * @type {string}
	 */
	isBelowClass = "is-below";

	/**
	 * Represents the blocks wrapper element.
	 * 
	 * @type {HTMLElement|null}
	 */
	blocksWrapper = null;

	/**
	 * A function that is called to retrieve the transfer data of the dragged node.
	 * 
	 * @type {function(HTMLElement):string}
	 */
	getTransferData = (node) => "";

	/**
	 * A function that is called to retrieve the node to be added to the tree as a new tree node.
	 * 
	 * @type {function(HTMLElement):Node|null}
	 */
	createNodeFromBlock = (block) => null;

	/**
	 * Callback function that is called after the sortable tree has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after dragging has started.
	 * 
	 * @type {function():void|null}
	 */
	isDraggingStartedCallback = null;

	/**
	 * Callback function that is called after the dragged node is over a valid drop target.
	 * 
	 * @type {function(HTMLElement):void|null}
	 */
	isDraggedOverCallback = null;

	/**
	 * Callback function that is called after the dragging of a node has ended.
	 * 
	 * @type {function():void|null}
	 */
	isDraggingEndedCallback = null;

	/**
	 * Callback function that is called after the dragged node is dropped on a valid drop target.
	 * 
	 * @type {function(HTMLElement):void|null}
	 */
	isDroppedCallback = null;

	/**
	 * Callback function that is called after the sortable tree has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The current dragged node.
	 * 
	 * @type {HTMLElement|null}
	 */
	draggedNode = null;

	/**
	 * Indicates whether the dragged node has to be placed below (and not above) the node where it is dropped.
	 * 
	 * @type {boolean}
	 */
	isBelow = false;

	/**
	 * Creates a sortable tree.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.wrapper
	 * @param {string} options.nodeSelector
	 * @param {string} options.subtreeSelector
	 * @param {string} options.collapseTriggerSelector
	 * @param {string} options.blockSelector
	 * @param {boolean} options.isCollapsible
	 * @param {string} options.isCollapsedClass
	 * @param {string} options.hasCollapsedSubtreeClass
	 * @param {string} options.isDraggingClass
	 * @param {string} options.hasDraggingClass
	 * @param {string} options.isAboveClass
	 * @param {string} options.isBelowClass
	 * @param {function(HTMLElement):string} options.getTransferData
	 * @param {function(HTMLElement):Element|null} options.createNodeFromBlock
	 * @param {HTMLElement|null} options.blocksWrapper
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.isDraggingStartedCallback
	 * @param {function(HTMLElement):void} options.isDraggedOverCallback
	 * @param {function():void} options.isDraggingEndedCallback
	 * @param {function(HTMLElement):void} options.isDroppedCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {SortableTree}
	 */
	constructor(options) {

		// Test required options
		if (!(options.wrapper instanceof HTMLElement)) {
			throw "Sortable tree \"wrapper\" must be an `HTMLElement`";
		}
		if (typeof options.nodeSelector !== "string" || options.nodeSelector == "") {
			throw "Sortable tree \"nodeSelector\" must be a non-empty `string`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the sortable tree
		this.handleEvent = (event) => this.#handleEvents(event);
		this.#addEvents();
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Indicates whether the specified event target is a child of the blocks wrapper.
	 * 
	 * @param {EventTarget|null} eventTarget
	 * @returns {boolean}
	 */
	isBlockTarget(eventTarget) {
		return this.blocksWrapper && this.blocksWrapper.contains(eventTarget);
	}

	/**
	 * Destroys the sortable tree.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.#removeAllInsertionMarkers();
		this.#removeAllCollapsedClasses();
		this.wrapper.classList.remove(this.hasDraggingClass);
		if (this.draggedNode) {
			this.draggedNode.classList.remove(this.isDraggingClass);
		}
		this.draggedNode = null;
		this.isBelow = false;
		this.#removeEvents();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Executes after a draggable node has been started dragging.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingStarted(event) {
		if (!(event.target instanceof HTMLElement)) return;
		if (!event.target.draggable) return;
		this.draggedNode = this.#getNodeOrBlock(event.target);
		if (this.draggedNode) {
			const isBlock = this.isBlockTarget(this.draggedNode);
			const transferData = this.getTransferData(this.draggedNode);
			const {x, y} = this.#getDragOffsetPosition(event.clientX, event.clientY);
			event.dataTransfer.setData("text/plain", transferData);
			event.dataTransfer.setDragImage(this.draggedNode, x, y);
			this.wrapper.classList.add(this.hasDraggingClass);
			if (this.blocksWrapper) {
				this.blocksWrapper.classList.add(this.hasDraggingClass);
			}
			this.draggedNode.classList.add(this.isDraggingClass);
			if ("vibrate" in navigator) navigator.vibrate(100);
			if (typeof(this.isDraggingStartedCallback) == "function") this.isDraggingStartedCallback(isBlock);
		}
	}

	/**
	 * Executes after the dragged node is over a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggedOver(event) {
		if (!(event.target instanceof HTMLElement)) return;
		if (!this.draggedNode) return;
		event.preventDefault();
		const dropTarget = this.#getDropTarget(event.target, event.clientX, event.clientY);
		if (dropTarget) {
			this.#removeAllInsertionMarkers();
			if (this.subtreeSelector && dropTarget.matches(this.subtreeSelector)) {
				dropTarget.classList.add(this.isBelowClass);
				this.isBelow = true;
			} else {
				this.#openCollapsedSubtree(dropTarget, event.target);
				if (this.#detectIsCursorBelow(dropTarget, event.clientY)) {
					dropTarget.classList.add(this.isBelowClass);
					this.isBelow = true;
				} else {
					dropTarget.classList.add(this.isAboveClass);
					this.isBelow = false;
				}
			}
			if (typeof(this.isDraggedOverCallback) == "function") this.isDraggedOverCallback(dropTarget);
		}
	}

	/**
	 * Executes after the dragging of a node has ended.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingEnded(event) {
		if (!this.draggedNode) return;
		event.preventDefault();
		this.#removeAllInsertionMarkers();
		this.wrapper.classList.remove(this.hasDraggingClass);
		if (this.blocksWrapper) {
			this.blocksWrapper.classList.remove(this.hasDraggingClass);
		}
		this.draggedNode.classList.remove(this.isDraggingClass);
		this.draggedNode = null;
		this.isBelow = false;
		if (typeof(this.isDraggingEndedCallback) == "function") this.isDraggingEndedCallback();
	}

	/**
	 * Executes after the dragged node leaves a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDraggingLeft(event) {
		if (!this.draggedNode) return;
		const isOutside = this.#detectIsCursorOutside(event.clientX, event.clientY);
		if (isOutside) this.#removeAllInsertionMarkers();
	}

	/**
	 * Executes after the dragged node is dropped on a valid drop target.
	 * 
	 * @param {DragEvent} event
	 * @returns {void}
	 */
	#isDropped(event) {
		if (!(event.target instanceof HTMLElement)) return;
		if (!this.draggedNode) return;
		event.preventDefault();
		const dropTarget = this.#getDropTarget(event.target, event.clientX, event.clientY);
		if (dropTarget) {
			let draggedNode = this.draggedNode;
			if (this.isBlockTarget(this.draggedNode)) {
				let createdNode = this.createNodeFromBlock(this.draggedNode);
				if (createdNode) {
					draggedNode = createdNode;
				} else {
					return;
				}
			}
			if (this.subtreeSelector && dropTarget.matches(this.subtreeSelector)) {
				dropTarget.appendChild(draggedNode);
			} else if (this.isBelow) {
				dropTarget.parentNode.insertBefore(draggedNode, dropTarget.nextSibling);
			} else {
				dropTarget.parentNode.insertBefore(draggedNode, dropTarget);
			}
			if (typeof(this.isDroppedCallback) == "function") this.isDroppedCallback(dropTarget);
		}
	}

	/**
	 * Executes after the collapse trigger is clicked.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#isClicked(event) {
		if (!(event.target instanceof HTMLElement)) return;
		if (!this.isCollapsible || !this.subtreeSelector) return;
		if (this.subtreeSelector && this.collapseTriggerSelector && event.target.matches(this.collapseTriggerSelector)) {
			const node = this.#getNode(event.target);
			const subtree = node.querySelector(this.subtreeSelector);
			if (subtree) {
				node.classList.toggle(this.hasCollapsedSubtreeClass);
				subtree.classList.toggle(this.isCollapsedClass);
			}
		}
	}

	/**
	 * Executes after the block is clicked.
	 * 
	 * @param {PointerEvent} event
	 * @returns {void}
	 */
	#isBlockClicked(event) {
		if (!(event.target instanceof HTMLElement)) return;
		let block = this.#getBlock(event.target);
		if (block) {
			let createdNode = this.createNodeFromBlock(block);
			if (createdNode) {
				this.wrapper.appendChild(createdNode);
			}
		}
	}

	/**
	 * Retrieves the closest node that is equal to or a parent of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @returns {HTMLElement|null}
	 */
	#getNode(elem) {
		if (elem.matches(this.nodeSelector)) return elem;
		return elem.closest(this.nodeSelector);
	}

	/**
	 * Retrieves the closest block that is equal to or a parent of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @returns {HTMLElement|null}
	 */
	#getBlock(elem) {
		if (elem.matches(this.blockSelector)) return elem;
		return elem.closest(this.blockSelector);
	}

	/**
	 * Retrieves the closest node or block that is equal to or a parent of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @returns {HTMLElement|null}
	 */
	#getNodeOrBlock(elem) {
		if (this.isBlockTarget(elem)) {
			return this.#getBlock(elem);
		} else {
			return this.#getNode(elem);
		}
	}

	/**
	 * Retrieves the closest drop target of the specified element.
	 * 
	 * @param {HTMLElement} elem
	 * @param {number} clientX
	 * @param {number} clientY
	 * @returns {HTMLElement|null}
	 */
	#getDropTarget(elem, clientX, clientY) {
		const node = this.#getNode(elem);
		if (node) {
			if (this.draggedNode && this.draggedNode.contains(node)) {
				return this.draggedNode;
			}
			if (this.subtreeSelector) {
				const subtree = node.querySelector(this.subtreeSelector);
				if (subtree && !subtree.children.length) {
					const isBelow = this.#detectIsCursorBelow(node, clientY);
					const isIndented = this.#detectIsCursorIndented(node, clientX);
					if (isBelow && isIndented) {
						return subtree;
					}
				}
			}
		}
		return node;
	}

	/**
	 * Retrieves the offset position of the cursor relative to the dragged node.
	 * 
	 * @param {number} clientX
	 * @param {number} clientY
	 * @returns {{x: number, y: number}}
	 */
	#getDragOffsetPosition(clientX, clientY) {
		const domRect = this.draggedNode.getBoundingClientRect();
		return {
			x: clientX - domRect.x,
			y: clientY - domRect.y
		};
	}

	/**
	 * Removes the insertion position markers from all nodes and subtrees.
	 * 
	 * @returns {void}
	 */
	#removeAllInsertionMarkers() {
		this.#removeInsertionMarkers(this.nodeSelector);
		if (this.subtreeSelector) this.#removeInsertionMarkers(this.subtreeSelector);
	}

	/**
	 * Removes the insertion position markers from all elements within the wrapper that match the specified CSS selector.
	 * 
	 * @param {string} selector
	 * @returns {void}
	 */
	#removeInsertionMarkers(selector) {
		this.wrapper.querySelectorAll(selector).forEach((item) => {
			item.classList.remove(this.isAboveClass);
			item.classList.remove(this.isBelowClass);
		});
	}

	/**
	 * Removes classes related to collapsing from all nodes and their subtrees.
	 * 
	 * @returns {void}
	 */
	#removeAllCollapsedClasses() {
		this.#removeHasCollapsedClasses();
		this.#removeIsCollapsedClasses();
	}

	/**
	 * Removes classes related to collapsing from all nodes.
	 * 
	 * @returns {void}
	 */
	#removeHasCollapsedClasses() {
		this.wrapper.querySelectorAll(this.nodeSelector).forEach((elem) => {
			elem.classList.remove(this.hasCollapsedSubtreeClass);
		});
	}

	/**
	 * Removes classes related to collapsing from all subtrees.
	 * 
	 * @returns {void}
	 */
	#removeIsCollapsedClasses() {
		if (!this.subtreeSelector) return;
		this.wrapper.querySelectorAll(this.subtreeSelector).forEach((elem) => {
			elem.classList.remove(this.isCollapsedClass);
		});
	}

	/**
	 * Detects whether the cursor is positioned below the first half of the specified element's height.
	 * 
	 * @param {HTMLElement} elem
	 * @param {number} clientY
	 * @returns {boolean}
	 */
	#detectIsCursorBelow(elem, clientY) {
		const domRect = elem.getBoundingClientRect();
		const offset = domRect.y + (domRect.height / 2);
		return clientY - offset > 0;
	}

	/**
	 * Detects whether the cursor is positioned after the first half of the specified element's width.
	 * 
	 * @param {HTMLElement} elem
	 * @param {number} clientX
	 * @returns {boolean}
	 */
	#detectIsCursorIndented(elem, clientX) {
		const domRect = elem.getBoundingClientRect();
		const offset = domRect.x + (domRect.width / 2);
		return clientX - offset > 0;
	}

	/**
	 * Detects whether the cursor's position is outside of the wrapper element.
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
	 * Opens the collapsed subtree of the node over which the dragged node is positioned.
	 * 
	 * @param {HTMLElement} dropTarget
	 * @param {HTMLElement} elem
	 * @returns {void}
	 */
	#openCollapsedSubtree(dropTarget, elem) {
		if (!this.subtreeSelector || !this.collapseTriggerSelector || dropTarget == this.draggedNode) return;
		const subtree = dropTarget.querySelector(this.subtreeSelector);
		if (subtree && elem.matches(this.collapseTriggerSelector)) {
			dropTarget.classList.remove(this.hasCollapsedSubtreeClass);
			subtree.classList.remove(this.isCollapsedClass);
		}
	}

	/**
	 * Adds event listeners related to the sortable tree.
	 * 
	 * @returns {void}
	 */
	#addEvents() {
		this.wrapper.addEventListener("dragstart", this);
		this.wrapper.addEventListener("dragover", this);
		this.wrapper.addEventListener("dragend", this);
		this.wrapper.addEventListener("dragleave", this);
		this.wrapper.addEventListener("drop", this);
		this.wrapper.addEventListener("click", this);
		if (this.blocksWrapper) {
			this.blocksWrapper.addEventListener("dragstart", this);
			this.blocksWrapper.addEventListener("dragend", this);
			this.blocksWrapper.addEventListener("click", this);
		}
	}

	/**
	 * Removes event listeners related to the sortable tree.
	 * 
	 * @returns {void}
	 */
	#removeEvents() {
		this.wrapper.removeEventListener("dragstart", this);
		this.wrapper.removeEventListener("dragover", this);
		this.wrapper.removeEventListener("dragend", this);
		this.wrapper.removeEventListener("dragleave", this);
		this.wrapper.removeEventListener("drop", this);
		this.wrapper.removeEventListener("click", this);
		if (this.blocksWrapper) {
			this.blocksWrapper.removeEventListener("dragstart", this);
			this.blocksWrapper.removeEventListener("dragend", this);
			this.blocksWrapper.removeEventListener("click", this);
		}
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
			case "click":
				if (this.isBlockTarget(event.target)) {
					this.#isBlockClicked(event);
				} else {
					this.#isClicked(event);
				}
				break;
		}
	}
}

export { SortableTree };