/**
 * Alert manager
 * This class is designed to create and manage alert messages that overlay on top of other content.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class AlertManager {

	/**
	 * The container element to which the alerts are appended.
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
	 * @type {function(AlertManager):void|null}
	 */
	initCallback = null;

	/**
	 * Callback function that is called after an alert is added.
	 * 
	 * @type {function(AlertManager,HTMLElement):void|null}
	 */
	addAlertCallback = null;

	/**
	 * Callback function that is called after an alert is removed.
	 * 
	 * @type {function(AlertManager):void|null}
	 */
	removeAlertCallback = null;

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
	 * The total height of all alerts.
	 * 
	 * @type {number}
	 */
	get totalHeight() {
		return this.alerts.reduce((acc, alert) => acc + alert.offsetHeight + this.gap, 0);
	}

	/**
	 * Creates an alert manager.
	 * 
	 * @param {Object} options
	 * @param {HTMLElement} options.container - The container element to which the alerts are appended.
	 * @param {boolean} options.isCloseable - Indicates whether the alerts are closeable.
	 * @param {number|null} options.autoclose - The time in milliseconds after which the alerts are closed.
	 * @param {string} options.alertClass - The class that is added to the created alert.
	 * @param {string} options.infoAlertClass - The class that is added to the created alert when the type is `info`.
	 * @param {string} options.successAlertClass - The class that is added to the created alert when the type is `success`.
	 * @param {string} options.warningAlertClass - The class that is added to the created alert when the type is `warning`.
	 * @param {string} options.errorAlertClass - The class that is added to the created alert when the type is `error`.
	 * @param {string} options.closeButtonHTML - The HTML content that is appended to the close button.
	 * @param {string|null} options.closeButtonLabel - The label that is added to the close button.
	 * @param {number} options.gap - The size, in pixels, between two alerts.
	 * @param {function(AlertManager):void|null} options.initCallback - Callback function that is called after the alert manager has been initialized.
	 * @param {function(AlertManager,HTMLElement):void|null} options.addAlertCallback - Callback function that is called after an alert is added.
	 * @param {function(AlertManager):void|null} options.removeAlertCallback - Callback function that is called after an alert is removed.
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
		if (typeof(this.initCallback) == "function") this.initCallback(this);
	}

	/**
	 * Adds a new alert.
	 * 
	 * @param {string} message - The message of the alert.
	 * @param {string} type - The type of the alert.
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
		if (typeof(this.addAlertCallback) == "function") this.addAlertCallback(this, alert);
	}

	/**
	 * Removes the specified alert.
	 * 
	 * @param {number} index - The index of the alert.
	 * @returns {void}
	 */
	removeAlert(elem) {
		this.alerts = this.alerts.filter(alert => alert !== elem);
		elem.removeEventListener("toggle", this);
		elem.remove();
		this.updatePositions();
		if (typeof(this.removeAlertCallback) == "function") this.removeAlertCallback(this);
	}

	/**
	 * Updates the positions of the alerts.
	 * 
	 * @returns {void}
	 */
	updatePositions() {
		let totalHeight = this.totalHeight;
		this.alerts.forEach((alert) => {
			if (alert.matches(":popover-open")) {
				totalHeight -= alert.offsetHeight + this.gap;
				alert.style.transform = `translate3d(0, -${totalHeight}px, 0)`;
			}
		});
	}

	/**
	 * Creates the alert.
	 * 
	 * @param {string} message - The message of the alert.
	 * @param {string} type - The type of the alert.
	 * @returns {HTMLElement} The created alert.
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
	 * @param {string} type - The type of the alert.
	 * @returns {HTMLElement} - The created wrapper for the alert.
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
	 * @param {string} message - The message of the alert.
	 * @returns {HTMLElement} - The created paragraph for the alert.
	 */
	#createParagraph(message) {
		let paragraph = document.createElement("p");
		paragraph.innerHTML = message;
		return paragraph;
	}

	/**
	 * Creates a close button for the alert.
	 * 
	 * @param {HTMLElement} target - The wrapper of the alert.
	 * @returns {HTMLElement} - The created close button.
	 */
	#createCloseButton(wrapper) {
		let closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.innerHTML = this.closeButtonHTML;
		closeButton.popoverTargetAction = "hide";
		closeButton.popoverTargetElement = wrapper;
		if (this.closeButtonLabel) {
			closeButton.title = this.closeButtonLabel;
			closeButton.setAttribute('aria-label', this.closeButtonLabel);
		}
		return closeButton;
	}

	/**
	 * Validates that the specified alert type is a valid option.
	 * 
	 * @param {string} type - The type of the alert.
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
	 * @param {string} type - The type of the alert.
	 * @returns {void}
	 */
	#setAutoclose(alert) {
		if (this.autoclose) {
			setTimeout(() => alert.hidePopover(), this.autoclose);
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
			case "toggle":
				if (!event.target.matches(":popover-open")) {
					this.removeAlert(event.target);
				}
				break;
		}
	}
}

export { AlertManager };