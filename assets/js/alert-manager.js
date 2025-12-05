/**
 * Alert manager
 * This class is designed to create and manage alert messages that overlay on top of other content.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class AlertManager {

	/**
	 * Represents the container element to which the alerts are appended.
	 * 
	 * @type {HTMLElement}
	 */
	container;

	/**
	 * Indicates whether the alerts are closeable.
	 * 
	 * @type {boolean}
	 */
	isCloseable = true;

	/**
	 * The time in milliseconds after which the alerts are closed.
	 * 
	 * @type {number|null}
	 */
	autoclose = 8000;

	/**
	 * The class that is added to the created alert.
	 * 
	 * @type {string}
	 */
	alertClass = "alert";

	/**
	 * The class that is added to the created alert when the type is `info`.
	 * 
	 * @type {string}
	 */
	infoAlertClass = "alert--info";

	/**
	 * The class that is added to the created alert when the type is `success`.
	 * 
	 * @type {string}
	 */
	successAlertClass = "alert--success";

	/**
	 * The class that is added to the created alert when the type is `warning`.
	 * 
	 * @type {string}
	 */
	warningAlertClass = "alert--warning";

	/**
	 * The class that is added to the created alert when the type is `error`.
	 * 
	 * @type {string}
	 */
	errorAlertClass = "alert--error";

	/**
	 * The HTML content that is appended to the close button.
	 * 
	 * @type {string}
	 */
	closeButtonHTML = "";

	/**
	 * The label that is added to the close button.
	 * 
	 * @type {string|null}
	 */
	closeButtonLabel = "Close";

	/**
	 * The size, in pixels, between two alerts.
	 * 
	 * @type {number}
	 */
	gap = 10;

	/**
	 * Callback function that is called after the alert manager has been initialized.
	 * 
	 * @type {function():void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after an alert is added.
	 * 
	 * @type {function(HTMLElement):void|null}
	 */
	addAlertCallback = null;

	/**
	 * Callback function that is called after an alert is removed.
	 * 
	 * @type {function():void|null}
	 */
	removeAlertCallback = null;

	/**
	 * Callback function that is called after the alert manager has been destroyed.
	 * 
	 * @type {function():void|null}
	 */
	destroyCallback = null;

	/**
	 * List of all alert elements.
	 * 
	 * @type {HTMLElement[]}
	 */
	alerts = [];

	/**
	 * Available alert types.
	 * 
	 * @type {string[]}
	 */
	static types = ["info", "success", "warning", "error"];

	/**
	 * Creates an alert manager.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.container
	 * @param {boolean} options.isCloseable
	 * @param {number|null} options.autoclose
	 * @param {string} options.alertClass
	 * @param {string} options.infoAlertClass
	 * @param {string} options.successAlertClass
	 * @param {string} options.warningAlertClass
	 * @param {string} options.errorAlertClass
	 * @param {string} options.closeButtonHTML
	 * @param {string|null} options.closeButtonLabel
	 * @param {number} options.gap
	 * @param {function():void} options.initCallback
	 * @param {function(HTMLElement):void} options.addAlertCallback
	 * @param {function():void} options.removeAlertCallback
	 * @param {function():void} options.destroyCallback
	 * @returns {AlertManager}
	 */
	constructor(options) {

		// Test required options
		if (!(options.container instanceof HTMLElement)) {
			throw "Alert \"container\" must be an `HTMLElement`";
		}

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the alert manager
		this.handleEvent = (event) => this.#handleEvents(event);
		if (typeof(this.initCallback) == "function") this.initCallback();
	}

	/**
	 * Adds a new alert.
	 * 
	 * @param {string} message
	 * @param {string} type
	 * @returns {void}
	 */
	addAlert(message, type) {
		this.#testAlertType(type);
		const alert = this.#createAlert(message, type);
		this.container.appendChild(alert);
		this.alerts.push(alert);
		this.#setAutoclose(alert);
		alert.showPopover();
		this.updatePositions();
		if ("vibrate" in navigator) navigator.vibrate(200);
		if (typeof(this.addAlertCallback) == "function") this.addAlertCallback(alert);
	}

	/**
	 * Removes the specified alert.
	 * 
	 * @param {number} index
	 * @returns {void}
	 */
	removeAlert(elem) {
		this.alerts = this.alerts.filter(alert => alert !== elem);
		elem.removeEventListener("toggle", this);
		elem.remove();
		this.updatePositions();
		if (typeof(this.removeAlertCallback) == "function") this.removeAlertCallback();
	}

	/**
	 * Removes all alerts.
	 * 
	 * @returns {void}
	 */
	removeAlerts() {
		this.alerts.forEach((alert) => this.removeAlert(alert));
	}

	/**
	 * Updates the positions of the alerts.
	 * 
	 * @returns {void}
	 */
	updatePositions() {
		let totalHeight = this.#getTotalHeight();
		this.alerts.forEach((alert) => {
			if (alert.matches(":popover-open")) {
				totalHeight -= alert.offsetHeight + this.gap;
				alert.style.transform = `translate3d(0, -${totalHeight}px, 0)`;
			}
		});
	}

	/**
	 * Destroys the alert manager.
	 * 
	 * @returns {void}
	 */
	destroy() {
		this.removeAlerts();
		if (typeof(this.destroyCallback) == "function") this.destroyCallback();
	}

	/**
	 * Creates the alert.
	 * 
	 * @param {string} message
	 * @param {string} type
	 * @returns {HTMLElement}
	 */
	#createAlert(message, type) {
		const wrapper = this.#createWrapper(type);
		const paragraph = this.#createParagraph(message);
		wrapper.appendChild(paragraph);
		wrapper.addEventListener("toggle", this);
		if (this.isCloseable) {
			const closeButton = this.#createCloseButton(wrapper);
			wrapper.appendChild(closeButton);
		}
		return wrapper;
	}

	/**
	 * Creates the wrapper of the alert.
	 * 
	 * @param {string} type
	 * @returns {HTMLElement}
	 */
	#createWrapper(type) {
		let wrapper = document.createElement("div");
		wrapper.popover = "manual";
		wrapper.classList.add(this.alertClass);
		switch (type) {
			case "info":
				wrapper.classList.add(this.infoAlertClass);
				break;
			case "success":
				wrapper.classList.add(this.successAlertClass);
				break;
			case "warning":
				wrapper.classList.add(this.warningAlertClass);
				break;
			case "error":
				wrapper.classList.add(this.errorAlertClass);
				break;
		}
		return wrapper;
	}

	/**
	 * Creates the paragraph element for the alert, to which the message is appended.
	 * 
	 * @param {string} message
	 * @returns {HTMLElement}
	 */
	#createParagraph(message) {
		let paragraph = document.createElement("p");
		paragraph.innerHTML = message;
		return paragraph;
	}

	/**
	 * Creates a close button for the alert.
	 * 
	 * @param {HTMLElement} target
	 * @returns {HTMLElement}
	 */
	#createCloseButton(target) {
		let closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.innerHTML = this.closeButtonHTML;
		closeButton.popoverTargetAction = "hide";
		closeButton.popoverTargetElement = target;
		if (this.closeButtonLabel) {
			closeButton.title = this.closeButtonLabel;
			closeButton.setAttribute('aria-label', this.closeButtonLabel);
		}
		return closeButton;
	}

	/**
	 * Validates that the specified alert type is a valid option.
	 * 
	 * @param {string} type
	 * @returns {void}
	 */
	#testAlertType(type) {
		if (!AlertManager.types.includes(type)) {
			throw "Dialog type is not supported";
		}
	}

	/**
	 * Sets autoclose for the specified alert if it is enabled.
	 * 
	 * @param {string} type
	 * @returns {void}
	 */
	#setAutoclose(alert) {
		if (this.autoclose) {
			setTimeout(() => alert.hidePopover(), this.autoclose);
		}
	}

	/**
	 * Retrieves the total height of all alerts.
	 * 
	 * @returns {number}
	 */
	#getTotalHeight() {
		return this.alerts.reduce((acc, alert) => acc + alert.offsetHeight + this.gap, 0);
	}

	/**
	 * Handles events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "toggle":
				if (!event.target.matches(":popover-open")) {
					this.removeAlert(event.target);
				}
				break;
		}
	}
}

export { AlertManager };