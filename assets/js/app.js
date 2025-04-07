import { AlertManager } from "../js/alert-manager.js";
import { Dialog } from "../js/dialog.js";
import { Dropdown } from "../js/dropdown.js";
import { FocusTracker } from "../js/focus-tracker.js";
import { Glider } from "../js/glider.js";
import { IconManager } from "../js/icon-manager.js";
import { LazyLoadDetector } from "../js/lazy-load-detector.js";
import { Notice } from "../js/notice.js";
import { RangeIndicator } from "../js/range-indicator.js";
import { Router, Route } from "../js/router.js";
import { Slideshow, SlideshowTrigger } from "../js/slideshow.js";
import { Tab } from "../js/tab.js";
import { Validator } from "../js/validator.js";

/**
 * Application
 * This class is designed to handle the workflow of the application.
 * 
 * @author Abel Brencsan
 * @license MIT License
 */
class App {

	/**
	 * Focus tracker for the aplication.
	 * 
	 * @type {FocusTracker}
	 */
	focusTracker = new FocusTracker();

	/**
	 * Icon manager for the apllication.
	 * 
	 * @type {IconManager}
	 */
	iconManager = new IconManager();

	/**
	 * Callback function that is called after routing
	 * 
	 * @type {function(Route,URL,RegExpMatchArray):void}
	 */
	routeCallback = (route, url, match) => {};

	/**
	 * Router for the application.
	 * 
	 * @type {Router}
	 */
	router = new Router({
		routes: [],
		triggers: Array.from(document.querySelectorAll("[data-route-trigger]")),
		routeNotFoundCallback: () => {}
	});

	/**
	 * Alert manager for the apllication.
	 * 
	 * @type {AlertManager}
	 */
	alertManager = new AlertManager({
		container: document.querySelector("[data-alert-container]"),
		closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
	});

	/**
	 * List of gliders.
	 * 
	 * @type {Array<Glider>}
	 */
	gliders = [];

	/**
	 * List of navigation bar sub-navigations.
	 * 
	 * @type {Array<Dropdown>}
	 */
	navbarSubnavs = [];

	/**
	 * List of button sub-navigations.
	 * 
	 * @type {Array<Dropdown>}
	 */
	buttonSubnavs = [];

	/**
	 * List of lazy load detectors.
	 * 
	 * @type {Array<LazyLoadDetector>}
	 */
	lazyLoadDetectors = [];

	/**
	 * List of dialogs.
	 * 
	 * @type {Array<Dialog>}
	 */
	dialogs = [];

	/**
	 * List of slideshows.
	 * 
	 * @type {Array<Slideshow>}
	 */
	slideshows = [];

	/**
	 * List of range indicators.
	 * 
	 * @type {Array<RangeIndicator>}
	 */
	rangeIndicators = [];

	/**
	 * List of validators.
	 * 
	 * @type {Array<Validator>}
	 */
	validators = [];

	/**
	 * List of notices.
	 * 
	 * @type {Array<Notice>}
	 */
	notices = [];

	/**
	 * List of tabs.
	 * 
	 * @type {Array<Tab>}
	 */
	tabs = [];

	/**
	 * List of pages.
	 * 
	 * @type {Array<Page>}
	 */
	pages = [];

	/**
	 * Breakpoints for responsive layout handling.
	 * 
	 * @param {Object} breakpoints
	 * @param {string} breakpoints.large - The breakpoint for large devices.
	 * @param {string} breakpoints.medium - The breakpoint for medium devices.
	 * @param {string} breakpoints.small - The breakpoint for small devices.
	 * @param {string} breakpoints.xsmall - The breakpoint for xsmall devices.
	 */
	static breakpoints = {
		large: "(max-width: 82em)",
		medium: "(max-width: 62em)",
		small: "(max-width: 47em)",
		xsmall: "(max-width: 32em)"
	};

	/**
	 * Creates an application.
	 * 
	 * @param {Object} options
	 * @returns {App}
	 */
	constructor(options) {

		this.#detectViewTransitionType();

		// Set fields from options
		if (typeof(options) == "object") {
			Object.entries(options).forEach(([key, value]) => {
				this[key] = value;
			});
		}

		// Initialize the application
		this.handleEvent = function(event) {
			this.#handleEvents(event);
		};
		document.body.classList.remove("no-js");
		window.addEventListener("touchstart", this);
		this.#initGliders();
		this.#initNavbarSubnavs();
		this.#initButtonSubnavs();
		this.#initLazyLoadDetectors();
		this.#initDialogs();
		this.#initSlideshows();
		this.#initRangeIndicators();
		this.#initValidators();
		this.#initNotices();
		this.#initTabs();
		this.#detectBreakpointChange();
		this.#detectOffline();
		
	}

	#detectViewTransitionType() {}

	/**
	 * Initialize gliders.
	 * 
	 * @returns {void}
	 */
	#initGliders() {
		let elems = document.querySelectorAll("[data-glider]");
		elems.forEach((elem) => {
			this.gliders.push(new Glider({
				wrapper: elem,
				viewport: elem.querySelector("[data-glider-viewport]"),
				items: elem.querySelectorAll("[data-glider-list-item]"),
				prevTrigger: elem.querySelector("[data-glider-prev-trigger]"),
				nextTrigger: elem.querySelector("[data-glider-next-trigger]")
			}));
		});
	}

	/**
	 * Initialize navigation bar sub-navigations.
	 * 
	 * @returns {void}
	 */
	#initNavbarSubnavs() {
		let elems = document.querySelectorAll("[data-navbar-subnav]");
		elems.forEach((elem) => {
			this.navbarSubnavs.push(new Dropdown({
				element: elem.querySelector("[data-navbar-subnav-element]"),
				trigger: elem.querySelector("[data-navbar-subnav-trigger]")
			}));
		});
	}

	/**
	 * Initialize button sub-navigations.
	 * 
	 * @returns {void}
	 */
	#initButtonSubnavs() {
		let elems = document.querySelectorAll("[data-button-subnav]");
		elems.forEach((elem) => {
			this.buttonSubnavs.push(new Dropdown({
				trigger: elem.querySelector("[data-button-subnav-trigger]"),
				element: elem.querySelector("[data-button-subnav-element]")
			}));
		});
	}

	/**
	 * Initialize lazy load detectors.
	 * 
	 * @returns {void}
	 */
	#initLazyLoadDetectors() {
		let elems = document.querySelectorAll("img[loading=lazy]");
		elems.forEach((elem) => {
			this.lazyLoadDetectors.push(new LazyLoadDetector({
				element: elem
			}));
		});
	}

	/**
	 * Initialize dialogs.
	 * 
	 * @returns {void}
	 */
	#initDialogs() {
		let elems = document.querySelectorAll("[data-dialog]");
		elems.forEach((elem) => {
			this.dialogs.push(new Dialog({
				type: elem.getAttribute("data-dialog"),
				source: elem.getAttribute("data-dialog-source") || elem.getAttribute("href"),
				triggers: [elem],
				description: elem.getAttribute("data-dialog-description") || "",
				customClasses: Dialog.parseCustomClasses(elem, "data-dialog-classes"),
				closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>"
			}));
		});
		this.#addDialogAdditionalTriggers();
	}

	/**
	 * Adds additional triggers to the dialogs.
	 * 
	 * @returns {void}
	 */
	#addDialogAdditionalTriggers() {
		let triggerElems = document.querySelectorAll("[data-dialog-trigger]");
		triggerElems.forEach((triggerElem) => {
			this.dialogs.forEach((dialog) => {
				if (dialog.source == triggerElem.getAttribute('data-dialog-trigger')) {
					dialog.addTrigger(triggerElem);
				}
			});
		});
	}

	/**
	 * Initialize slideshows.
	 * 
	 * @returns {void}
	 */
	#initSlideshows() {
		let elems = document.querySelectorAll("[data-slideshow]");
		elems.forEach((elem) => {
			this.slideshows.push(new Slideshow({
				source: `#${elem.id}`,
				closeButtonHTML: "<svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#icon-close\"></use></svg>",
				gliderWrapper: elem.querySelector("[data-slideshow-glider]"),
				gliderViewport: elem.querySelector("[data-slideshow-glider-viewport]"),
				gliderItems: elem.querySelectorAll("[data-slideshow-glider-list-item]"),
				gliderPrevTrigger: elem.querySelector("[data-slideshow-glider-prev-trigger]"),
				gliderNextTrigger: elem.querySelector("[data-slideshow-glider-next-trigger]")
			}));
		});
		this.#addSlideshowAdditionalTriggers();
	}

	/**
	 * Adds additional triggers to the sideshows.
	 * 
	 * @returns {void}
	 */
	#addSlideshowAdditionalTriggers() {
		let triggerElems = document.querySelectorAll("[data-slideshow-trigger]");
		triggerElems.forEach((triggerElem) => {
			this.slideshows.forEach((slideshow) => {
				if (slideshow.source == triggerElem.getAttribute('data-slideshow-trigger')) {
					slideshow.addTrigger(new SlideshowTrigger({
						elem: triggerElem,
						index: parseInt(triggerElem.getAttribute("data-slideshow-trigger-index")) || 0
					}));
				}
			});
		});
	}

	/**
	 * Initialize range indicators.
	 * 
	 * @returns {void}
	 */
	#initRangeIndicators() {
		let elems = document.querySelectorAll("[data-range]");
		elems.forEach((elem) => {
			let input = elem.querySelector("input");
			let indicator = elem.querySelector("[data-range-indicator]");
			this.rangeIndicators.push(new RangeIndicator({
				input: input,
				indicator: indicator,
				formatter: (value) => {
					return value.toLocaleString("en-US");
				}
			}));
		});
	}

	/**
	 * Initialize validators.
	 * 
	 * @returns {void}
	 */
	#initValidators() {
		let elems = document.querySelectorAll("[data-validator]");
		elems.forEach((elem) => {
			this.validators.push(new Validator({
				form: elem,
				invalidCallback: (input, message) => {
					let formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.setAttribute("data-label", message);
						formItem.classList.add("has-invalid-field");
						formItem.classList.remove("has-valid-field");
					}
					
				},
				validCallback: (input) => {
					let formItem = input.closest("div.form-item");
					if (formItem) {
						formItem.removeAttribute("data-label");
						formItem.classList.remove("has-invalid-field");
						formItem.classList.add("has-valid-field");
					}
				},
				hasInvalidCallback: (elems) => {
					this.alertManager.addAlert("One or more fields are invalid!", "error");
				}
			}));
		});
	}

	/**
	 * Initialize notices.
	 * 
	 * @returns {void}
	 */
	#initNotices() {
		let elems = document.querySelectorAll("[data-notice]");
		elems.forEach((elem) => {
			this.notices.push(new Notice({
				element: elem,
				dismissButton: elem.querySelector("[data-notice-dismiss]")
			}));
		});
	}

	/**
	 * Initialize tabs.
	 * 
	 * @returns {void}
	 */
	#initTabs() {
		let elems = document.querySelectorAll("[data-tab]");
		elems.forEach((elem) => {
			this.tabs.push(new Tab({
				wrapper: elem,
				triggers: elem.querySelectorAll("[data-tab-trigger]"),
				panels: elem.querySelectorAll("[data-tab-panel]")
			}));
		});
	}

	/**
	 * Detect immediate and event-driven changes in breakpoints.
	 * 
	 * @returns {void}
	 */
	#detectBreakpointChange() {
		Object.entries(App.breakpoints).forEach(([, query]) => {
			let mql = window.matchMedia(query);
			this.#switchNavbarType(mql);
			mql.addEventListener("change", (event) => {
				this.#onBreakpointChange(event);
			});
		});
	}

	/**
	 * Detects whether the user is offline and has no access to the network.
	 * 
	 * @returns {void}
	 */
	#detectOffline() {
		if (!navigator.onLine) {
			document.body.classList.add("is-offline");
		}
		window.addEventListener("offline", () => {
			document.body.classList.add("is-offline");
			this.alertManager.addAlert("You are offline!", "error");
		});
		window.addEventListener("online", () => {
			document.body.classList.remove("is-offline");
			this.alertManager.addAlert("You are online!", "success");
		});
	}

	/**
	 * Switch between offset and full navigation bar on medium breakpoint.
	 * 
	 * @param {MediaQueryList} mql
	 * @returns {void}
	 */
	#switchNavbarType(mql) {
		if (mql.media == App.breakpoints.medium) {
			const navbarNav = document.getElementById('navbar-nav');
			if (navbarNav) {
				if (mql.matches) {
					navbarNav.popover = "auto";
				} else {
					navbarNav.removeAttribute("popover");
				}
			}
		}
	}

	/**
	 * Event handler that is triggered when the breakpoint has changed.
	 * 
	 * @param {MediaQueryListEvent} event
	 * @returns {void}
	 */
	#onBreakpointChange(event) {
		this.#switchNavbarType(event.target);
		this.alertManager.updatePositions();
		this.gliders.forEach((glider) => {
			glider.detectIsScrollable();
		});
		this.slideshows.forEach((slideshow) => {
			if (slideshow.glider) slideshow.glider.detectIsScrollable();
		});
		this.pages.forEach((page) => {
			page.onBreakpointChange(event);
		});
	}

	/**
	 * Handles actions when the user is using the application on a touch-capable device.
	 * 
	 * @returns {void}
	 */
	#isTouchDetected() {
		document.body.classList.remove("no-touch");
		window.removeEventListener("touchstart", this);
	}

	/**
	 * Handle events.
	 * 
	 * @param {Event} event
	 * @returns {void}
	 */
	#handleEvents(event) {
		switch (event.type) {
			case "touchstart":
				this.#isTouchDetected();
				break;
		}
	}
}

export { App };