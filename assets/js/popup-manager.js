import { Dialog } from "../js/dialog.js";

/**
 * Popup manager
 * This class is designed to manage when popups appear in the foreground to display marketing messages, alerts, or notifications.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class PopupManager {

	/**
	 * The key name of the session storage where the viewed popups are stored.
	 * 
	 * @type {string}
	 */
	storageKeyName = "viewed-popups";

	/**
	 * The consent for popups to appear.
	 * 
	 * @type {boolean}
	 */
	consent = true;

	/**
	 * Callback function that is called after the popup manager has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after a popup is added to the popup manager.
	 * 
	 * @type {function(HTMLElement):void|null}
	 */
	addPopupCallback = null;

	/**
	 * Callback function that is called after a popup is removed from the popup manager.
	 * 
	 * @type {function():void|null}
	 */
	removePopupCallback = null;

	/**
	 * Callback function that is called after the popup manager has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * The Intersection Observer API used to detect when the target element of the popups becomes visible.
	 * 
	 * @type {IntersectionObserver}
	 */
	observer;

	/**
	 * The scroll position of the previous intersection.
	 * 
	 * @type {number}
	 */
	prevScrollPos;

	/**
	 * List of popups to be managed.
	 * 
	 * @type {Array<PopupManagerPopup>}
	 */
	popups = [];

	/**
	 * Creates a popup manager.
	 * 
	 * @param {Object} options
	 * @param {string} options.storageKeyName
	 * @param {boolean} options.consent
	 * @param {function():void} options.initCallback
	 * @param {function(HTMLElement):void} options.addPopupCallback
	 * @param {function():void} options.removePopupCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {PopupManager}
	 */
	constructor(options) {

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the popup manager
		this.prevScrollPos = window.scrollY;
		this.observer = new IntersectionObserver((entries) => {
			let prevScrollPos = this.prevScrollPos;
			this.prevScrollPos = window.scrollY;
			if (this.hasOpenDialog || !this.consent) return;
			entries.forEach((entry) => {
				this.popups.forEach((popup) => {
					if (popup.targetElement == entry.target && !this.#isPopupViewed(popup)) {
						if ((!popup.onlyUpward && entry.isIntersecting) || (popup.onlyUpward && window.scrollY < prevScrollPos)) {
							this.openPopup(popup);
						}
					}
				});
			});
		});
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Open the specified popup.
	 * 
	 * @param {PopupManagerPopup} popup
	 * @returns {void}
	 */
	openPopup(popup) {
		popup.dialog.open();
		this.#setPopupAsViewed(popup);
	}

	/**
	 * Adds a new popup.
	 * 
	 * @param {PopupManagerPopup} popup
	 * @returns {void}
	 */
	addPopup(popup) {
		this.observer.observe(popup.targetElement);
		this.popups.push(popup);
		if (typeof(this.addPopupCallback) == "function") this.addPopupCallback();
	}

	/**
	 * Removes the specified popup.
	 * 
	 * @param {PopupManagerPopup} popup
	 * @returns {void}
	 */
	removePopup(popup) {
		this.popups = this.popups.filter(otherPopup => otherPopup !== popup);
		if (typeof(this.removePopupCallback) == "function") this.removePopupCallback();
	}

	/**
	 * Removes all popups.
	 * 
	 * @returns {void}
	 */
	removePopups() {
		this.popups.forEach((popup) => this.removePopup(popup));
	}

	/**
	 * Destroys the popup manager.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.popups.forEach((popup) => popup.destroy());
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Indicates whether there is an open dialog.
	 * 
	 * @returns {boolean}
	 */
	get hasOpenDialog() {
		return document.querySelector("[open]") !== null;
	}

	/**
	 * Sets the popup as viewed.
	 * 
	 * @param {PopupManagerPopup} popup
	 * @returns {void}
	 */
	#setPopupAsViewed(popup) {
		let popupIds = this.#getViewedPopupIds();
		popupIds.push(popup.id);
		this.#setViewedPopupIds(popupIds);
	}

	/**
	 * Retrieves the IDs of viewed popups from session storage.
	 * 
	 * @returns {Array<string>}
	 */
	#getViewedPopupIds() {
		const encodedIds = sessionStorage.getItem(this.storageKeyName) || "[]";
		return JSON.parse(encodedIds);
	}

	/**
	 * Sets the specified popup IDs as viewed in session storage.
	 * 
	 * @param {Array<string>} popupIds
	 * @returns {void}
	 */
	#setViewedPopupIds(popupIds) {
		const encodedIds = JSON.stringify(popupIds);
		sessionStorage.setItem(this.storageKeyName, encodedIds);
	}

	/**
	 * Indicates whether the specified popup has been viewed.
	 * 
	 * @param {PopupManagerPopup} popup
	 * @returns {boolean}
	 */
	#isPopupViewed(popup) {
		let popupIds = this.#getViewedPopupIds();
		return popupIds.some((popupId) => popup.id == popupId);
	}
}

/**
 * Popup manager popup
 * This class is designed to create a popup for a popup manager.
 * 
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class PopupManagerPopup {

	/**
	 * The id of the popup.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * The dialog appears when the target element becomes visible in the viewport.
	 * 
	 * @type {Element}
	 */
	targetElement;

	/**
	 * Represents the dialog to be displayed when the target element becomes visible.
	 * 
	 * @type {Dialog}
	 */
	dialog;

	/**
	 * The dialog appears when the target element becomes visible upon scrolling upward.
	 * 
	 * @type {boolean}
	 */
	onlyUpward = false;

	/**
	 * Callback function that is called after the popup has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after the popup has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * Creates a popup.
	 * 
	 * @param {Object} options
	 * @param {string} options.id
	 * @param {Dialog} options.dialog
	 * @param {Element} options.targetElement
	 * @param {boolean} options.onlyUpward
	 * @param {function():void} options.initCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {PopupManagerPopup}
	 */
	constructor(options) {

		// Test required options
		if (typeof options.id !== "string") {
			throw "Popup manager popup \"id\" must be a string";
		}
		if (!(options.targetElement instanceof Element)) {
			throw "Popup manager popup \"targetElement\" must be an `Element`";
		}
		if (!(options.dialog instanceof Dialog)) {
			throw "Popup manager popup \"dialog\" must be a `Dialog`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the popup
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Destroys the popup.
	 * 
	 * @returns {void}
	 */
	destroy() {
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}
}

export { PopupManager, PopupManagerPopup };