import { Autocomplete } from "../js/autocomplete.js";
import { CookieManager } from "../js/cookie-manager.js";
import { Dialog } from "../js/dialog.js";
import { Dropdown } from "../js/dropdown.js";
import { FocusTracker } from "../js/focus-tracker.js";
import { Glider } from "../js/glider.js";
import { IconManager } from "../js/icon-manager.js";
import { LazyLoadDetector } from "../js/lazy-load-detector.js";
import { Navbar } from "../js/navbar.js";
import { Notice } from "../js/notice.js";
import { RangeIndicator } from "../js/range-indicator.js";
import { Reveal } from "../js/reveal.js";
import { Router, Route } from "../js/router.js";
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
	 * Cookie manager for the apllication.
	 * 
	 * @type {CookieManager}
	 */
	cookieManager = new CookieManager();

	/**
	 * Navigation bar
	 * 
	 * @type {Navbar|null}
	 */
	navbar = null;

	/**
	 * Reveal to detect elements that are above, below, or in the viewport.
	 * 
	 * @type {Reveal}
	 */
	reveal = new Reveal();

	/**
	 * Autocomplete for the search bar.
	 * 
	 * @type {Autocomplete}
	 */
	searchAutocomplete = new Autocomplete({
		input: document.getElementById("query"),
		getSuggestions: (term, callback) => {
			const choices = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
			let suggestions = [];
			term = term.toLowerCase();
			choices.forEach((choice) => {
				if (~choice.toLowerCase().indexOf(term)) {
					 suggestions.push(choice);
				}
			});
			callback(suggestions);
		},
		renderItem: (suggestion, term) => suggestion,
		renderInputValue: (suggestion) => suggestion
	});

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
	 * List of gliders.
	 * 
	 * @type {Array<Glider>}
	 */
	gliders = [];

	/**
	 * List of button subnavigations.
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
	 * @param {string} breakpoints.small - The breakpoint for small devices
	 * @param {string} breakpoints.xsmall - The breakpoint for xsmall devices
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
		this.#initNavbar();
		this.#initGliders();
		this.#initButtonSubnavs();
		this.#initLazyLoadDetectors();
		this.#initDialogs();
		this.#initRangeIndicators();
		this.#initValidators();
		this.#initNotices();
		this.#initTabs();
		this.#addElemsToReveal();
		this.#detectBreakpointChange();
		this.#detectOffline();
	}

	/**
	 * Initialize the navigation bar.
	 * 
	 * @returns {void}
	 */
	#initNavbar() {
		this.navbar = new Navbar();
	}

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
	 * Initialize button subnavigations.
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
			let customclassesStr = elem.getAttribute("data-dialog-classes");
			let customClasses = customclassesStr ? customclassesStr.split(" ") : [];
			this.dialogs.push(new Dialog({
				type: elem.getAttribute("data-dialog"),
				source:elem.getAttribute("data-dialog-source") || elem.getAttribute("href"),
				trigger: elem,
				description: elem.getAttribute("data-dialog-description") || "",
				customClasses: customClasses
			}));
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
	 * Add elements to reveal.
	 * 
	 * @returns {void}
	 */
	#addElemsToReveal() {
		let elems = document.querySelectorAll("[data-reveal]");
		elems.forEach((elem) => {
			this.reveal.add(elem);
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
			mql.addEventListener("change", (event) => {
				this.#onBreakpointChange(event);
			});
			this.#switchNavbarType(mql);
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
		});
		window.addEventListener("online", () => {
			document.body.classList.remove("is-offline");
		});
	}

	/**
	 * Switch between offset and full navigation bar on medium breakpoint.
	 * 
	 * @param {MediaQueryList} mql
	 * @returns {void}
	 */
	#switchNavbarType(mql) {
		if (!this.navbar) return;
		if (mql.media == App.breakpoints.medium) {
			if (mql.matches) {
				this.navbar.switchToOffsetNav();
			} else {
				this.navbar.switchToFullNav();
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
		this.gliders.forEach((glider) => {
			glider.detectIsScrollable();
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