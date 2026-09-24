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
	 * @type {function(PopupManager):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after a popup is added to the popup manager.
	 * 
	 * @type {function(PopupManager):void|null}
	 */
	addPopupCallback = null;

	/**
	 * Callback function that is called after a popup is removed from the popup manager.
	 * 
	 * @type {function(PopupManager):void|null}
	 */
	removePopupCallback = null;

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
	 * @type {PopupManagerPopup[]}
	 */
	popups = [];

	/**
	 * Indicates whether there is an open dialog.
	 * 
	 * @returns {boolean}
	 */
	get #hasOpenDialog() {
		return document.querySelector("[open]") !== null;
	}

	/**
	 * The IDs of the viewed popups.
	 * 
	 * @returns {string[]}
	 */
	get #viewedPopupIds() {
		const encodedIds = sessionStorage.getItem(this.storageKeyName) || "[]";
		return JSON.parse(encodedIds);
	}

	/**
	 * Creates a popup manager.
	 * 
	 * @param {Object} options
	 * @param {string} options.storageKeyName - The key name of the session storage where the viewed popups are stored.
	 * @param {boolean} options.consent - The consent for popups to appear.
	 * @param {function(PopupManager):void|null} options.initCallback - Callback function that is called after the popup manager has been initialized.
	 * @param {function(PopupManager):void|null} options.addPopupCallback - Callback function that is called after a popup is added to the popup manager.
	 * @param {function(PopupManager):void|null} options.removePopupCallback - Callback function that is called after a popup is removed from the popup manager.
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
			if (this.#hasOpenDialog || !this.consent) return;
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
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Open the specified popup.
	 * 
	 * @param {PopupManagerPopup} popup - The popup to be opened.
	 * @returns {void}
	 */
	openPopup(popup) {
		popup.dialog.open();
		this.#setPopupAsViewed(popup);
	}

	/**
	 * Adds a new popup.
	 * 
	 * @param {PopupManagerPopup} popup - The popup to be added.
	 * @returns {void}
	 */
	addPopup(popup) {
		this.observer.observe(popup.targetElement);
		this.popups.push(popup);
		if (typeof(this.addPopupCallback) == "function") this.addPopupCallback(this);
	}

	/**
	 * Removes the specified popup.
	 * 
	 * @param {PopupManagerPopup} popup - The popup to be removed.
	 * @returns {void}
	 */
	removePopup(popup) {
		this.popups = this.popups.filter(otherPopup => otherPopup !== popup);
		if (typeof(this.removePopupCallback) == "function") this.removePopupCallback(this);
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
	 * Sets the popup as viewed.
	 * 
	 * @param {PopupManagerPopup} popup - The popup to be set as viewed.
	 * @returns {void}
	 */
	#setPopupAsViewed(popup) {
		let popupIds = this.#viewedPopupIds;
		popupIds.push(popup.id);
		this.#setViewedPopupIds(popupIds);
	}

	/**
	 * Sets the specified popup IDs as viewed in session storage.
	 * 
	 * @param {string[]} popupIds - The IDs of the popups to be set as viewed.
	 * @returns {void}
	 */
	#setViewedPopupIds(popupIds) {
		const encodedIds = JSON.stringify(popupIds);
		sessionStorage.setItem(this.storageKeyName, encodedIds);
	}

	/**
	 * Indicates whether the specified popup has been viewed.
	 * 
	 * @param {PopupManagerPopup} popup - The popup to be checked.
	 * @returns {boolean} `true` if the popup has been viewed; otherwise, `false`.
	 */
	#isPopupViewed(popup) {
		let popupIds = this.#viewedPopupIds;
		return popupIds.some((popupId) => popup.id == popupId);
	}
}

/**
 * Popup manager popup
 * This class is designed to create a popup for a popup manager.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class PopupManagerPopup {

	/**
	 * The ID of the popup.
	 * 
	 * @type {string}
	 */
	id;

	/**
	 * The dialog to be displayed when the target element becomes visible.
	 * 
	 * @type {Dialog}
	 */
	dialog;

	/**
	 * The dialog appears when the target element becomes visible in the viewport.
	 * 
	 * @type {Element}
	 */
	targetElement;

	/**
	 * Indicates whether the dialog appears only if the target element becomes visible upon scrolling upward.
	 * 
	 * @type {boolean}
	 */
	onlyUpward = false;

	/**
	 * Callback function that is called after the popup has been initialized.
	 * 
	 * @type {function(PopupManagerPopup):void|null}
	 */
	initCallback = null;

	/**
	 * Creates a popup.
	 * 
	 * @param {Object} options
	 * @param {string} options.id - The ID of the popup.
	 * @param {Dialog} options.dialog - The dialog to be displayed when the target element becomes visible.
	 * @param {Element} options.targetElement - The dialog appears when the target element becomes visible in the viewport.
	 * @param {boolean} options.onlyUpward - Indicates whether the dialog appears only if the target element becomes visible upon scrolling upward.
	 * @param {function(PopupManagerPopup):void|null} options.initCallback - Callback function that is called after the popup has been initialized.
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
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}
}

export { PopupManager, PopupManagerPopup };